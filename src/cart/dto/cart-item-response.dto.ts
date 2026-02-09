import { ApiProperty } from '@nestjs/swagger';

export class CartItemResponseDto {
  @ApiProperty({
    description: 'Cart Item ID',
    example: 'd9a2f1b3-7c8d-4e1f-9a2b-3c4d5e6f7g8h',
  })
  id: string;

  @ApiProperty({
    description: 'ID of the ticket type',
    example: 'c7b1f2d4-8a3e-4f6e-9a11-2b3c4d5e6f7g',
  })
  ticketTypeId: string;

  @ApiProperty({ description: 'Name of the ticket type', example: 'VIP' })
  name: string;

  @ApiProperty({ description: 'Quantity reserved in the cart', example: 2 })
  quantity: number;

  @ApiProperty({
    description: 'Price per ticket in smallest currency unit',
    example: 1000,
  })
  price: number;

  @ApiProperty({ description: 'Currency code', example: 'NGN' })
  currency: string;
}
