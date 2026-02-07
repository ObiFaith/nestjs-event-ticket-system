import { LoginDto } from '../dto/login.dto';
import { applyDecorators } from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';
import { AuthResponseDto } from '../dto/response.dto';
import * as SYS_MSG from 'src/constants/system-messages';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

export function swaggerRegisterUser() {
  return applyDecorators(
    ApiTags('Auth'),
    ApiOperation({
      summary: 'Register a new user',
      description: 'Create a new user account. Password is securely hashed.',
    }),
    ApiBody({ type: RegisterDto }),
    ApiResponse({
      status: 201,
      description: SYS_MSG.USER_CREATED_SUCCESSFULLY,
      type: AuthResponseDto,
    }),
    ApiResponse({
      status: 400,
      description: SYS_MSG.BAD_REQUEST,
    }),
    ApiResponse({
      status: 409,
      description: SYS_MSG.ACCOUNT_ALREADY_EXISTS,
    }),
  );
}

export function swaggerLoginUser() {
  return applyDecorators(
    ApiTags('Auth'),
    ApiOperation({
      summary: 'User login',
      description:
        'Authenticate user with email and password, returns JWT token(s).',
    }),
    ApiBody({ type: LoginDto }),
    ApiResponse({
      status: 200,
      description: SYS_MSG.USER_LOGIN_SUCCESSFULLY,
      type: AuthResponseDto,
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
