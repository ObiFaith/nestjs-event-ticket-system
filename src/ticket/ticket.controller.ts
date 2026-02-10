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
  swaggerCreateTicketType,
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
  @swaggerCreateTicketType()
  @HttpCode(HttpStatus.CREATED)
  createType(
    @User('id') userId: string,
    @Param('eventId') eventId: string,
    @Body() ticketTypesDto: Array<CreateTicketTypeDto>,
  ) {
    return this.ticketService.createTicketType(userId, eventId, ticketTypesDto);
  }

  @Get('/events/:eventId/tickets')
  @swaggerGetAllTicketTypes()
  findAllTicketType(@Param('eventId') eventId: string) {
    return this.ticketService.findAllTicketType(eventId);
  }

  @Get('/events/:eventId/tickets/:ticketId')
  @swaggerGetTicketType()
  findTicketType(
    @Param('eventId') eventId: string,
    @Param('ticketId') ticketId: string,
  ) {
    return this.ticketService.findTicketType(eventId, ticketId);
  }

  @Patch('/events/:eventId/tickets/:ticketId')
  @swaggerUpdateTicketType()
  updateTicketType(
    @Param('eventId') eventId: string,
    @Param('ticketId') ticketId: string,
    @Body() dto: UpdateTicketTypeDto,
  ) {
    return this.ticketService.updateTicketType(eventId, ticketId, dto);
  }
}
