// src/components/BookSearch.tsx
import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { useSearchParams } from 'react-router-dom';
import BackButton from '../components/BackButton';

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  price: number;
}

const BookSearch: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'selling' | 'buying'>(
    searchParams.get('mode') as 'selling' | 'buying' || 'selling'
  );
  const [searchTerm, setSearchTerm] = useState(searchParams.get('query') || '');

  // 模拟的出售图书数据
  const sellingBooks: Book[] = [
    { id: '1', title: '爱情是的糖浆', author: '工程地质学', isbn: '9787562495000', price: 12 },
    { id: '2', title: '焦木小调链', author: '工程地质学', isbn: '9787562495000', price: 12.5 },
    { id: '3', title: '让我我清醒的米奇妙屋', author: '工程地质学', isbn: '9787562495000', price: 13 },
  ];

  // 模拟的求购图书数据
  const buyingBooks: Book[] = [
    { id: '4', title: 'Dior&PRADA', author: '工程地质学', isbn: '9787562495000', price: 12.88 },
    { id: '5', title: '焦点与恒机', author: '工程地质学', isbn: '9787562495000', price: 11.99 },
  ];

  const filterBooks = (books: Book[], term: string) => {
    return books.filter(book => 
      book.title.toLowerCase().includes(term.toLowerCase()) ||
      book.author.toLowerCase().includes(term.toLowerCase())
    );
  };

  const filteredBooks = activeTab === 'selling' 
    ? filterBooks(sellingBooks, searchTerm)
    : filterBooks(buyingBooks, searchTerm);

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('mode', activeTab);
    newSearchParams.set('query', searchTerm);
    setSearchParams(newSearchParams);
  }, [activeTab, searchTerm, setSearchParams]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleTabChange = (tab: 'selling' | 'buying') => {
    setActiveTab(tab);
    // setSearchTerm(''); // 切换标签时清空搜索词
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
        {filteredBooks.map(book => (
          <div key={book.id} className="bg-white p-4 mb-2 rounded-lg shadow flex items-center">
            <div className="w-12 h-16 bg-gray-200 mr-4"></div>
            <div className="flex-1">
              <h3 className="font-semibold">{book.title}</h3>
              <p className="text-sm text-gray-600">{book.author}</p>
              <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>
            </div>
            <div className="text-red-500 font-semibold">¥{book.price.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookSearch;