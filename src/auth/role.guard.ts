import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/enums/role.enum';
import { ROLES_KEY } from './role.decorator';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector, 
    private jwtService: JwtService,
    private usersService: UsersService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const authorizationHeader = req.headers.cookie;

    if (!authorizationHeader) {
      return false;
    }

    const [name, token] = authorizationHeader.split('=');

    if (!token || name !== 'accessToken') {
      throw new UnauthorizedException('Invalid token format');
    }
    console.log(token)
    try {
      const {role} = this.jwtService.verify(token);
      console.log('Role Guard', role)
      const userRoles = [role] as Role[];

      console.log('userRoles', userRoles);
      return userRoles.some((role) => requiredRoles.includes(role));
    } catch (error) {
      return false;
    }
  }
}
