import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateEventDto extends PartialType(CreateEventDto) {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'CANCELLED',
    description: 'Status of the event',
  })
  status?: string;
}
