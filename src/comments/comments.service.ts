import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateCommentDTO,
  CommentProps,
  GetCommentsDTO,
} from './comments.types';
import { UserProps } from 'src/users/users.types';

@Injectable()
export class CommentsService {
  constructor(private readonly database: PrismaService) {}

  async createComment(
    createCommentDto: CreateCommentDTO,
  ): Promise<{ success: boolean; message?: string }> {
    const { postId, userId, body } = createCommentDto;

    try {
      // Check if post exists
      const postExists = await this.database.prisma.post.findUnique({
        where: { id: postId },
      });
      if (!postExists) {
        throw new NotFoundException('Post not found');
      }

      // Check if user exists
      const userExists = await this.database.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!userExists) {
        throw new NotFoundException('User not found');
      }

      // Create the comment
      await this.database.prisma.comment.create({
        data: {
          body: body,
          post: { connect: { id: postId } },
          user: { connect: { id: userId } },
          likesCount: 0,
        },
      });

      return { success: true };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        return { success: false, message: error.message };
      } else {
        console.error('Error creating comment:', error);
        throw new InternalServerErrorException(
          'An error occurred while creating the comment',
        );
      }
    }
  }

  async getAllComments(
    getCommentsDTO: GetCommentsDTO,
  ): Promise<{ comments: CommentProps[]; amount: number }> {
    const { postId, page } = getCommentsDTO;
    const commentsPerPage = page * 5;
    let totalComments: number;

    try {
      // Получаем общее количество комментариев
      totalComments = await this.database.prisma.comment.count({
        where: {
          postId,
        },
      });

      // Рассчитываем смещение и количество для пагинации

      // Получаем комментарии с учетом пагинации
      const comments = await this.database.prisma.comment.findMany({
        where: {
          postId,
        },
        include: {
          user: true,
        },
        orderBy: {
          dateOfCreation: 'desc',
        },

        take: commentsPerPage,
      });

      return {
        comments: comments.map((comment) => ({
          id: comment.id,
          postId: comment.postId,
          userId: comment.userId,
          body: comment.body,
          likesCount: comment.likesCount,
          dateOfCreation: comment.dateOfCreation,
          user: {
            id: comment.user.id,
            name: comment.user.name,
            email: comment.user.email,
            profilePicture: comment.user.profilePicture,
          } as UserProps,
        })),
        amount: totalComments,
      };
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw new InternalServerErrorException(
        'An error occurred while fetching comments',
      );
    }
  }
}
