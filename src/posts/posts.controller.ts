import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDTO, PostProps } from './posts.types';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/role.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('posts')
@ApiTags('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('createPost')
  @Roles(Role.AUTHOR)
  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  public async createPost(@Body() credentials: CreatePostDTO) {
    const response = this.postsService.createPost(credentials);
    return response;
  }

  @UseGuards(AuthGuard)
  @Get('getAll')
  public async getAllPosts(): Promise<PostProps[]> {
    const response = this.postsService.getAllPosts();
    return response;
  }

  @UseGuards(AuthGuard)
  @Post('suggestPost')
  public async suggestPost(
    @Body() body: { title: string; description: string; userEmail: string },
  ): Promise<{ success: boolean }> {
    const response = this.postsService.suggestPost(
      body.title,
      body.description,
      body.userEmail,
    );
    return response;
  }
  
  @Post('/:postId/addToFavorites/:userId')
  async addToFavorites(
    @Param('postId', ParseIntPipe) postId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<void> {
    await this.postsService.addToFavorites(postId, userId);
  }
}
