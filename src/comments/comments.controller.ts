import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentProps, CreateCommentDTO, GetCommentsDTO } from './comments.types';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('/create')
  async createComment(
    @Body() createCommentDto: CreateCommentDTO,
  ): Promise<{ success: boolean }> {
    return this.commentsService.createComment(createCommentDto);
  }
  @Get('/getAll/')
  async getAllComments(
    @Query('postId', ParseIntPipe) postId: number,
    @Query('page') page: number,
  ): Promise<{comments: CommentProps[], amount: number}> {
    const dto: GetCommentsDTO = { postId, page }; // Создаем DTO для передачи сервису
    return this.commentsService.getAllComments(dto);
  }
}
