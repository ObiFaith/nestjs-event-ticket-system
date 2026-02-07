import { ApiProperty } from '@nestjs/swagger';
import { EventStatus } from '../entities/event.entity';

export class EventResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the event',
    example: 'evt_123abc',
  })
  id: string;

  @ApiProperty({
    description: 'Title of the event',
    example: 'React Conference 2026',
  })
  title: string;

  @ApiProperty({
    description: 'Description of the event',
    example: 'React Conference 2026 keynote speakers are...',
  })
  description: string;

  @ApiProperty({
    description: 'Event start date/time',
    example: '2026-05-01T10:00:00Z',
  })
  startsAt: Date;

  @ApiProperty({
    description: 'Event end date/time',
    example: '2026-05-01T18:00:00Z',
  })
  endsAt: Date;

  @ApiProperty({ description: 'Status of the event', example: 'ACTIVE' })
  status: EventStatus;

  @ApiProperty({
    description: 'ID of the event creator',
    example: 'user_789xyz',
  })
  creatorId: string;

  @ApiProperty({
    description: 'Event creation timestamp',
    example: '2026-02-07T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Event last update timestamp',
    example: '2026-02-07T12:05:00Z',
  })
  updatedAt: Date;
}
