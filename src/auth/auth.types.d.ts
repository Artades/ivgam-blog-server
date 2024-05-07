

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
}

export interface AuthControllerProps {
  public signIn(
    @Body() signInDto: SignInDto,
  ): Promise<{ accessToken: string; userEmailFromToken: string }>;
  public signUp(
    @Body() signUpDto: SignUpDto,
  ): Promise<{ accessToken: string; userEmailFromToken: string }>;
}

