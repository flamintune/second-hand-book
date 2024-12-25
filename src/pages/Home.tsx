// src/pages/Home.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as Tabs from '@radix-ui/react-tabs';
import { userApi } from '../api/user';
import { postApi, PostQuery, type Post } from "../api/post";
import { bookApi, type Book } from "../api/book";
import * as Toast from "@radix-ui/react-toast";
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon, SliderIcon } from '@radix-ui/react-icons';

interface PostWithBook extends Post {
  book?: Book;
}

// 添加空状态组件
const EmptyState = ({ activeTab }: { activeTab: string }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="w-24 h-24 mb-4 text-gray-300">
      {/* 可以替换成其他图标或图片 */}
      <svg
        className="w-full h-full"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v2h-2v-2zm0-2h2V7h-2v7z" />
      </svg>
    </div>
    <p className="text-gray-500 text-lg mb-2">
      暂无{activeTab === 'selling' ? '出售' : '求购'}信息
    </p>
    <p className="text-gray-400 text-sm mb-4">
      {activeTab === 'selling' 
        ? '还没有人发布出售信息' 
        : '还没有人发布求购信息'}
    </p>
    <Link
      to={`/add-product?mode=${activeTab === 'selling' ? 'sell' : 'buy'}`}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
    >
      {activeTab === 'selling' ? '发布出售' : '发布求购'}
    </Link>
  </div>
);

