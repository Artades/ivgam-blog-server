import * as bcrypt from 'bcryptjs';
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

import { AuthServiceProps } from './auth.types';
import { JwtService } from '@nestjs/jwt/dist';
import { UsersService } from 'src/users/users.service';


@Injectable()
export class AuthService implements AuthServiceProps {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  _getUserEmailFromToken(token: string): string | null {
    try {
      const decodedToken = this.jwtService.verify(token);

      return decodedToken && decodedToken.email ? decodedToken.email : null;
    } catch (error) {
      console.error(
        'Something went wrong while getting the user email from JWT token: ',
        error,
      );

      throw new UnauthorizedException('Invalid JWT Token');
    }
  }


  public async signIn(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; userEmailFromToken: string }> {
    const user = await this.userService.findOneByEmail(email);

    if (!user)
      throw new BadRequestException('User does not exist in the database');

    const isValidPassword = await bcrypt.compare(password, user.hashedPassword);

    if (!isValidPassword)
      throw new UnauthorizedException('Password is not valid');

    const payload = { userId: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);
    const userEmailFromToken = this._getUserEmailFromToken(accessToken);

    return { accessToken, userEmailFromToken };
  }


  public async signUp(
    name: string,
    email: string,
    password: string,
  ): Promise<{ accessToken: string; userEmailFromToken: string }> {
    const candidate = await this.userService.findOneByEmail(email);

    if (candidate)
      throw new BadRequestException('User with given email is already exist');

    const userData = await this.userService.createUser(
      name,
      email,
      password,
    );
    const payload = { userId: userData.id, email: userData.email };
    const accessToken = await this.jwtService.signAsync(payload);
    const userEmailFromToken = this._getUserEmailFromToken(accessToken);

    return { accessToken, userEmailFromToken };
  }
}
