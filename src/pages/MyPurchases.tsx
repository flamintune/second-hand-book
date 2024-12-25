// src/pages/MyPurchases.tsx
import React, { useEffect, useState } from "react";
import BookListPage from "../components/BookListPage";
import { postApi, type Post } from "../api/post";
import { bookApi, type Book } from "../api/book";
import * as Toast from "@radix-ui/react-toast";
import { useUser } from "../contexts/UserContext";
import EditPostDrawer from '../components/EditPostDrawer';

interface PostWithBook extends Post {
  book?: Book;
}

const MyPurchases: React.FC = () => {
  const { user } = useUser();
  const [posts, setPosts] = useState<PostWithBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [editingPost, setEditingPost] = useState<PostWithBook | null>(null);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const response = await postApi.getUserPosts(user.id, true);
      
      // 如果没有数据，直接设置空数组
      if (!response.data) {
        setPosts([]);
        return;
      }

      const postsData = response.data;

      // 2. 获取每个帖子对应的书籍信息
      const postsWithBooks = await Promise.all(
        postsData.map(async (post) => {
          try {
            const bookResponse = await bookApi.searchBooks({ isbn: post.book_isbn });
            return {
              ...post,
              book: bookResponse.data[0],
            };
          } catch (err) {
            console.error(`Failed to fetch book info for ISBN ${post.book_isbn}:`, err);
            return post;
          }
        })
      );

      setPosts(postsWithBooks);
    } catch (err) {
      // 只有在真正的错误情况下才显示错误提示
      if (err instanceof Error && err.message !== 'No data') {
        setToastMessage("获取求购列表失败");
        setShowToast(true);
      }
      // 如果是因为没有数据导致的错误，设置空数组
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 转换 PostWithBook 为 BookListPage 需要的格式
  const books = posts.map(post => ({
    id: post.id.toString(),
    title: post.book?.book_name ?? '未知书名',
    author: post.book?.author ?? '未知作者',
    publisher: post.book?.press ?? '未知出版社',
    isbn: post.book_isbn,
    price: post.price,
    notes: post.notes,
    lastRefreshAt: post.last_refresh_at,
    status: post.post_status === 0 ? 'open' : 'closed',
    viewCount: post.poster_viewed_times,
    isPurchase: post.is_purchase,
  }));

  const handleDelete = async (id: string) => {
    if (!window.confirm('确定要删除这条求购信息吗？')) {
      return;
    }

    try {
      await postApi.deletePost(Number(id));
      setToastMessage("删除成功");
      setShowToast(true);
      // 重新获取列表
      fetchPurchases();
    } catch (err) {
      setToastMessage("删除失败，请稍后重试");
      setShowToast(true);
    }
  };

  const handleEdit = (book: any) => {
    const post = posts.find(p => p.id.toString() === book.id);
    if (post) {
      setEditingPost(post);
    }
  };

  const handleSaveEdit = async (price: number, notes: string) => {
    try {
      if (!editingPost) return;
      
      await postApi.updatePost(editingPost.id, {
        price,
        notes,
      });

      setToastMessage("修改成功");
      setShowToast(true);
      fetchPurchases(); // 刷新列表
    } catch (err) {
      setToastMessage("修改失败，请稍后再试");
      setShowToast(true);
      throw err;
    }
  };

  return (
    <>
      <BookListPage
        title="我的求购"
        listTitle="正在求购"
        addButtonText="添加求购"
        books={books}
        addButtonLink="/add-product?mode=buy"
        isLoading={isLoading}
        onRefresh={fetchPurchases}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      <EditPostDrawer
        post={editingPost}
        onClose={() => setEditingPost(null)}
        onSave={handleSaveEdit}
      />

      <Toast.Provider swipeDirection="right">
        <Toast.Root
          className="bg-white rounded-lg shadow-lg p-4 flex items-center justify-between"
          open={showToast}
          onOpenChange={setShowToast}
          duration={2000}
        >
          <Toast.Title>{toastMessage}</Toast.Title>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-0 right-0 flex flex-col p-6 gap-2 w-96 max-w-[100vw] m-0 list-none z-50" />
      </Toast.Provider>
    </>
  );
};

export default MyPurchases;