import { ExecutionContext, SetMetadata, createParamDecorator } from '@nestjs/common';
import { Role } from 'src/role/entities/role.entity';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const RESPONSE_MESSAGE = "response_message";
export const ResponseMessage = (message: string) => SetMetadata(RESPONSE_MESSAGE, message);

export const RequestUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);