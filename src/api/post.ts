import request from '../utils/request';

// 帖子类型定义
interface Post {
  id: number;
  book_isbn: string;
  poster_user: {
    id: number;
    nickname: string;
    grade?: string;
    major?: string;
  };
  post_status: number;
  price: number;
  notes: string;
  last_refresh_at: string;
  poster_viewed_times: number;
  is_purchase: boolean;
}

// 新建帖子请求参数
interface NewPostRequest {
  book_isbn: string;
  price: number;
  notes: string;
  is_purchase: boolean;
}

// 获取帖子列表的查询参数
interface PostQuery {
  id?: number;
  book_isbn?: string;
  poster_user_id?: number;
  is_purchase?: boolean;
}

export const postApi = {
  // 获取帖子列表
  getPosts: (query?: PostQuery) => {
    return request.get<{ data: Post[] }>('/posts', { params: query });
  },

  // 获取单个帖子
  getPost: (id: number) => {
    return request.get<{ data: Post }>(`/posts/${id}`);
  },

  // 获取帖子发布者联系方式
  getPosterContact: (postId: number) => {
    return request.get<{ data: { connection: string; connection_type: number } }>(
      `/posts/${postId}?contact=true`
    );
  },

  // 创建新帖子
  createPost: (data: NewPostRequest) => {
    return request.post<{ message: string }>('/posts', data);
  },

  // 更新帖子
  updatePost: (id: number, data: Partial<NewPostRequest>) => {
    return request.put<{ message: string }>(`/posts/${id}`, data);
  },

  // 刷新帖子
  refreshPost: (id: number) => {
    return request.put<{ message: string }>(`/posts/${id}?refresh=true`);
  },

  // 删除帖子
  deletePost: (id: number) => {
    return request.delete<{ message: string }>(`/posts/${id}`);
  },

  // 获取用户发布的所有帖子
  getUserPosts: (userId: number, isPurchase: boolean) => {
    return request.get<{ data: Post[] }>('/posts', {
      params: {
        poster_user_id: userId,
        open_only: true,
        is_purchase: isPurchase,
      }
    });
  },
};

export type { Post, NewPostRequest, PostQuery }; 