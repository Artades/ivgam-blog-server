import { IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDTO {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  body: string;

  @IsString()
  @ApiProperty()
  topic: string;

  @IsString()
  @ApiProperty()
  hashtags: string;

  @IsString()
  @ApiProperty()
  creator?: string;
}

export class CreatePostWithImageDTO extends CreatePostDTO {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  image?: any;
}

export interface PostProps {
  id: number;
  title: string;
  body: string;
  dateOfCreation: string;
  dateOfUpdation: string;
  topic: string;
  hashtags: string;
  views: number;
  likesAmount: number;
  imageUrl: string;
  creator?: string
}

export interface PostsControllerProps {
  createPost(
    credentials: CreatePostDTO,
    imageUrl: any,
  ): Promise<{ success: boolean }>;
  getAllPosts(): Promise<PostProps[]>;
  suggestPost(
    title: string,
    description: string,
    userEmail: string,
  ): Promise<{ success: boolean }>;
  addToFavorites(postId: number, userId: number): Promise<{ success: boolean }>;
}

export interface PostsServiceProps {
  createPost(credentials: CreatePostDTO, imageUrl: any): Promise<PostProps>;
  getAllPosts(): Promise<PostProps[]>;
  suggestPost(
    title: string,
    description: string,
    userEmail: string,
  ): Promise<{ success: boolean }>;
  likePost(postId: number, userId: number): Promise<void>;
  addToFavorites(postId: number, userId: number): Promise<{ success: boolean }>;
}
