export interface UserServiceProps {
  public findOne(jwtToken: string): Promise<UserProps>;

  public createUser(
    name: string,
    email: string,
    password: string,
  ): Promise<Omit<UserProps, 'hashedPassword'>>;
}

export interface UserControllerProps {
  public findOne(@Request() jwtToken: string): Promise<UserProps>;
}

export interface UserProps {
  id: number;
  name: string;
  email: string;
  hashedPassword: string;
}
