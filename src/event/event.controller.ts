import { EventService } from './event.service';
import { CreateEventDto, UpdateEventDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/decorator/user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
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
  swaggerCreateEvent,
  swaggerGetEventById,
  swaggerGetEvents,
  swaggerUpdateEvent,
} from './swagger/event.swagger';

@ApiBearerAuth()
@ApiTags('Events')
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  // --- POST: CREATE EVENT ---
  @Post()
  @UseGuards(JwtAuthGuard)
  @swaggerCreateEvent()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @User('id') userId: string,
    @Body() createEventDto: CreateEventDto,
  ) {
    return await this.eventService.create(userId, createEventDto);
  }

  @Get()
  @swaggerGetEvents()
  async getAll() {
    return this.eventService.findAll();
  }

  @Get(':id')
  @swaggerGetEventById()
  async getOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @swaggerUpdateEvent()
  async update(@Param('id') id: string, @Body() updateDto: UpdateEventDto) {
    return this.eventService.update(id, updateDto);
  }
}
