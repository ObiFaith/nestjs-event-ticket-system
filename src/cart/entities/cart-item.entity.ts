import { Cart } from './cart.entity';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '../../common/entities/base-entity';
import { TicketType } from '../../ticket/entities/ticket-type.entity';

@Entity('cart_items')
@Unique(['cart', 'ticketType'])
export class CartItem extends BaseEntity {
  @ManyToOne(() => Cart, (cart) => cart.items, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  cart: Cart;

  @ManyToOne(() => TicketType, {
    nullable: false,
  })
  ticketType: TicketType;

  @Column({ type: 'int' })
  quantity: number;
}
