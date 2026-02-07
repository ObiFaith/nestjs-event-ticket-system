import { Repository } from 'typeorm';
import { EventResponseDto } from './dto';
import { CreateEventDto } from './dto/event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as SYS_MSG from 'src/constants/system-messages';
import { Event, EventStatus } from './entities/event.entity';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  /**
   * Map Event entity to EventResponseDto
   * @param event Event entity
   * @returns EventResponseDto
   */
  private mapToEventResponseDto(event: Event): EventResponseDto {
    return {
      id: event.id,
      creatorId: event.creator.id,
      title: event.title,
      description: event.description,
      status: event.status,
      startsAt: event.startsAt,
      endsAt: event.endsAt,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    };
  }

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
    const { title, startTime, endTime, description } = createEventDto;

    // validate input
    if (!title || !startTime || !endTime) {
      throw new BadRequestException('Missing required fields');
    }

    // parse startTime & endTime
    const startsAt = new Date(startTime);
    const endsAt = new Date(endTime);

    // validate event interval
    if (startsAt >= endsAt) {
      throw new BadRequestException('Event startTime must be before endTime');
    }
    if (endsAt <= new Date()) {
      throw new BadRequestException('Event endTime must be in the future');
    }

    // create and save event to db
    const event = await this.eventRepository.save(
      this.eventRepository.create({
        title,
        description,
        startsAt,
        endsAt,
        creator: { id: userId },
        status: EventStatus.ACTIVE, // default state
      }),
    );

    return {
      message: SYS_MSG.EVENT_CREATED_SUCCESSFULLY,
      event: this.mapToEventResponseDto(event),
    };
  }
}
