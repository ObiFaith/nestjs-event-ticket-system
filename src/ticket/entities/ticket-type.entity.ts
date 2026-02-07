import { Event } from '../../event/entities/event.entity';
import { BaseEntity } from '../../common/entities/base-entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Index(['eventId'])
@Entity('ticket_types')
export class TicketType extends BaseEntity {
  @Column()
  name: string;

  @Column({
    type: 'int',
    comment: 'Price in smallest currency unit (e.g. kobo, cents)',
  })
  price: number;

  @Column({ length: 3, default: 'NGN' })
  currency: string;

  @Column({ name: 'total_quantity', type: 'int' })
  totalQuantity: number;

  /**
   * Number of tickets temporarily reserved in carts.
   * Must be released on cart expiration.
   */
  @Column({ name: 'reserved_quantity', type: 'int', default: 0 })
  reservedQuantity: number;

  /**
   * Number of tickets sold after checkout.
   */
  @Column({ name: 'sold_quantity', type: 'int', default: 0 })
  soldQuantity: number;

  @Column({ name: 'sale_starts_at', type: 'timestamp with time zone' })
  saleStartsAt: Date;

  @Column({ name: 'sale_ends_at', type: 'timestamp with time zone' })
  saleEndsAt: Date;

  @Column({ name: 'event_id' })
  eventId: string;

  @ManyToOne(() => Event, (event) => event.ticketTypes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'event_id' })
  event: Event;
}
