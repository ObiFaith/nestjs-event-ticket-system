import { applyDecorators } from '@nestjs/common';
import * as SYS_MSG from 'src/constants/system-messages';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CartItemDto, CartResponseDto, UpdateCartItemDto } from '../dto';

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

export function swaggerGetActiveCart() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get active cart',
      description:
        "Returns the authenticated user's active cart and reserved ticket items.",
    }),
    ApiResponse({
      status: 200,
      description: SYS_MSG.CART_RETRIEVED_SUCCESSFULLY,
      type: CartResponseDto,
    }),
    ApiResponse({
      status: 401,
      description: SYS_MSG.UNAUTHORIZED,
    }),
  );
}

export function swaggerUpdateCartItem() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update cart item quantity',
      description:
        'Safely updates the quantity of a reserved ticket in the cart using transactions and row-level locking.',
    }),
    ApiBody({ type: UpdateCartItemDto }),
    ApiResponse({
      status: 200,
      description: SYS_MSG.CART_ITEM_UPDATED_SUCCESSFULLY,
      type: CartResponseDto,
    }),
    ApiResponse({ status: 400, description: SYS_MSG.BAD_REQUEST }),
    ApiResponse({ status: 401, description: SYS_MSG.UNAUTHORIZED }),
    ApiResponse({ status: 404, description: SYS_MSG.CART_NOT_FOUND }),
    ApiResponse({
      status: 409,
      description: 'Conflict: Concurrency conflict while updating cart item.',
    }),
  );
}

export function swaggerRemoveCartItem() {
  return applyDecorators(
    ApiOperation({
      summary: 'Remove item from cart',
      description:
        'Removes a ticket from the cart and releases the reserved quantity back to availability.',
    }),
    ApiResponse({
      status: 204,
      description: SYS_MSG.CART_ITEM_REMOVED_SUCCESSFULLY,
    }),
    ApiResponse({
      status: 401,
      description: SYS_MSG.UNAUTHORIZED,
    }),
    ApiResponse({
      status: 404,
      description: 'Cart item not found.',
    }),
  );
}
