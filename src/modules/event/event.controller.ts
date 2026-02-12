import { EventService } from './event.service';
import { CreateEventDto, UpdateEventDto } from './dto';
import { User } from '../user/decorator/user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guard/jwt-auth.guard';
import {
  Body,
  Controller,
  Delete,
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
  async findAll() {
    return this.eventService.findAll();
  }

  @Get(':id')
  @swaggerGetEventById()
  async findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @swaggerUpdateEvent()
  async update(
    @User('id') userId: string,
    @Param('id') id: string,
    @Body() updateDto: UpdateEventDto,
  ) {
    return this.eventService.update(id, userId, updateDto);
  }

  @Delete(':id')
  @swaggerGetEventById()
  async softDelete(@User('id') userId: string, @Param('id') id: string) {
    return this.eventService.softDelete(id, userId);
  }
}
