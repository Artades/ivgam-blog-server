import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostProps } from './posts.types';
import { CreatePostDTO } from './posts.types';
import { UserProps } from 'src/users/users.types';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly database: PrismaService,
    private readonly emailService: EmailService,
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
}
