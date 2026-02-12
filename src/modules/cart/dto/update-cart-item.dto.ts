import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class UpdateCartItemDto {
  @ApiProperty({
    description: 'New quantity for the cart item',
    example: 2,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;
}
