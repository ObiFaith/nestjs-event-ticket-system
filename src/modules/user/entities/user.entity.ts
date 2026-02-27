import { Cart } from '../../cart/entities/cart.entity';
import { Event } from '../../event/entities/event.entity';
import { BaseEntity } from '../../../common/entities/base-entity';
import { Column, DeleteDateColumn, Entity, OneToMany } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ name: 'last_name', length: 100 })
  lastName: string;

  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ name: 'password_hash', nullable: false, select: false })
  passwordHash: string;

  @OneToMany(() => Event, (event) => event.creator)
  events: Event[];

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  deletedAt: Date | null;
}
