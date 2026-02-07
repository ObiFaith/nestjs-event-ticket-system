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
    example: '2026-05-01T10:00:00Z',
  })
  @IsDateString()
  startTime: string; // ISO date string

  @ApiProperty({
    description: 'Event end date/time in ISO format',
    example: '2026-05-01T18:00:00Z',
  })
  @IsDateString()
  endTime: string; // ISO date string
}
