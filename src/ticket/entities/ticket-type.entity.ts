import { Event } from '../../event/entities/event.entity';
import { BaseEntity } from '../../common/entities/base-entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('ticket_types')
export class TicketType extends BaseEntity {
  @Column()
  name: string;

  @Column({ name: 'total_quantity', type: 'int' })
  totalQuantity: number;

  @Column({ name: 'reserved_quantity', type: 'int', default: 0 })
  reservedQuantity: number;

  @Column({ name: 'sold_quantity', type: 'int', default: 0 })
  soldQuantity: number;

  @Column({ name: 'sale_starts_at', type: 'timestamp with time zone' })
  saleStartsAt: Date;

  @Column({ name: 'sale_ends_at', type: 'timestamp with time zone' })
  saleEndsAt: Date;

  @ManyToOne(() => Event, (event) => event.ticketTypes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  event: Event;
}
