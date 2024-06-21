import { Controller, Post, Body, UseGuards, Get, Res, Req,  } from '@nestjs/common';
import { AuthControllerProps } from './auth.types';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';
import { Response, Request } from 'express';



@Controller('auth')
@ApiTags('auth')
export class AuthController implements AuthControllerProps {
  constructor(private readonly authService: AuthService) {}

  @Post('signIn')
  public async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string; userEmailFromToken: string }> {
    const { email, password } = signInDto;
    const { accessToken, userEmailFromToken } = await this.authService.signIn(
      email,
      password,
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      domain: 'localhost',
    });
    return { accessToken, userEmailFromToken };
  }

  @Post('signUp')
  public async signUp(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string; userEmailFromToken: string }> {
    const { name, email, password } = signUpDto;
    const { accessToken, userEmailFromToken } = await this.authService.signUp(
      name,
      email,
      password,
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      domain: 'localhost',
    });

    return { accessToken, userEmailFromToken };
  }

  @UseGuards(AuthGuard)
  @Get('verify')
  public async verifyToken(@Req() req: any) {
    const token = req.cookies['accessToken'];
    const payload = await this.authService.verifyToken(token);
    return payload;
  }
}
