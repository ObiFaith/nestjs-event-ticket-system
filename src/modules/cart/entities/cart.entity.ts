import { CartItem } from './cart-item.entity';
import { User } from '../../user/entities/user.entity';
import { BaseEntity } from '../../../common/entities/base-entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

export enum CartStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CHECKED_OUT = 'CHECKED_OUT',
}

@Index(['userId', 'status'])
@Entity('carts')
export class Cart extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.carts, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: CartStatus,
    default: CartStatus.ACTIVE,
    comment:
      'ACTIVE carts can reserve tickets; EXPIRED carts must release reservations',
  })
  status: CartStatus;

  @Column({ name: 'expires_at', type: 'timestamp with time zone' })
  expiresAt: Date;

  @OneToMany(() => CartItem, (item) => item.cart)
  items: CartItem[];
}
