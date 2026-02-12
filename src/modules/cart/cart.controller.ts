import { CartItemDto } from './dto';
import { CartService } from './cart.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guard/jwt-auth.guard';
import { swaggerAddCartItem, swaggerGetActiveCart } from './swagger/cart-item.swagger';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { User } from '../user/decorator/user.decorator';


@ApiBearerAuth()
@ApiTags('Carts')
@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('items')
  @swaggerAddCartItem()
  @HttpCode(HttpStatus.CREATED)
  addToCart(@User('id') userId: string, @Body() cartItemDto: CartItemDto) {
    return this.cartService.addToCart(userId, cartItemDto);
  }

  @Get()
  @swaggerGetActiveCart()
  @HttpCode(HttpStatus.OK)
  getActiveCart(@User('id') userId: string) {
    return this.cartService.getActiveCart(userId);
  }
}
