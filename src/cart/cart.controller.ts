import { CartItemDto } from './dto';
import { CartService } from './cart.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/decorator/user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { swaggerAddCartItem } from './swagger/cart-item.swagger';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

@ApiBearerAuth()
@ApiTags('Carts')
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // --- POST: ADD ITEM TO CART ---
  @Post('items')
  @swaggerAddCartItem()
  @HttpCode(HttpStatus.CREATED)
  addToCart(@User('id') userId: string, @Body() cartItemDto: CartItemDto) {
    return this.cartService.addToCart(userId, cartItemDto);
  }
}
