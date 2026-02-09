import { TicketTypeResponseDto } from './dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as SYS_MSG from 'src/constants/system-messages';
import { TicketType } from './entities/ticket-type.entity';
import { CreateTicketTypeDto, UpdateTicketTypeDto } from './dto';
import { Event, EventStatus } from 'src/event/entities/event.entity';
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
  async createTicketType(
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
    // Check event status is active
    if (event.status !== EventStatus.ACTIVE) {
      throw new BadRequestException(
        'Cannot add tickets to cancelled or ended events',
      );
    }

    const { name, saleStartsAt, saleEndsAt, totalQuantity } =
      CreateTicketTypeDto;

    // Validate input
    if (!name || !name.trim()) {
      throw new BadRequestException('Ticket name is required');
    }
    if (totalQuantity <= 0) {
      throw new BadRequestException('Total quantity must be greater than 0');
    }
    // Ticket sale must be within event lifespan
    if (saleStartsAt < event.startsAt || saleEndsAt > event.endsAt) {
      throw new BadRequestException(
        'Ticket sale period must fall within event duration',
      );
    }
    if (saleStartsAt >= saleEndsAt) {
      throw new BadRequestException('Invalid ticket sale timeframe');
    }

    // Transaction creation
    const ticket = await this.dataSource.transaction(async (manager) => {
      return await manager.save(
        manager.create(TicketType, {
          ...CreateTicketTypeDto,
          name: name.trim(),
          reservedQuantity: 0,
          soldQuantity: 0,
          saleStartsAt,
          saleEndsAt,
          eventId,
        }),
      );
    });

    return {
      message: SYS_MSG.TICKET_TYPE_CREATED_SUCCESSFULLY,
      ticket: this.mapToTicketTypeResponseDto(ticket),
    };
  }

  async findAllTicketType() {
    const ticketTypes = await this.ticketTypeRepository.find();

    return {
      message: SYS_MSG.TICKET_TYPES_RETRIEVED_SUCCESSFULLY,
      ticketTypes,
    };
  }

  async findTicketType(id: string) {
    const ticketType = await this.ticketTypeRepository.findOne({
      where: { id },
    });

    if (!ticketType) throw new NotFoundException(SYS_MSG.TICKET_TYPE_NOT_FOUND);

    return {
      message: SYS_MSG.TICKET_TYPE_RETRIEVED_SUCCESSFULLY,
      ticketType,
    };
  }

  async updateTicketType(id: string, dto: UpdateTicketTypeDto) {
    const { ticketType } = await this.findTicketType(id);
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
