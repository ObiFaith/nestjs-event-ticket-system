import { TicketService } from './ticket.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/decorator/user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateTicketTypeDto, UpdateTicketTypeDto } from './dto';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  swaggerCreateTicket,
  swaggerGetAllTicketTypes,
  swaggerGetTicketType,
  swaggerUpdateTicketType,
} from './swagger/ticket.swagger';

@Controller()
@ApiBearerAuth()
@ApiTags('Tickets')
@UseGuards(JwtAuthGuard)
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post('events/:eventId/tickets')
  @swaggerCreateTicket()
  @HttpCode(HttpStatus.CREATED)
  createType(
    @User('id') userId: string,
    @Param('eventId') eventId: string,
    @Body() CreateTicketTypeDto: CreateTicketTypeDto,
  ) {
    return this.ticketService.createTicketType(
      userId,
      eventId,
      CreateTicketTypeDto,
    );
  }

  @Get('/events/:eventId/tickets')
  @swaggerGetAllTicketTypes()
  findAll() {
    return this.ticketService.findAllTicketType();
  }

  @Get('/events/:eventId/tickets/:ticketId')
  @swaggerGetTicketType()
  findOne(@Param('id') id: string) {
    return this.ticketService.findTicketType(id);
  }

  @Patch('/events/:eventId/tickets/:ticketId')
  @swaggerUpdateTicketType()
  update(@Param('id') id: string, @Body() dto: UpdateTicketTypeDto) {
    return this.ticketService.updateTicketType(id, dto);
  }
}
