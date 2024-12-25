// src/components/BookSearch.tsx
import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { useSearchParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { postApi, type Post } from "../api/post";
import { bookApi, type Book } from "../api/book";
import * as Toast from "@radix-ui/react-toast";

interface PostWithBook extends Post {
  book?: Book;
}

const BookSearch: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'selling' | 'buying'>(
    searchParams.get('mode') as 'selling' | 'buying' || 'selling'
  );
  const [searchTerm, setSearchTerm] = useState(searchParams.get('query') || '');
  const [posts, setPosts] = useState<PostWithBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    fetchPosts();
  }, [activeTab, searchTerm]);

  const fetchPosts = async () => {
    if (!searchTerm.trim()) {
      setPosts([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      // 根据搜索条件获取帖子
      const response = await postApi.getPosts({ 
        open_only: true,
        is_purchase: activeTab === 'buying',
        // book_name: searchTerm.trim()  // 添加书名搜索参数
      });
      
      if (!response.data) {
        setPosts([]);
        return;
      }

      const postsData = response.data;

      // 获取每个帖子对应的书籍信息
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
      setToastMessage("搜索失败");
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('query', e.target.value);
    setSearchParams(newSearchParams);
  };

  const handleTabChange = (tab: 'selling' | 'buying') => {
    setActiveTab(tab);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('mode', tab);
    setSearchParams(newSearchParams);
  };

  // 获取用户角色文本
  const getUserRoleText = (isPurchase: boolean) => {
    return isPurchase ? '买家' : '卖家';
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <BackButton to="/home"/>
      <header className="bg-white p-4">
        <h1 className="text-lg font-semibold text-center">图书搜索</h1>
      </header>

      <div className="flex justify-around bg-white mb-2">
        <button
          className={`py-2 px-4 ${activeTab === 'selling' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
          onClick={() => handleTabChange('selling')}
        >
          正在出售
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'buying' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
          onClick={() => handleTabChange('buying')}
        >
          求购列表
        </button>
      </div>

      <div className="px-4 mb-4">
        <div className="relative flex items-center">
          <MagnifyingGlassIcon className="absolute left-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder={`搜索${activeTab === 'selling' ? '出售' : '求购'}图书`}
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-2 pl-10 border border-gray-300 rounded-full"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : posts.length > 0 ? (
          posts.map(post => (
            <div key={post.id} className="bg-white p-4 mb-2 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{post.book?.book_name ?? '未知书名'}</h3>
                  <p className="text-sm text-gray-600">作者：{post.book?.author ?? '未知作者'}</p>
                  <p className="text-sm text-gray-500">ISBN：{post.book_isbn}</p>
                  <p className="text-sm text-gray-500">
                    {getUserRoleText(post.is_purchase)}：{post.poster_user.nickname}
                  </p>
                  {post.notes && (
                    <p className="text-sm text-gray-600 mt-2">{post.notes}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-lg font-medium text-red-500">
                    ¥{post.price.toFixed(2)}
                  </p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    post.is_purchase ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {post.is_purchase ? '求购' : '出售'}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-8">
            暂无搜索结果
          </div>
        )}
      </div>

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
    </div>
  );
};

export default BookSearch;