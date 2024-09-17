// src/pages/MyPurchases.tsx
import React from "react";
import { PlusIcon } from "@radix-ui/react-icons";

interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  price: number;
}

const MyPurchases: React.FC = () => {
  const wantedBooks: Book[] = [
    {
      id: "1",
      title: "工程地质学",
      author: "石振明/孔宪立",
      publisher: "中国建筑工业出版社",
      isbn: "9787562495000",
      price: 12,
    },
    {
      id: "2",
      title: "岩土力学",
      author: "石振明/孔宪立",
      publisher: "中国建筑工业出版社",
      isbn: "9787562495000",
      price: 9.9,
    },
    {
      id: "3",
      title: "英语2",
      author: "石振明/孔宪立",
      publisher: "中国建筑工业出版社",
      isbn: "9787562495000",
      price: 12,
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-100 pb-16 relative">
      <header className="bg-white p-4 text-center text-lg">
        我的求购
      </header>

      <div className="mt-2 bg-white p-4">
        <h2 className="font-bold mb-2">正在求购</h2>
        {wantedBooks.map((book) => (
          <div
            key={book.id}
            className="flex items-start mb-4 pb-4 border-b border-gray-200 last:border-b-0 relative"
          >
            <div className="w-16 h-20 bg-gray-200 mr-4"></div>
            <div className="flex-grow">
              <h3 className="font-bold">{book.title}</h3>
              <p className="text-xs text-gray-600">{book.author}</p>
              <p className="text-xs text-gray-600">{book.isbn}</p>
            </div>
            <div className="text-black-500 absolute right-4 bottom-4">
              ¥ {book.price.toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center bg-white p-4 mt-2 absolute bottom-14 w-full">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-gray-300 rounded-full mr-2 flex items-center justify-center">
            <PlusIcon className="text-white" />
          </div>
          <span>添加求购</span>
        </div>
      </div> 

    </div>
  );
};

export default MyPurchases;
