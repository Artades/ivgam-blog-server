export interface CreatePostDTO {
  title: string;
  body: string;
  topic: string;
  hashtags: string[];
}

export interface PostProps {
  id: number;
  title: string;
  body: string;
  dateOfCreation: string;
  dateOfUpdation: string;
  topic: string;
  hashtags: string[];
  views: number;
  likesAmount: number;
}

export interface PostsControllerProps {
  public createPost(credentials: CreatePostDTO): Promise<{ success: boolean }>;
  public getAllPosts(): Promise<PostProps[]>;
  public suggestPost(
    title: string,
    description: string,
    userEmail: string,
  ): Promise<{ success: boolean }>;
  likePost(postId: number, userId: number): Promise<void>;
}

export interface PostsServiceProps {
  public createPost(credentials: CreatePostDTO): Promise<PostProps>;
  public getAllPosts(): Promise<PostProps[]>;
  public suggestPost(
    title: string,
    description: string,
    userEmail: string,
  ): Promise<{ success: boolean }>;
  likePost(postId: number, userId: number): Promise<void>;
  addToFavorites(postId: number, userId: number): Promise<void>;
}
