import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_OPTIONAL_AUTH_KEY, IS_PUBLIC_KEY } from '../decorators';
import { UsersService } from '../../users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private userService: UsersService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const isOptionalAuth = this.reflector.getAllAndOverride<boolean>(
      IS_OPTIONAL_AUTH_KEY,
      [context.getHandler(), context.getClass()]
    );

    const request = context.switchToHttp().getRequest();
    const userId: string | undefined = request.headers.authorization;

    if (!isOptionalAuth && !userId) {
      throw new UnauthorizedException();
    }
    try {
      let payload = null;
      if (userId) {
        payload = await this.userService.findOne(userId);
      }

      if (!isOptionalAuth && !payload) {
        throw new UnauthorizedException('User not found');
      }
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch (error) {
      console.error(error);

      throw new UnauthorizedException();
    }
    return true;
  }
}
