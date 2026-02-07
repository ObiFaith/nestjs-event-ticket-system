import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { Event } from 'src/event/entities/event.entity';
import { TicketType } from './entities/ticket-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, TicketType])],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}
