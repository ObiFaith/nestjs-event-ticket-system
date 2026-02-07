import { applyDecorators } from '@nestjs/common';
import * as SYS_MSG from 'src/constants/system-messages';
import { CreateEventDto, EventResponseDto } from '../dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

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
    ApiResponse({
      status: 400,
      description: SYS_MSG.BAD_REQUEST,
    }),
    ApiResponse({
      status: 401,
      description: SYS_MSG.UNAUTHORIZED,
    }),
  );
}
