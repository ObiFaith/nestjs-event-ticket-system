import { applyDecorators } from '@nestjs/common';
import * as SYS_MSG from 'src/constants/system-messages';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import {
  CreateTicketTypeDto,
  TicketTypeResponseDto,
  UpdateTicketTypeDto,
} from '../dto';

export function swaggerCreateTicketType() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a ticket type for an event',
      description:
        'Only the event creator can add ticket types with limited quantity and sale window.',
    }),
    ApiParam({ name: 'eventId', description: 'Event ID', required: true }),
    ApiBody({ type: CreateTicketTypeDto, isArray: true }),
    ApiResponse({
      status: 201,
      description: SYS_MSG.TICKET_TYPE_CREATED_SUCCESSFULLY,
      type: TicketTypeResponseDto,
    }),
    ApiResponse({
      status: 400,
      description: SYS_MSG.BAD_REQUEST,
    }),
    ApiResponse({
      status: 401,
      description: SYS_MSG.UNAUTHORIZED,
    }),
    ApiResponse({
      status: 403,
      description: SYS_MSG.FORBIDDEN,
    }),
    ApiResponse({
      status: 404,
      description: SYS_MSG.EVENT_NOT_FOUND,
    }),
  );
}

export function swaggerGetTicketType() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get a ticket type by ID',
      description: 'Retrieve a single ticket type for a specific event.',
    }),
    ApiParam({ name: 'eventId', description: 'Event ID', required: true }),
    ApiParam({
      name: 'ticketId',
      description: 'Ticket type ID',
      required: true,
    }),
    ApiResponse({
      status: 200,
      description: SYS_MSG.TICKET_TYPE_RETRIEVED_SUCCESSFULLY,
      type: TicketTypeResponseDto,
    }),
    ApiResponse({ status: 404, description: SYS_MSG.TICKET_TYPE_NOT_FOUND }),
  );
}

export function swaggerGetAllTicketTypes() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all ticket types',
      description: 'Retrieve all ticket types for a specific event.',
    }),
    ApiParam({ name: 'eventId', description: 'Event ID', required: true }),
    ApiResponse({
      status: 200,
      description: SYS_MSG.TICKET_TYPES_RETRIEVED_SUCCESSFULLY,
      type: [TicketTypeResponseDto],
    }),
  );
}

export function swaggerUpdateTicketType() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update a ticket type',
      description: 'Update ticket type for a specific event.',
    }),
    ApiParam({ name: 'eventId', description: 'Event ID', required: true }),
    ApiParam({
      name: 'ticketId',
      description: 'Ticket type ID',
      required: true,
    }),
    ApiBody({ type: UpdateTicketTypeDto }),
    ApiResponse({
      status: 200,
      description: SYS_MSG.TICKET_TYPE_UPDATED_SUCCESSFULLY,
      type: TicketTypeResponseDto,
    }),
    ApiResponse({ status: 400, description: SYS_MSG.BAD_REQUEST }),
    ApiResponse({ status: 404, description: SYS_MSG.TICKET_TYPE_NOT_FOUND }),
  );
}

export function swaggerDeleteTicketType() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete a ticket type',
      description: 'Delete ticket type (soft delete recommended).',
    }),
    ApiParam({ name: 'id', description: 'Ticket type ID' }),
    ApiResponse({
      status: 204,
    }),
    ApiResponse({ status: 404, description: SYS_MSG.TICKET_TYPE_NOT_FOUND }),
  );
}
