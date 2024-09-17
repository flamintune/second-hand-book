// src/pages/Home.tsx
import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import Icon from '../components/Icon';

const Home: React.FC = () => {
  const bookListings = [
    { id: 1, title: '猫咪集美学', image: 'path_to_image' },
    { id: 2, title: '中国建筑史', image: 'path_to_image' },
    { id: 3, title: '高等数学1', image: 'path_to_image' },
    { id: 4, title: '线性代数', image: 'path_to_image' },
    { id: 5, title: '马克思主义原理', image: 'path_to_image' },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-[#FEE6E6] p-2 flex justify-between items-center">
        <p className="text-black-500 ml-4"><span className='mr-2'>!</span> 请完善个人信息</p>
      </header>

      {/* Tab navigation */}
      <Tabs.Root defaultValue="selling" className="flex-grow flex flex-col">
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
        <div className="bg-white p-4 w-full flex items-center">
          <div className='flex flex-col justify-center'>
            <Icon name="scan" className="h-6 w-6 text-gray-400 mr-2 mb-1"></Icon>
            <span className='text-xs'>扫码</span>
          </div>
          <div className="flex-grow flex items-center border border-gray-300 rounded-md p-2">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="搜索书名、作者、分类、ISBN"
              className="w-full outline-none"
            />
          </div>
        </div>

        {/* Book listings */}
        <Tabs.Content value="selling" className="flex-grow overflow-auto">
          <div className="grid grid-cols-2 gap-4 p-4">
            {bookListings.map((book) => (
              <div key={book.id} className="bg-white p-2 rounded-md shadow">
                <div className="aspect-w-1 aspect-h-1 bg-gray-200 mb-2">
                  {/* Book image would go here */}
                </div>
                <p className="text-sm font-medium">{book.title}</p>
              </div>
            ))}
          </div>
        </Tabs.Content>

        <Tabs.Content value="buying" className="flex-grow overflow-auto">
          {/* Content for the buying tab */}
          <div className="p-4">
            <p>求购列表内容将在这里显示</p>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};

export default Home;