import { applyDecorators } from '@nestjs/common';
import * as SYS_MSG from 'src/constants/system-messages';
import { CreateEventDto, EventResponseDto, UpdateEventDto } from '../dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function swaggerCreateEvent() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a new event',
      description:
        'Authenticated users can create an event with start and end times.',
    }),
    ApiBody({ type: CreateEventDto }),
    ApiResponse({
      status: 201,
      description: SYS_MSG.EVENT_CREATED_SUCCESSFULLY,
      type: EventResponseDto,
    }),
    ApiResponse({ status: 400, description: SYS_MSG.BAD_REQUEST }),
    ApiResponse({ status: 401, description: SYS_MSG.UNAUTHORIZED }),
  );
}

export function swaggerGetEvents() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all events',
      description: 'Retrieve all events in the system.',
    }),
    ApiResponse({
      status: 200,
      description: 'List of events',
      type: [EventResponseDto],
    }),
    ApiResponse({ status: 401, description: SYS_MSG.UNAUTHORIZED }),
  );
}

export function swaggerGetEventById() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get event by ID',
      description: 'Retrieve a single event by its ID.',
    }),
    ApiParam({ name: 'id', description: 'Event unique identifier' }),
    ApiResponse({
      status: 200,
      description: 'Event retrieved successfully',
      type: EventResponseDto,
    }),
    ApiResponse({ status: 404, description: SYS_MSG.EVENT_NOT_FOUND }),
    ApiResponse({ status: 401, description: SYS_MSG.UNAUTHORIZED }),
  );
}

export function swaggerUpdateEvent() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update an event',
      description: 'Update an existing event.',
    }),
    ApiParam({ name: 'id', description: 'Event unique identifier' }),
    ApiBody({ type: UpdateEventDto }),
    ApiResponse({
      status: 200,
      description: SYS_MSG.EVENT_UPDATED_SUCCESSFULLY,
      type: EventResponseDto,
    }),
    ApiResponse({ status: 400, description: SYS_MSG.BAD_REQUEST }),
    ApiResponse({ status: 404, description: SYS_MSG.EVENT_NOT_FOUND }),
    ApiResponse({ status: 401, description: SYS_MSG.UNAUTHORIZED }),
    ApiResponse({ status: 403, description: SYS_MSG.FORBIDDEN }),
  );
}

export function swaggerDeleteEvent() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete an event',
      description: 'Delete an existing event by ID.',
    }),
    ApiParam({ name: 'id', description: 'Event unique identifier' }),
    ApiResponse({ status: 204 }),
    ApiResponse({ status: 404, description: SYS_MSG.EVENT_NOT_FOUND }),
    ApiResponse({ status: 401, description: SYS_MSG.UNAUTHORIZED }),
    ApiResponse({ status: 403, description: SYS_MSG.FORBIDDEN }),
  );
}
