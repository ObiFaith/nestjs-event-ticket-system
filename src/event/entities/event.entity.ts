import { User } from '../../user/entities/user.entity';
import { BaseEntity } from '../../common/entities/base-entity';
import { TicketType } from '../../ticket/entities/ticket-type.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

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
    comment: 'ENDED and CANCELLED events cannot accept ticket reservations',
  })
  status: EventStatus;

  @Column({ name: 'creator_id' })
  creatorId: string;

  @ManyToOne(() => User, (user) => user.events, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @OneToMany(() => TicketType, (ticket) => ticket.event)
  ticketTypes: TicketType[];
}
