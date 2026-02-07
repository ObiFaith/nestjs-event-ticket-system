import { User } from '../../user/entities/user.entity';
import { BaseEntity } from '../../common/entities/base-entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { TicketType } from '../../ticket/entities/ticket-type.entity';

export enum EventStatus {
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  ENDED = 'ENDED',
}

@Entity('events')
export class Event extends BaseEntity {
  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'starts_at', type: 'timestamp with time zone' })
  startsAt: Date;

  @Column({ name: 'ends_at', type: 'timestamp with time zone' })
  endsAt: Date;

  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.ACTIVE,
  })
  status: EventStatus;

  @ManyToOne(() => User, (user) => user.events, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  creator: User;

  @OneToMany(() => TicketType, (ticket) => ticket.event)
  ticketTypes: TicketType[];
}
