import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-item.entity';
import * as SYS_MSG from 'src/constants/system-messages';
import { Cart, CartStatus } from './entities/cart.entity';
import { DataSource, In, MoreThan, Repository } from 'typeorm';
import { TicketType } from 'src/ticket/entities/ticket-type.entity';
import { Event, EventStatus } from 'src/event/entities/event.entity';
import { CartItemDto, CartItemResponseDto, CartResponseDto } from './dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class CartService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}

  private mapToCartItemResponseDto(cartItem: CartItem): CartItemResponseDto {
    return {
      id: cartItem.id,
      ticketTypeId: cartItem.ticketTypeId,
      name: cartItem.ticketType.name,
      price: cartItem.ticketType.price,
      currency: cartItem.ticketType.currency,
      quantity: cartItem.quantity,
    };
  }

  private mapToCartResponseDto(cart: Cart): CartResponseDto {
    const items = cart.items.map((item) => this.mapToCartItemResponseDto(item));

    return {
      id: cart.id,
      userId: cart.userId,
      status: cart.status,
      items,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
      expiresAt: cart.expiresAt,
    };
  }

  /**
   * Add tickets to the user's cart
   * @param userId User id
   * @param cartItemDto cart item details
   */
  async addToCart(userId: string, { quantity, ticketTypeId }: CartItemDto) {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be at least 1');
    }

    // Transaction creation
    const cart = await this.dataSource.transaction(async (manager) => {
      const now = new Date();
      // Check ticket type already exists
      const ticketType = await manager.findOne(TicketType, {
        where: { id: ticketTypeId },
        lock: { mode: 'pessimistic_write' }, // Row-level lock
      });

      if (!ticketType) {
        throw new NotFoundException(SYS_MSG.TICKET_TYPE_NOT_FOUND);
      }

      // Validate event
      const event = await manager.findOne(Event, {
        where: { id: ticketType.eventId },
        select: ['status', 'endsAt'],
      });

      const validationErrors = [
        !event && SYS_MSG.EVENT_NOT_FOUND,
        event?.status !== EventStatus.ACTIVE &&
          'Cannot reserve tickets for this event',
        event && now > event.endsAt && 'Event has ended',
        (ticketType.saleStartsAt > now || ticketType.saleEndsAt < now) &&
          'Ticket sale period is not active',
      ].filter(Boolean);

      if (validationErrors.length > 0) {
        throw new BadRequestException(validationErrors[0] as string);
      }

      // Check availability
      const availableQuantity =
        ticketType.totalQuantity -
        ticketType.reservedQuantity -
        ticketType.soldQuantity;

      if (availableQuantity < quantity) {
        throw new BadRequestException('Not enough tickets available');
      }

      let cart = await manager.findOne(Cart, {
        where: { userId, status: CartStatus.ACTIVE },
        relations: ['items'],
        select: ['id', 'expiresAt', 'status'],
      });

      // Expire old cart if needed
      if (cart && cart.expiresAt < now) {
        const ticketTypeIds = cart.items.map((item) => item.ticketTypeId);
        const ticketTypes = await manager.find(TicketType, {
          where: { id: In(ticketTypeIds) },
          lock: { mode: 'pessimistic_write' },
        });
        const map = new Map(ticketTypes.map((t) => [t.id, t]));

        for (const item of cart.items) {
          map.get(item.ticketTypeId)!.reservedQuantity -= item.quantity;
        }

        await manager.save(ticketTypes);
        cart.status = CartStatus.EXPIRED;
        await manager.save(cart);
        cart = null;
      }

      // Create new cart if empty
      if (!cart) {
        cart = manager.create(Cart, {
          userId,
          status: CartStatus.ACTIVE,
          expiresAt: new Date(now.getTime() + 15 * 60 * 1000), // 15 minutes from now
        });

        await manager.save(cart);
        cart.items = [];
      }

      let cartItem = await manager.findOne(CartItem, {
        where: { cartId: cart.id, ticketTypeId },
      });

      // Add or update cart item
      if (!cartItem) {
        cartItem = manager.create(CartItem, {
          cartId: cart.id,
          ticketTypeId,
          quantity,
        });
      } else {
        // Increment quantity
        if (availableQuantity < quantity + cartItem.quantity) {
          throw new BadRequestException(
            'Not enough tickets available to increase quantity',
          );
        }

        cartItem.quantity += quantity;
      }

      await manager.save(cartItem);
      await manager.increment(
        TicketType,
        { id: ticketTypeId },
        'reservedQuantity',
        quantity,
      );

      // Return updated cart
      return await manager.findOne(Cart, {
        where: { id: cart.id },
        relations: ['items', 'items.ticketType'],
      });
    });

    return {
      message: SYS_MSG.CART_ITEM_ADDED_SUCCESSFULLY,
      cart: cart ? this.mapToCartResponseDto(cart) : cart,
    };
  }

  async getActiveCart(userId: string) {
    const cart = await this.cartRepository.findOne({
      where: {
        userId,
        expiresAt: MoreThan(new Date()),
      },
      relations: ['items'],
    });

    return {
      message: SYS_MSG.CART_RETRIEVED_SUCCESSFULLY,
      cart: cart ? cart : [],
    };
  }
}
