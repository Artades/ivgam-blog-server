
import { Response, Request } from 'express';


export interface AuthServiceProps {
  _getUserEmailFromToken(token: string): string | null;
  public signIn(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; userEmailFromToken: string }>;
  public signUp(
    name: string,
    email: string,
    password: string,
  ): Promise<{ accessToken: string; userEmailFromToken: string }>;

  public verifyToken(token: string): Promise<any>;
}

export interface AuthControllerProps {
  public signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string; userEmailFromToken: string }>;
  public signUp(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string; userEmailFromToken: string }>;

  public verifyToken(@Req() req: Request);
}

