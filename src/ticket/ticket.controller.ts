import { TicketService } from './ticket.service';
import { CreateTicketTypeDto } from './dto/ticket.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/decorator/user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { swaggerCreateTicket } from './swagger/ticket.swagger';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

@Controller()
@ApiBearerAuth()
@ApiTags('Tickets')
@UseGuards(JwtAuthGuard)
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  // --- POST: CREATE EVENT TICKET TYPE ---
  @Post('events/:eventId/tickets')
  @swaggerCreateTicket()
  @HttpCode(HttpStatus.CREATED)
  createType(
    @User('id') userId: string,
    @Param('eventId') eventId: string,
    @Body() CreateTicketTypeDto: CreateTicketTypeDto,
  ) {
    return this.ticketService.createType(userId, eventId, CreateTicketTypeDto);
  }
}
