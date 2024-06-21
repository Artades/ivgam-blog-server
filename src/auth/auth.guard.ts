import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.cookie;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const [name, token] = authHeader.split('=');

    if (!token || name !== 'accessToken') {
      throw new UnauthorizedException('Invalid token format');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
      });

      console.log('Payload: ', payload);
      request['userData'] = payload;

      return true;
    } catch (error) {
      console.log(error); // Log the error to understand what went wrong
      throw new UnauthorizedException('Invalid token');
    }
  }
}
