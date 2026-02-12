import { Type } from 'class-transformer';
import { CreateTicketTypeDto } from 'src/modules/ticket/dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
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
    example: '2026-02-09T10:00:00Z',
  })
  @IsDateString()
  startsAt: Date;

  @ApiProperty({
    description: 'Event end date/time in ISO format',
    example: '2026-02-20T20:00:00Z',
  })
  @IsDateString()
  endsAt: Date;

  @ApiProperty({
    description: 'Ticket types of the event',
    type: () => CreateEventDto,
    isArray: true,
    required: false,
    example: [
      {
        name: 'VIP Pass',
        price: 15000,
        currency: 'NGN',
        totalQuantity: 100,
        saleStartsAt: '2026-02-09T00:00:00Z',
        saleEndsAt: '2026-02-15T18:00:00Z',
      },
    ],
  })
  @ValidateNested({ each: true })
  @Type(() => CreateTicketTypeDto)
  ticketTypes?: Array<CreateTicketTypeDto>;
}
