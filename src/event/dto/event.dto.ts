import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Title of the event',
    example: 'React Conference 2026',
  })
  title: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Description of the event',
    example: 'React Conference 2026 keynote speakers are...',
  })
  description?: string;

  @ApiProperty({
    description: 'Event start date/time in ISO format',
    example: '2026-07-02T10:00:00Z',
  })
  @IsDateString()
  startsAt: string; // ISO date string

  @ApiProperty({
    description: 'Event end date/time in ISO format',
    example: '2026-11-02T20:00:00Z',
  })
  @IsDateString()
  endsAt: string; // ISO date string
}
