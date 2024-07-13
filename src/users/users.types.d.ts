import { PostProps } from 'src/posts/posts.types';

export interface FavoritePostProps {
  id: number;
  post: PostProps;
  postId: number;
  user: UserWithoutPassword;
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

export type UserWithoutPassword = Omit<UserProps, "hashedPassword">

export interface UserServiceProps {
  createUser(
    name: string,
    email: string,
    password: string,
  ): Promise<Omit<UserProps, 'hashedPassword'>>;
  findOneByEmail(email: string): Promise<UserProps | null>;
  findOne(jwtToken: string): Promise<UserProps | null>;
  findOneById(id: number): Promise<UserProps | null>;
  updateProfilePicture(id: number, profilePicture: string): Promise<{ success: boolean }>;
  getActiveUsers(): Promise<UserWithoutPassword[]>;
}

export interface UserControllerProps {
  findOneById(id: number): Promise<UserProps | null>;
  updateProfilePicture(
    updateProfilePictureDto: UpdateProfilePictureDto,
  ): Promise<{ success: boolean }>;
  getActiveUsers(): Promise<UserWithoutPassword[]>;
}

