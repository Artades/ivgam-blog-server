import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/enums/role.enum';
import { ROLES_KEY } from './role.decorator';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      return false; 
    }

    const [, token] = authorizationHeader.split(' '); 

    try {
      const decodedToken = this.jwtService.verify(token);
      const userRoles: Role[] = [decodedToken.role];

      console.log("decodedToken: ", decodedToken);
      console.log("userRoles", userRoles)
      return userRoles.some((role) => requiredRoles.includes(role));
    } catch (error) {
      return false; 
    }
  }
}
