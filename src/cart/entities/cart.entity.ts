import { CartItem } from './cart-item.entity';
import { User } from '../../user/entities/user.entity';
import { BaseEntity } from '../../common/entities/base-entity';
import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';

export enum CartStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CHECKED_OUT = 'CHECKED_OUT',
}

@Index(['user', 'status'])
@Entity('carts')
export class Cart extends BaseEntity {
  @ManyToOne(() => User, (user) => user.carts, { nullable: false })
  user: User;

  @Column({
    type: 'enum',
    enum: CartStatus,
    default: CartStatus.ACTIVE,
  })
  status: CartStatus;

  @Column({ name: 'expires_at', type: 'timestamp with time zone' })
  expiresAt: Date;

  @OneToMany(() => CartItem, (item) => item.cart)
  items: CartItem[];
}
