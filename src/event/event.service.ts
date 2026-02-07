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

  private mapToEventResponseDto(event: Event): EventResponseDto {
    return {
      id: event.id,
      userId: event.creator.id,
      title: event.title,
      description: event.description,
      status: event.status,
      startTime: event.startsAt,
      endTime: event.endsAt,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    };
  }

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

    // create event
    const event = this.eventRepository.create({
      title,
      description,
      startsAt,
      endsAt,
      creator: { id: userId },
      status: EventStatus.ACTIVE, // default state
    });

    // save event to db
    await this.eventRepository.save(event);

    return {
      message: SYS_MSG.EVENT_CREATED_SUCCESSFULLY,
      event: this.mapToEventResponseDto(event),
    };
  }
}
