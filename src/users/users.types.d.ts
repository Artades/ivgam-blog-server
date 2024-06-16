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
  profilePicture?: string;
}


export interface UserServiceProps {
  public findOne(jwtToken: string): Promise<UserProps>;

  public createUser(
    name: string,
    email: string,
    password: string,
    role: string,
  ): Promise<Omit<UserProps, 'hashedPassword'>>;
  public updateProfilePicture(id: number, profilePicture: string): Promise<{success: boolean}>
}

export interface UserControllerProps {
  public findOne(@Request() jwtToken: string): Promise<UserProps>;
  // public updateProfilePicture(
  //   updateProfilePictureDto: UpdateProfilePictureDto,
  // ): Promise<{ success: boolean }>;
}

