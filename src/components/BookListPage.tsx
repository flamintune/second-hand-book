// src/components/BookListPage.tsx
import React from "react";
import { Link } from "react-router-dom";

interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  price: number;
  notes?: string;
  lastRefreshAt: string;
  status: string;
  viewCount: number;
  isPurchase: boolean;
}

interface BookListPageProps {
  title: string;
  listTitle: string;
  addButtonText: string;
  books: Book[];
  addButtonLink: string;
  isLoading: boolean;
  onRefresh: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit?: (book: Book) => void;
}

const getStatusText = (status: string, isPurchase: boolean) => {
  if (status === "closed") return "已关闭";
  return isPurchase ? "正在求购" : "正在出售";
};

const BookListPage: React.FC<BookListPageProps> = ({
  title,
  listTitle,
  addButtonText,
  books,
  addButtonLink,
  isLoading,
  // onRefresh,
  onDelete,
  onEdit,
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

          {isLoading
            ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500">
                </div>
              </div>
            )
            : books.length > 0
            ? (
              <div className="mt-6 space-y-4">
                {books.map((book) => (
                  <div key={book.id} className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-medium">{book.title}</h3>
                        <p className="text-sm text-gray-500">
                          作者：{book.author}
                        </p>
                        <p className="text-sm text-gray-500">
                          出版社：{book.publisher}
                        </p>
                        <p className="text-sm text-gray-500">
                          ISBN：{book.isbn}
                        </p>
                        {book.notes && (
                          <p className="text-sm text-gray-600 mt-2">
                            备注：{book.notes}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-medium text-red-500">
                          ¥{book.price.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          浏览次数：{book.viewCount}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded ${
                          book.status === "closed" 
                            ? "bg-gray-100" 
                            : book.isPurchase 
                              ? "bg-blue-100 text-blue-600"
                              : "bg-green-100 text-green-600"
                        }`}>
                          {getStatusText(book.status, book.isPurchase)}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(book)}
                            className="px-4 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 min-w-[64px]"
                          >
                            修改
                          </button>
                        )}
                        {/* <button
                          onClick={() => onRefresh(book.id)}
                          className="px-4 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 min-w-[64px]"
                        >
                          擦亮
                        </button> */}
                        <button
                          onClick={() => onDelete(book.id)}
                          className="px-4 py-1.5 text-sm border border-red-300 text-red-500 rounded-md hover:bg-red-50 min-w-[64px]"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
            : (
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
