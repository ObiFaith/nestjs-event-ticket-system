import { ApiProperty } from '@nestjs/swagger';
import { CartItemResponseDto } from './cart-item-response.dto';
import { CartStatus } from '../entities/cart.entity';

export class CartResponseDto {
  @ApiProperty({
    description: 'Cart ID',
    example: 'd9a2f1b3-7c8d-4e1f-9a2b-3c4d5e6f7g8h',
  })
  id: string;

  @ApiProperty({
    description: 'Cart User ID',
    example: 'd9a2f1b3-7c8d-4e1f-9a2b-3c4d5e6f7g8h',
  })
  userId: string;

  @ApiProperty({ description: 'Status of the cart', example: 'ACTIVE' })
  status: CartStatus;

  @ApiProperty({
    description: 'Tickets in the cart',
    type: [CartItemResponseDto],
  })
  items: CartItemResponseDto[];

  @ApiProperty({
    description: 'Cart expiration timestamp',
    example: '2026-02-08T10:30:00Z',
  })
  expiresAt: Date;

  @ApiProperty({
    description: 'Cart creation timestamp',
    example: '2026-02-07T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Cart last update timestamp',
    example: '2026-02-07T12:05:00Z',
  })
  updatedAt: Date;
}
