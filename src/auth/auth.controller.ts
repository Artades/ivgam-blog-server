import { Controller, Post, Body } from '@nestjs/common';
import { AuthControllerProps } from './auth.types';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';



@Controller('auth')
@ApiTags('auth')
export class AuthController implements AuthControllerProps {
  constructor(private readonly authService: AuthService) {}

  @Post('signIn')
  public async signIn(
    @Body() signInDto: SignInDto,
  ): Promise<{ accessToken: string; userEmailFromToken: string }> {
    const { email, password } = signInDto;
    const result = await this.authService.signIn(email, password);

    return result;
  }

  @Post('signUp')
  public async signUp(
    @Body() signUpDto: SignUpDto,
  ): Promise<{ accessToken: string; userEmailFromToken: string }> {
    const { name, email, password } = signUpDto;
    const result = await this.authService.signUp(name, email, password);

    return result;
  }
}