const Home: React.FC = () => {
  // const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('selling');
  const [showProfileAlert, setShowProfileAlert] = useState(false);
  const [posts, setPosts] = useState<PostWithBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState<'latest' | 'price'>('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 12;
  const [showFilter, setShowFilter] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);

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

  // const handleSearch = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (searchTerm.trim()) {
  //     // 根据当前标签页和搜索词构建查询参数
  //     const params = new URLSearchParams({
  //       mode: activeTab,
  //       query: searchTerm.trim(),
  //       is_purchase: (activeTab === 'buying').toString()
  //     });
  //     navigate(`/book-search?${params.toString()}`);
  //   }
  // };

  const fetchPosts = async (page = currentPage) => {
    try {
      setIsLoading(true);
      
      const query: PostQuery = {
        open_only: true,
        is_purchase: activeTab === 'buying',
        page_index: page,
        page_size: PAGE_SIZE,
      };

      // ��加价格区间
      if (priceRange.min) query.price_min = Number(priceRange.min);
      if (priceRange.max) query.price_max = Number(priceRange.max);

      // 添加排序条件
      if (sortBy === 'latest') {
        query.last_refresh_after = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(); // 最近7天
      }

      const response = await postApi.getPosts(query);
      
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

  // 处理联系买家/卖家
  const handleContact = async (postId: number) => {
    try {
      setContactLoading(true);
      const response = await postApi.getPosterContact(postId);
      
      const contactInfo = response.data;
      const contactValue = contactInfo.connection;
      
      // 复制到剪贴板
      await navigator.clipboard.writeText(contactValue);
      
      // 获取联系方式类型文本
      const typeText = {
        1: 'QQ',
        2: '微信',
        3: '手机',
      }[contactInfo.connection_type] || '未知';
      
      setToastMessage(`${typeText}号已复制到剪贴板`);
      setShowToast(true);
    } catch (err) {
      setToastMessage("获取联系方式失败，请稍后再试");
      setShowToast(true);
    } finally {
      setContactLoading(false);
    }
  };

  // 修改筛选条件组件
  const FilterSection = () => (
    <div className="bg-white border-b">
      <div className="flex justify-between items-center px-4 py-2">
        <div className="flex space-x-4">
          <button
            onClick={() => setShowFilter(true)}
            className="flex items-center text-gray-600 text-sm"
          >
            <SliderIcon className="w-4 h-4 mr-1" />
            筛选
          </button>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as 'latest' | 'price');
              setCurrentPage(1);
              fetchPosts(1);
            }}
            className="text-sm text-gray-600 bg-transparent border-none outline-none"
          >
            <option value="latest">最新发布</option>
            <option value="price">价格排序</option>
          </select>
        </div>
      </div>

      {/* 筛选弹窗 */}
      <Dialog.Root open={showFilter} onOpenChange={setShowFilter}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/30" />
          <Dialog.Content className="fixed bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto bg-white rounded-t-2xl p-4 animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-lg font-semibold">筛选条件</Dialog.Title>
              <Dialog.Close className="rounded-full p-1 hover:bg-gray-100">
                <Cross2Icon className="w-4 h-4" />
              </Dialog.Close>
            </div>

            <div className="space-y-6">
              {/* 价格区间 */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">价格区间</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="最低价"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                      className="w-full px-6 py-2 border rounded-lg text-sm"
                    />
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">¥</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="最高价"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                      className="w-full px-6 py-2 border rounded-lg text-sm"
                    />
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">¥</span>
                  </div>
                </div>
              </div>

              {/* 快捷价格选择 */}
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">快捷选择</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: '0-20元', min: '0', max: '20' },
                    { label: '20-50元', min: '20', max: '50' },
                    { label: '50-100元', min: '50', max: '100' },
                  ].map((range) => (
                    <button
                      key={range.label}
                      onClick={() => setPriceRange({ min: range.min, max: range.max })}
                      className="w-full px-3 py-2 text-sm border rounded-lg hover:bg-gray-50"
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 底部按钮 */}
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => {
                    setPriceRange({ min: '', max: '' });
                    setSortBy('latest');
                  }}
                  className="flex-1 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  重置
                </button>
                <button
                  onClick={() => {
                    setCurrentPage(1);
                    fetchPosts(1);
                    setShowFilter(false);
                  }}
                  className="flex-1 py-2 bg-blue-500 text-white rounded-lg text-sm"
                >
                  确定
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );

  // 添加分页组件
  const Pagination = () => (
    <div className="flex justify-center items-center space-x-2 mt-4 pb-4">
      <button
        onClick={() => {
          const newPage = currentPage - 1;
          setCurrentPage(newPage);
          fetchPosts(newPage);
        }}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded ${
          currentPage === 1 
            ? 'bg-gray-200 text-gray-500' 
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        上一页
      </button>
      <span className="text-gray-600">第 {currentPage} 页</span>
      <button
        onClick={() => {
          const newPage = currentPage + 1;
          setCurrentPage(newPage);
          fetchPosts(newPage);
        }}
        disabled={posts.length < PAGE_SIZE}
        className={`px-4 py-2 rounded ${
          posts.length < PAGE_SIZE
            ? 'bg-gray-200 text-gray-500'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        下一页
      </button>
    </div>
  );

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

        {/* 筛选条件区域 */}
        <FilterSection />

        {/* Posts content */}
        <div className="flex-grow overflow-auto p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : posts.length > 0 ? (
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
                      <button 
                        onClick={() => handleContact(post.id)}
                        disabled={contactLoading}
                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                      >
                        {contactLoading ? '获取中...' : getActionButtonText(post.is_purchase)}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState activeTab={activeTab} />
          )}
        </div>

        {/* 只在有数据时显示分页 */}
        {posts.length > 0 && <Pagination />}
      </Tabs.Root>

      <Toast.Provider swipeDirection="right">
        <Toast.Root
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                     bg-black bg-opacity-75 text-white rounded-lg shadow-lg p-4 
                     flex items-center justify-center min-w-[200px]"
          open={showToast}
          onOpenChange={setShowToast}
          duration={2000}
        >
          <Toast.Title className="text-center">{toastMessage}</Toast.Title>
        </Toast.Root>
        <Toast.Viewport className="fixed inset-0 flex items-center justify-center pointer-events-none" />
      </Toast.Provider>
    </div>
  );
};

export default Home;