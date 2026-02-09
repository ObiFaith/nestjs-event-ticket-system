import { DataSource } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import * as SYS_MSG from 'src/constants/system-messages';
import { Cart, CartStatus } from './entities/cart.entity';
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
  constructor(private readonly dataSource: DataSource) {}

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
   * Ensures:
   * - Row-level lock on ticket type
   * - One active cart per user
   * - Cart expiration handled
   * - Concurrency-safe reservation
   * @param userId User id
   * @param cartItemDto cart item details
   */
  async addToCart(userId: string, { quantity, ticketTypeId }: CartItemDto) {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be at least 1');
    }

    // Transaction creation
    const cart = await this.dataSource.transaction(async (manager) => {
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

      if (!event) {
        throw new NotFoundException(SYS_MSG.EVENT_NOT_FOUND);
      }
      if (event.status !== EventStatus.ACTIVE) {
        throw new BadRequestException('Cannot reserve tickets for this event');
      }

      const now = new Date();

      if (now > event.endsAt) {
        throw new BadRequestException('Event has ended');
      }
      // Ticket sale window check
      if (ticketType.saleStartsAt > now || ticketType.saleEndsAt < now) {
        throw new BadRequestException('Ticket sale period is not active');
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
        cart.status = CartStatus.EXPIRED;

        // Release reservations for expired cart items
        for (const item of cart.items) {
          const itemTicketType = await manager.findOne(TicketType, {
            where: { id: item.ticketTypeId },
            lock: { mode: 'pessimistic_write' }, // Row-level lock
          });

          if (itemTicketType) {
            itemTicketType.reservedQuantity -= item.quantity;
            await manager.save(itemTicketType);
          }
        }

        await manager.save(cart);
        cart = null; // force new cart creation
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
      // Update reserved quantity on TicketType
      ticketType.reservedQuantity += quantity;
      await manager.save(ticketType);

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
}
