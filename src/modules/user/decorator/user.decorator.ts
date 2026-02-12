import { createParamDecorator, ExecutionContext } from '@nestjs/common';

interface JwtPayload {
  id: string;
}

interface RequestWithUser extends Request {
  user: JwtPayload;
}

export const User = createParamDecorator(
  (data: keyof JwtPayload, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    return data ? request.user[data] : request.user;
  },
);
