import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TicketType } from './entities/ticket-type.entity';
import { Event } from 'src/modules/event/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, TicketType])],
  controllers: [TicketController],
  providers: [TicketService],
  exports: [TicketService],
})
export class TicketModule {}
