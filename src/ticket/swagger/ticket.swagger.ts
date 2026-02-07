import { applyDecorators } from '@nestjs/common';
import * as SYS_MSG from 'src/constants/system-messages';
import { CreateTicketTypeDto, TicketTypeResponseDto } from '../dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

export function swaggerCreateTicket() {
  return applyDecorators(
    ApiTags('Tickets'),
    ApiOperation({
      summary: 'Create a ticket type for an event',
      description:
        'Only the event creator can add ticket types with limited quantity and sale window.',
    }),
    ApiBody({ type: CreateTicketTypeDto }),
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
