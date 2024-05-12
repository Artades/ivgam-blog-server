import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostProps } from './posts.types';
import { CreatePostDTO } from './posts.types';

import { EmailService } from 'src/email/email.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly database: PrismaService,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
  ) {}

  public async createPost(credentials: CreatePostDTO): Promise<PostProps> {
    try {
      const post = await this.database.prisma.post.create({
        data: {
          title: credentials.title,
          body: credentials.body,
          hashtags: { set: credentials.hashtags },
          topic: credentials.topic,
          dateOfCreation: new Date().toISOString(),
          dateOfUpdation: new Date().toISOString(),
          views: 0,
          likesAmount: 0,
        },
      });

      return post;
    } catch (error) {}
  }

  public async getAllPosts(): Promise<PostProps[]> {
    try {
      return this.database.prisma.post.findMany({});
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong getting all posts',
      );
    }
  }

  public async suggestPost(
    title: string,
    description: string,
    userEmail: string,
  ): Promise<{ success: boolean }> {
    try {
      await this.emailService.sendEmail(
        userEmail,

        `
              <h1 style="font-family: Arial, sans-serif; color: #333;">${title} 😼</h1>

             <p>${description}</p>


             <span>С уважением: ${userEmail}</span>
              `,
      );
      return { success: true };
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong creating the suggestion',
      );
    }
  }

  public async addToFavorites(postId: number, userId: number): Promise<{success: boolean}> {
    try {
      const user = await this.usersService.findOneById(userId);

      const existingLike = user.favorites.some(
        (post) => postId === post.postId,
      );

      if (existingLike) {
        console.log(`User with id ${userId} has already liked this post`);
        return { success: false };
      }

       await this.database.prisma.post.update({
        where: { id: postId },
        data: { likesAmount: { increment: 1 } }, // Увеличиваем на 1
      });

      await this.database.prisma.favoritePost.create({
        data: {
          postId: postId,
          userId: userId,
        },
      });

      return {success: true};
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong adding to favorites',
      );
    }
  }
}
