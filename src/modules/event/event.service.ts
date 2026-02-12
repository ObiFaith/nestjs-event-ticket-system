import { Repository } from 'typeorm';
import { EventResponseDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEventDto, UpdateEventDto } from './dto';
import * as SYS_MSG from 'src/constants/system-messages';
import { Event, EventStatus } from './entities/event.entity';
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
    const { title, startsAt, endsAt } = createEventDto;
    // Validate input
    if (!title.trim() || !startsAt || !endsAt) {
      throw new BadRequestException('Missing required fields');
    }

    // validate event interval
    if (startsAt >= endsAt) {
      throw new BadRequestException('Event startsAt must be before endsAt');
    }

    // create and save event to db
    const event = await this.eventRepository.save(
      this.eventRepository.create({
        ...createEventDto,
        title: title.trim(),
        creatorId: userId,
        status: EventStatus.ACTIVE, // default state
      }),
    );

    return {
      message: SYS_MSG.EVENT_CREATED_SUCCESSFULLY,
      event,
    };
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
