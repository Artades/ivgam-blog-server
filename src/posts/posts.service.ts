import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostProps } from './posts.types';
import { CreatePostDTO } from './posts.types';


@Injectable()
export class PostsService {
  constructor(
    private readonly database: PrismaService
    ){}


    public async createPost(credentials: CreatePostDTO):Promise<PostProps> {
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
      } catch (error) {
        
      }
    }

    public async getAllPosts():Promise<PostProps[]>{
      try {
        return this.database.prisma.post.findMany({});
      } catch (error) {
        throw new InternalServerErrorException("Something went wrong getting all posts")
      }
    }



}
