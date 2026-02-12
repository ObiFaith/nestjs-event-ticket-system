import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as SYS_MSG from 'src/constants/system-messages';
import { TicketType } from './entities/ticket-type.entity';
import { CreateTicketTypeDto, UpdateTicketTypeDto } from './dto';
import { Event, EventStatus } from 'src/modules/event/entities/event.entity';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(TicketType)
    private readonly ticketTypeRepository: Repository<TicketType>,

    private readonly dataSource: DataSource, // For transactions
  ) {}

  validateTicketType(
    ticketType: CreateTicketTypeDto,
    eventStartsAt: Date,
    eventEndsAt: Date,
  ) {
    const { name, saleStartsAt, saleEndsAt, totalQuantity } = ticketType;
    const validationErrors = [
      (!name || !name.trim()) && 'Ticket name is required',
      totalQuantity <= 0 && 'Total quantity must be greater than 0',
      (saleStartsAt < eventStartsAt || saleEndsAt > eventEndsAt) &&
        'Ticket sale period must fall within event duration',
      saleStartsAt >= saleEndsAt && 'Invalid ticket sale timeframe',
    ].filter(Boolean);

    if (validationErrors.length > 0) {
      throw new BadRequestException(validationErrors[0] as string);
    }
  }

  /**
   * Create a ticket type for an event
   * @param userId User id
   * @param eventId Event id
   * @param payload List of Ticket types
   */
  async createTicketType(
    userId: string,
    eventId: string,
    payload: Array<CreateTicketTypeDto>,
  ) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      select: ['id', 'status', 'startsAt', 'endsAt', 'creatorId'],
    });

    // Check event already exists
    if (!event) {
      throw new NotFoundException(SYS_MSG.EVENT_NOT_FOUND);
    }
    // Check user created the event
    if (event.creatorId != userId) {
      throw new ForbiddenException('Only the event creator can add tickets');
    }
    // Check event status is active
    if (event.status !== EventStatus.ACTIVE) {
      throw new BadRequestException(
        'Cannot add tickets to cancelled or ended events',
      );
    }

    const ticketTypes = payload.map((dto) => {
      this.validateTicketType(dto, event.startsAt, event.endsAt);
      return this.ticketTypeRepository.create({
        ...dto,
        name: dto.name.trim(),
        eventId,
      });
    });

    await this.ticketTypeRepository.insert(ticketTypes);

    return {
      message: SYS_MSG.TICKET_TYPE_CREATED_SUCCESSFULLY,
      ticketTypes,
    };
  }

  async findAllTicketType(eventId: string) {
    const ticketTypes = await this.ticketTypeRepository.find({
      where: {
        event: { id: eventId },
      },
    });

    return {
      message: SYS_MSG.TICKET_TYPES_RETRIEVED_SUCCESSFULLY,
      ticketTypes,
    };
  }

  async findTicketType(eventId: string, ticketId: string) {
    const ticketType = await this.ticketTypeRepository.findOne({
      where: {
        id: ticketId,
        event: { id: eventId },
      },
    });

    if (!ticketType) throw new NotFoundException(SYS_MSG.TICKET_TYPE_NOT_FOUND);

    return {
      message: SYS_MSG.TICKET_TYPE_RETRIEVED_SUCCESSFULLY,
      ticketType,
    };
  }

  async updateTicketType(
    eventId: string,
    ticketId: string,
    dto: UpdateTicketTypeDto,
  ) {
    const { ticketType } = await this.findTicketType(eventId, ticketId);
    Object.assign(ticketType, dto);

    try {
      const updatedticketType =
        await this.ticketTypeRepository.save(ticketType);

      return {
        message: SYS_MSG.TICKET_TYPE_UPDATED_SUCCESSFULLY,
        ticketType: updatedticketType,
      };
    } catch {
      throw new InternalServerErrorException('Failed to update ticketType');
    }
  }
}
