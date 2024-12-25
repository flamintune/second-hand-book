// src/pages/Home.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as Tabs from '@radix-ui/react-tabs';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import Icon from '../components/Icon';
import { userApi } from '../api/user';
import { postApi, type Post } from "../api/post";
import { bookApi, type Book } from "../api/book";
import * as Toast from "@radix-ui/react-toast";

interface PostWithBook extends Post {
  book?: Book;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('selling');
  const [showProfileAlert, setShowProfileAlert] = useState(false);
  const [posts, setPosts] = useState<PostWithBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // 检查用户信息是否完善
  useEffect(() => {
    const checkUserProfile = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return;

        const userId = JSON.parse(storedUser).id;
        const response = await userApi.getUser(userId);
        const user = response.user;

        // 检查必要字段是否已填写
        const isProfileComplete = !!(
          user.nickname &&
          user.grade &&
          user.major &&
          user.connection &&
          user.connection_type
        );

        setShowProfileAlert(!isProfileComplete);
      } catch (err) {
        console.error('获取用户信息失败:', err);
      }
    };

    checkUserProfile();
    fetchPosts();
  }, [activeTab]); // 当标签页切换时重新获取帖子

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/book-search?mode=${activeTab}&query=${encodeURIComponent(searchTerm)}`);
    }
  };

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      // 根据当前标签页获取对应类型的帖子
      const response = await postApi.getPosts({ 
        open_only: true,
        is_purchase: activeTab === 'buying'
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
      setToastMessage("获取帖子列表失败");
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  // 获取用户角色文本
  const getUserRoleText = (isPurchase: boolean) => {
    return isPurchase ? '买家' : '卖家';
  };

  // 获取操作按钮文本
  const getActionButtonText = (isPurchase: boolean) => {
    return isPurchase ? '联系买家' : '联系卖家';
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header - 只在需要时显示 */}
      {showProfileAlert && (
        <header className="bg-[#FEE6E6] p-2 flex justify-between items-center">
          <p className="text-black-500 ml-4">
            <span className='mr-2'>!</span> 
            <Link to="/profile" className="hover:underline">
              请完善个人信息
            </Link>
          </p>
        </header>
      )}

      {/* Tab navigation */}
      <Tabs.Root 
        value={activeTab}
        className="flex-grow flex flex-col"
        onValueChange={(value) => setActiveTab(value)}
      >
        <Tabs.List className="flex bg-white">
          <Tabs.Trigger
            value="selling"
            className="flex-1 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black"
          >
            正在出售
          </Tabs.Trigger>
          <Tabs.Trigger
            value="buying"
            className="flex-1 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black"
          >
            求购列表
          </Tabs.Trigger>
        </Tabs.List>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="bg-white p-4 w-full flex items-center">
          {/* <div className='flex flex-col justify-center'>
            <Icon name="scan" className="h-6 w-6 text-gray-400 mr-2 mb-1"></Icon>
            <span className='text-xs'>扫码</span>
          </div> */}
          <div className="flex-grow flex items-center border border-gray-300 rounded-md p-2">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="搜索书名、作者、分类、ISBN"
              className="w-full outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>

        {/* Posts content */}
        <div className="flex-grow overflow-auto p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <div key={post.id} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {post.book?.book_name ?? '未知书名'}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          作者：{post.book?.author ?? '未知作者'}
                        </p>
                        <p className="text-sm text-gray-500">
                          出版社：{post.book?.press ?? '未知出版社'}
                        </p>
                        <p className="text-sm text-gray-500">
                          ISBN：{post.book_isbn}
                        </p>
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
                    {post.notes && (
                      <p className="mt-3 text-sm text-gray-600">{post.notes}</p>
                    )}
                    <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                      <div>
                        <span>{getUserRoleText(post.is_purchase)}：{post.poster_user.nickname}</span>
                        <span className="mx-2">|</span>
                        <span>浏览 {post.poster_viewed_times} 次</span>
                      </div>
                      <button className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        {getActionButtonText(post.is_purchase)}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Tabs.Root>

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

export default Home;