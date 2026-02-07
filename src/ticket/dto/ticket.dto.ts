import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreateTicketTypeDto {
  @ApiProperty({ description: 'Name of the ticket type', example: 'VIP Pass' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description:
      'Ticket price in the smallest currency unit to be charged per ticket (e.g. kobo, cents)',
    example: 15000,
  })
  @IsInt()
  @IsPositive()
  price: number;

  @IsOptional()
  @ApiPropertyOptional({
    description:
      'ISO 4217 currency code representing the currency of the ticket price',
    example: 'NGN',
  })
  @IsString()
  @Length(3, 3)
  currency?: string;

  @ApiProperty({
    description: 'Total number of tickets available',
    example: 100,
  })
  @IsInt()
  @Min(1)
  totalQuantity: number;

  @ApiProperty({
    description: 'Sale start date/time in ISO format',
    example: '2026-04-01T10:00:00Z',
  })
  @IsDateString()
  saleStart: string;

  @ApiProperty({
    description: 'Sale end date/time in ISO format',
    example: '2026-04-30T23:59:59Z',
  })
  @IsDateString()
  saleEnd: string;
}
