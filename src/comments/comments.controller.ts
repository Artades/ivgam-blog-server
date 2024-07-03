import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentProps, CreateCommentDTO } from './comments.types';


@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @Post('/create')
  async createComment(@Body() createCommentDto: CreateCommentDTO): Promise<{ success: boolean }> {
    return this.commentsService.createComment(createCommentDto);
  }
  @Get('/getAll/:postId')

  async getAllComments(@Param('postId', ParseIntPipe) postId: number ): Promise<CommentProps[]> {
    return this.commentsService.getAllComments(postId);
  }

}
