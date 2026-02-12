import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { Event } from './entities/event.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventController } from './event.controller';
import { TicketService } from '../ticket/ticket.service';
import { TicketType } from '../ticket/entities/ticket-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, TicketType])],
  controllers: [EventController],
  providers: [EventService, TicketService],
})
export class EventModule {}
