import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { Role } from '../enums';

export const Roles = (...roles: Role[]): CustomDecorator<string> =>
  SetMetadata('roles', roles);

export const ROLES_KEY = 'roles';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const IS_OPTIONAL_AUTH_KEY = 'isOptionalAuth';
export const OptionalAuth = () => SetMetadata(IS_OPTIONAL_AUTH_KEY, true);
