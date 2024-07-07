import {UserProps} from 'src/users/users.types';

export interface CreateCommentDTO {
  body: string;
  postId: number;
  userId: number;
}
export interface GetCommentsDTO {
  postId: number;
  page: number;
}

export interface CommentProps {
  id: number;
  postId: number;
  userId: number;
  body: string;
  likesCount: number;
  user: UserProps;
  dateOfCreation: Date;
}

export interface CommentsServiceProps {
  createComment(
    createCommentDto: CreateCommentDTO,
  ): Promise<{success: boolean}>;
}

export interface CommentsControllerProps {
  createComment(
    createCommentDto: CreateCommentDTO,
  ): Promise<{success: boolean}>;
}
