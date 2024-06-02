import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PostsService } from './posts.service';

import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/role.decorator';
import { Role } from 'src/enums/role.enum';
import { multerConfig } from 'src/common/multer.config';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { CreatePostDTO, CreatePostWithImageDTO, PostProps } from './posts.types';

@Controller('posts')
@ApiTags('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('createPost')
  // @Roles(Role.AUTHOR)
  // @UseGuards(AuthGuard)
  // @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('image', multerConfig))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreatePostWithImageDTO })
  public async createPost(
    @Body() credentials: CreatePostDTO,
    @UploadedFile() image: Express.Multer.File,
  ) {
  
    const imageUrl = image ? `/uploads/${image.filename}` : null;
    const response = await this.postsService.createPost(credentials, imageUrl);
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
  ): Promise<{ success: boolean }> {
    return await this.postsService.addToFavorites(postId, userId);
  }

  @Delete('/:postId/removeFromFavorites/:userId')
  async removeFromFavorites(
    @Param('postId', ParseIntPipe) postId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<{ success: boolean }> {
    return await this.postsService.removeFromFavorites(postId, userId);
  }

  @Get('/:postId')
  async getPostById(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<PostProps> {
    return await this.postsService.getPostById(postId);
  }
}
