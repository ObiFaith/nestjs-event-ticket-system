import { EventService } from './event.service';
import { CreateEventDto } from './dto/event.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/decorator/user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { swaggerCreateEvent } from './swagger/event.swagger';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

@ApiBearerAuth()
@ApiTags('Events')
@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  // --- POST: CREATE EVENT ---
  @Post()
  @swaggerCreateEvent()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @User('id') userId: string,
    @Body() createEventDto: CreateEventDto,
  ) {
    return await this.eventService.create(userId, createEventDto);
  }
}
