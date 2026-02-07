import { ApiProperty } from '@nestjs/swagger';

export class TicketTypeResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the ticket type',
    example: 'ticket_456def',
  })
  id: string;

  @ApiProperty({ description: 'Associated event ID', example: 'evt_123abc' })
  eventId: string;

  @ApiProperty({ description: 'Ticket type name', example: 'VIP Pass' })
  name: string;

  @ApiProperty({
    description:
      'Ticket price in the smallest currency unit (e.g. kobo, cents)',
    example: 15000,
  })
  price: number;

  @ApiProperty({
    description: 'ISO 4217 currency code for the ticket price',
    example: 'NGN',
  })
  currency: string;

  @ApiProperty({ description: 'Total number of tickets', example: 100 })
  totalQuantity: number;

  @ApiProperty({
    description: 'Number of tickets currently reserved in carts',
    example: 5,
  })
  reservedQuantity: number;

  @ApiProperty({
    description: 'Number of tickets that have been sold',
    example: 10,
  })
  soldQuantity: number;

  @ApiProperty({
    description: 'Sale start date/time',
    example: '2026-04-01T10:00:00Z',
  })
  saleStartsAt: Date;

  @ApiProperty({
    description: 'Sale end date/time',
    example: '2026-04-30T23:59:59Z',
  })
  saleEndsAt: Date;

  @ApiProperty({
    description: 'Ticket creation timestamp',
    example: '2026-02-07T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Ticket last update timestamp',
    example: '2026-02-07T12:05:00Z',
  })
  updatedAt: Date;
}
