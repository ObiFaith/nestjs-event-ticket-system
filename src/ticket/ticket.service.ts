import { TicketTypeResponseDto } from './dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTicketTypeDto } from './dto/ticket.dto';
import * as SYS_MSG from 'src/constants/system-messages';
import { TicketType } from './entities/ticket-type.entity';
import { Event, EventStatus } from 'src/event/entities/event.entity';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,

    private readonly dataSource: DataSource, // For transactions
  ) {}

  /**
   * Map TicketType entity to TicketTypeResponseDto
   * @param ticket TicketType entity
   * @returns TicketTypeResponseDto
   */
  private mapToTicketTypeResponseDto(
    ticket: TicketType,
  ): TicketTypeResponseDto {
    return {
      id: ticket.id,
      eventId: ticket.eventId,
      name: ticket.name,
      price: ticket.price,
      currency: ticket.currency,
      totalQuantity: ticket.totalQuantity,
      reservedQuantity: ticket.reservedQuantity,
      soldQuantity: ticket.soldQuantity,
      saleStartsAt: ticket.saleStartsAt,
      saleEndsAt: ticket.saleEndsAt,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    };
  }

  /**
   * Create a ticket type for an event
   * @param userId User id
   * @param eventId Event id
   * @param CreateTicketTypeDto Ticket type dto
   */
  async createType(
    userId: string,
    eventId: string,
    CreateTicketTypeDto: CreateTicketTypeDto,
  ) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      select: ['id', 'status', 'endsAt', 'creatorId'],
    });

    // Check event already exists
    if (!event) {
      throw new NotFoundException(SYS_MSG.EVENT_NOT_FOUND);
    }
    // Check user created the event
    if (event.creatorId != userId) {
      throw new ForbiddenException('Only the event creator can add tickets');
    }
    // Validate event status
    if (
      event.status === EventStatus.CANCELLED ||
      event.status === EventStatus.ENDED
    ) {
      throw new BadRequestException(
        'Cannot add tickets to cancelled or ended events',
      );
    }

    const { name, totalQuantity, price, currency, saleStart, saleEnd } =
      CreateTicketTypeDto;

    // Validate input
    if (!name || !name.trim()) {
      throw new BadRequestException('Ticket name is required');
    }
    if (totalQuantity <= 0) {
      throw new BadRequestException('Total quantity must be greater than 0');
    }

    // parse saleStart & saleEnd
    const saleStartDate = new Date(saleStart);
    const saleEndDate = new Date(saleEnd);

    // validate ticket sales interval
    if (saleStartDate < new Date()) {
      throw new BadRequestException('Ticket saleStart cannot be in the past');
    }

    if (saleStartDate >= saleEndDate) {
      throw new BadRequestException('saleStart must be before saleEnd');
    }

    if (saleEndDate > new Date(event.endsAt)) {
      throw new BadRequestException(
        'Ticket saleEnd cannot be after event end time',
      );
    }

    // Transaction creation
    const ticket = await this.dataSource.transaction(async (manager) => {
      return await manager.save(
        manager.create(TicketType, {
          event,
          name: name.trim(),
          price,
          currency,
          totalQuantity,
          reservedQuantity: 0,
          soldQuantity: 0,
          saleStartsAt: saleStartDate,
          saleEndsAt: saleEndDate,
        }),
      );
    });

    return {
      message: SYS_MSG.TICKET_TYPE_CREATED_SUCCESSFULLY,
      ticket: this.mapToTicketTypeResponseDto(ticket),
    };
  }
}
