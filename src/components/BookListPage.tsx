// src/components/BookListPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  price: number;
  notes: string;
  lastRefreshAt: string;
  viewCount: number;
  status: string;
  isPurchase: boolean;
}

interface Props {
  title: string;
  listTitle: string;
  addButtonText: string;
  books: Book[];
  addButtonLink: string;
  isLoading?: boolean;
  onRefresh?: () => void;
  onDelete?: (id: string) => Promise<void>;
}

const getStatusText = (status: string, isPurchase: boolean) => {
  if (status === 'closed') return '已关闭';
  return isPurchase ? '正在求购' : '正在出售';
};

const BookListPage: React.FC<Props> = ({
  title,
  listTitle,
  addButtonText,
  books,
  addButtonLink,
  isLoading = false,
  onDelete,
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white p-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">{title}</h1>
        <Link
          to={addButtonLink}
          className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm"
        >
          {addButtonText}
        </Link>
      </header>

      <main className="flex-grow p-4">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <h2 className="text-md font-semibold">{listTitle}</h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : books.length > 0 ? (
            <div className="divide-y">
              {books.map((book) => (
                <div key={book.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-grow">
                      <h3 className="text-lg font-medium mb-1">{book.title}</h3>
                      <p className="text-sm text-gray-500 mb-1">
                        作者：{book.author} | 出版社：{book.publisher}
                      </p>
                      <p className="text-sm text-gray-500 mb-1">
                        ISBN：{book.isbn}
                      </p>
                      {book.notes && (
                        <p className="text-sm text-gray-600 mt-2">{book.notes}</p>
                      )}
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <p className="text-lg font-medium text-red-500 mb-2">
                        ¥{book.price.toFixed(2)}
                      </p>
                      {onDelete && (
                        <button
                          onClick={() => onDelete(book.id)}
                          className="text-sm text-red-500 hover:text-red-700"
                        >
                          删除
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                    <div>
                      <span>浏览 {book.viewCount} 次</span>
                      <span className="mx-2">|</span>
                      <span>
                        最后刷新：
                        {formatDistanceToNow(new Date(book.lastRefreshAt), {
                          addSuffix: true,
                          locale: zhCN,
                        })}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      book.status === 'open' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {getStatusText(book.status, book.isPurchase)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-32 text-gray-500">
              暂无数据
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BookListPage;