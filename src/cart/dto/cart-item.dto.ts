import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';

export class CartItemDto {
  @ApiProperty({
    description: 'ID of the ticket type to add to cart',
    example: 'c7b1f2d4-8a3e-4f6e-9a11-2b3c4d5e6f7g',
  })
  @IsNotEmpty()
  @IsUUID()
  ticketTypeId: string;

  @ApiProperty({
    description: 'Number of tickets to reserve',
    example: 2,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;
}
