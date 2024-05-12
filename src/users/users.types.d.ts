import { PostProps } from 'src/posts/posts.types';

export interface FavoritePostProps {
  id: number;
  post: PostProps;
  postId: number;
  user: UserProps;
  userId: number;
}
export interface UserProps {
  id: number;
  name: string;
  email: string;
  hashedPassword: string;
  role: string;
  favorites: FavoritePostProps[];
}

export interface UserServiceProps {
  public findOne(jwtToken: string): Promise<UserProps>;

  public createUser(
    name: string,
    email: string,
    password: string,
    role: string,
  ): Promise<Omit<UserProps, 'hashedPassword'>>;
}

export interface UserControllerProps {
  public findOne(@Request() jwtToken: string): Promise<UserProps>;
}

