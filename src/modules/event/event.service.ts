import { CLIENT_RENEG_LIMIT } from 'tls';
import { EventResponseDto } from './dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEventDto, UpdateEventDto } from './dto';
import { TicketService } from '../ticket/ticket.service';
import * as SYS_MSG from 'src/constants/system-messages';
import { Event, EventStatus } from './entities/event.entity';
import { TicketType } from '../ticket/entities/ticket-type.entity';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly ticketService: TicketService,
    private readonly dataSource: DataSource, // For transactions
  ) {}

  /**
   * Create event for a user
   * @param userId User id
   * @param createEventDto Event details
   * @returns Promise<{ message: string; event: EventResponseDto }>
   */
  async create(
    userId: string,
    createEventDto: CreateEventDto,
  ): Promise<{ message: string; event: EventResponseDto }> {
    const trimmedTitle = createEventDto.title.trim();
    const { startsAt, endsAt, ticketTypes = [] } = createEventDto;
    // Validate input
    if (!trimmedTitle || !startsAt || !endsAt) {
      throw new BadRequestException('Missing required fields');
    }
    // validate event interval
    if (startsAt >= endsAt) {
      throw new BadRequestException('Event startsAt must be before endsAt');
    }
    // Validate ticketType(s)
    ticketTypes.forEach((dto) =>
      this.ticketService.validateTicketType(dto, startsAt, endsAt),
    );

    // create and save event to db
    return await this.dataSource.transaction(async (manager) => {
      const event = await manager.save(Event, {
        ...createEventDto,
        title: trimmedTitle,
        creatorId: userId,
      });

      if (ticketTypes?.length > 0) {
        const ticketEntities = ticketTypes.map((dto) =>
          manager.create(TicketType, {
            ...dto,
            name: dto.name.trim(),
            reservedQuantity: 0,
            soldQuantity: 0,
            eventId: event.id,
          }),
        );

        await manager.insert(TicketType, ticketEntities);
      }

      return {
        message: SYS_MSG.EVENT_CREATED_SUCCESSFULLY,
        event,
      };
    });
  }

  async findAll(): Promise<{ message: string; events: Event[] }> {
    const events = await this.eventRepository.find();
    return {
      message: SYS_MSG.EVENTS_RETRIEVED_SUCCESSFULLY,
      events,
    };
  }

  async findOne(id: string): Promise<{ message: string; event: Event }> {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) throw new NotFoundException(SYS_MSG.EVENT_NOT_FOUND);

    return {
      message: SYS_MSG.EVENT_RETRIEVED_SUCCESSFULLY,
      event,
    };
  }

  async update(id: string, updateDto: UpdateEventDto) {
    const { event } = await this.findOne(id);
    Object.assign(event, updateDto);

    try {
      const updatedEvent = await this.eventRepository.save(event);

      return {
        message: SYS_MSG.EVENT_UPDATED_SUCCESSFULLY,
        event: updatedEvent,
      };
    } catch {
      throw new InternalServerErrorException('Failed to update event');
    }
  }
}
