import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditPostDTO, ParamProps, PostProps, SortProps } from './posts.types';
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

  public async createPost(
    credentials: CreatePostDTO,
    imageUrl: string,
  ): Promise<PostProps> {
    try {
      const post = await this.database.prisma.post.create({
        data: {
          title: credentials.title,
          body: credentials.body,
          hashtags: credentials.hashtags,
          topic: credentials.topic,
          dateOfCreation: new Date().toISOString(),
          dateOfUpdation: new Date().toISOString(),
          views: 0,
          likesAmount: 0,
          imageUrl: imageUrl,
        },
      });

      return post;
    } catch (error) {
      console.log('Error: ', error);
      throw new InternalServerErrorException('Error creating post');
    }
  }

  public async getAllPosts(params: ParamProps): Promise<PostProps[]> {
    const { dateSort, popularSort } = params;

    const order: Array<{ [key: string]: SortProps }> = [];

    if (dateSort && (dateSort === 'asc' || dateSort === 'desc')) {
      order.push({ dateOfCreation: dateSort });
    }

    if (popularSort && (popularSort === 'asc' || popularSort === 'desc')) {
      order.push({ likesAmount: popularSort });
    }

    console.log(order);
    try {
      return await this.database.prisma.post.findMany({
        orderBy: order.length > 0 ? order : undefined, // Устанавливаем orderBy только если есть параметры сортировки
      });
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

  public async addToFavorites(
    postId: number,
    userId: number,
  ): Promise<{ success: boolean }> {
    try {
      const user = await this.usersService.findOneById(userId);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const existingFavorite =
        await this.database.prisma.favoritePost.findFirst({
          where: {
            postId: postId,
            userId: userId,
          },
        });

      if (existingFavorite) {
        console.log(`User with id ${userId} has already favorited this post`);
        return { success: false };
      }

      await this.database.prisma.favoritePost.create({
        data: {
          postId: postId,
          userId: userId,
        },
      });

      await this.database.prisma.post.update({
        where: { id: postId },
        data: { likesAmount: { increment: 1 } },
      });

      return { success: true };
    } catch (error) {
      console.error('Something went wrong adding to favorites: ', error);
      throw new InternalServerErrorException(
        'Something went wrong adding to favorites',
      );
    }
  }

  public async removeFromFavorites(
    postId: number,
    userId: number,
  ): Promise<{ success: boolean }> {
    try {
      const user = await this.usersService.findOneById(userId);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const existingFavorite =
        await this.database.prisma.favoritePost.findFirst({
          where: {
            postId: postId,
            userId: userId,
          },
        });

      if (!existingFavorite) {
        console.log(`User with id ${userId} has not favorited this post`);
        return { success: false };
      }

      await this.database.prisma.favoritePost.delete({
        where: {
          id: existingFavorite.id,
        },
      });

      await this.database.prisma.post.update({
        where: { id: postId },
        data: { likesAmount: { decrement: 1 } },
      });

      return { success: true };
    } catch (error) {
      console.error('Something went wrong removing from favorites: ', error);
      throw new InternalServerErrorException(
        'Something went wrong removing from favorites',
      );
    }
  }

  public async getPostById(postId: number): Promise<PostProps> {
    try {
      return this.database.prisma.post.findUnique({ where: { id: postId } });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong getting post with id: ' + postId,
      );
    }
  }

  public async getPopularHashtags(): Promise<string[]> {
    try {
      const posts = await this.database.prisma.post.findMany();
      const hashtagCounts: { [key: string]: number } = {};

      for (const post of posts) {
        for (const hashtag of post.hashtags.split(',')) {
          if (hashtagCounts[hashtag]) {
            hashtagCounts[hashtag]++;
          } else {
            hashtagCounts[hashtag] = 1;
          }
        }
      }

      const sortedHashtags = Object.entries(hashtagCounts)
        .sort(([, countA], [, countB]) => countB - countA)
        .map(([hashtag]) => hashtag);

      return sortedHashtags.slice(0, 5);
    } catch (error) {
      console.error('An error occurred while getting popular hashtags:', error);
      return [];
    }
  }

  public async viewPost(postId: number): Promise<{ success: boolean }> {
    try {
      const post = await this.database.prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          views: {
            increment: 1,
          },
        },
      });

      if (post) {
        return { success: true };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.log('Error occured while viewing the post: ', error);
      throw new InternalServerErrorException(
        'Something went wrong viewing the post',
      );
    }
  }

  public async editPost(credentials: EditPostDTO): Promise<PostProps> {
    try {
      const existingPost = await this.database.prisma.post.findUnique({
        where: { id: credentials.postId },
      });

      if (!existingPost) {
        throw new NotFoundException('Post not found');
      }

      const updatedPost = await this.database.prisma.post.update({
        where: { id: credentials.postId },
        data: {
          title: credentials.title,
          body: credentials.body,
          topic: credentials.topic,
          hashtags: credentials.hashtags,
          dateOfUpdation: new Date().toISOString(),
        },
      });
      return updatedPost;
    } catch (error) {
      console.log('Error while editing post: ', error);
      throw new InternalServerErrorException('Something went wrong editing the post');
    }
  }
}
