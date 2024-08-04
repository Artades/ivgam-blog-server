import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Res,
  Req,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { AuthControllerProps } from './auth.types';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';
import { Response, Request } from 'express';
import { ConfigService, CookieSetup } from '../config/config.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController implements AuthControllerProps {
  private readonly cookieSetup: CookieSetup<'production' | 'development'>;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    this.cookieSetup = this.configService.getCookieSetup();
  }

  @Post('signIn')
  @ApiOperation({ summary: 'Sign in a user and return an access token.' })
  @ApiResponse({ status: 200, description: 'Successfully signed in.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  public async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const { email, password } = signInDto;
    try {
      const { accessToken } = await this.authService.signIn(email, password);

      res.cookie('accessToken', accessToken, {
        ...this.cookieSetup,
      });
      return { accessToken };
    } catch (error) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('signUp')
  @ApiOperation({ summary: 'Sign up a new user and return an access token.' })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({ status: 400, description: 'Validation errors.' })
  public async signUp(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const { name, email, password } = signUpDto;
    try {
      const { accessToken } = await this.authService.signUp(
        name,
        email,
        password,
      );

      res.cookie('accessToken', accessToken, {
        ...this.cookieSetup,
      });

      return { accessToken };
    } catch (error) {
      throw new HttpException('User creation failed', HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Get('verify')
  @ApiOperation({ summary: 'Verify access token.' })
  @ApiResponse({ status: 200, description: 'Token verified.' })
  @ApiResponse({ status: 401, description: 'Invalid token.' })
  public async verifyToken(
    @Req() req: Request,
  ): Promise<{ userId: number; role: string }> {
    try {
      const token = req.cookies['accessToken'];
      const payload = await this.authService.verifyToken(token);
      return payload;
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }

  @UseGuards(AuthGuard)
  @Post('burnToken')
  @ApiOperation({ summary: 'Invalidate an access token.' })
  @ApiResponse({ status: 200, description: 'Token successfully burned.' })
  public async burnToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    try {
      const token = req.cookies['accessToken'];
      await this.authService.burnToken(token);
      res.clearCookie('accessToken', {
        ...this.cookieSetup,
      });
      return { message: 'Token successfully burned' };
    } catch (error) {
      throw new HttpException(
        'Token invalidation failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
