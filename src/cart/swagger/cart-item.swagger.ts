import { applyDecorators } from '@nestjs/common';
import { CartItemDto, CartResponseDto } from '../dto';
import * as SYS_MSG from 'src/constants/system-messages';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function swaggerAddCartItem() {
  return applyDecorators(
    ApiOperation({
      summary: 'Add ticket to cart',
      description:
        'Authenticated users can add ticket to their active cart. Handles reservation and prevents overbooking.',
    }),
    ApiBody({ type: CartItemDto }),
    ApiResponse({
      status: 201,
      description: SYS_MSG.CART_ITEM_ADDED_SUCCESSFULLY,
      type: CartResponseDto,
    }),
    ApiResponse({
      status: 400,
      description:
        'Bad Request: Not enough ticket available, ticket sale ended, or event is cancelled/ended.',
    }),
    ApiResponse({
      status: 401,
      description: SYS_MSG.UNAUTHORIZED,
    }),
    ApiResponse({
      status: 409,
      description:
        'Conflict: Cart item already exists or concurrency conflict.',
    }),
  );
}
