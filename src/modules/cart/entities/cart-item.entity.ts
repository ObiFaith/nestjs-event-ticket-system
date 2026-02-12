import { Cart } from './cart.entity';
import { BaseEntity } from '../../../common/entities/base-entity';
import { TicketType } from '../../ticket/entities/ticket-type.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

@Entity('cart_items')
@Unique(['cartId', 'ticketTypeId']) // Prevents duplicate ticket reservations per cart
export class CartItem extends BaseEntity {
  @Column({ name: 'cart_id' })
  cartId: string;

  @ManyToOne(() => Cart, (cart) => cart.items, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @Column({ name: 'ticket_type_id' })
  ticketTypeId: string;

  @ManyToOne(() => TicketType, {
    nullable: false,
  })
  @JoinColumn({ name: 'ticket_type_id' })
  ticketType: TicketType;

  @Column({ type: 'int' })
  quantity: number;
}
