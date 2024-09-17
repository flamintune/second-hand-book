// src/components/BookListPage.tsx
import React from "react";
import { PlusIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";

export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  price: number;
}

interface BookListPageProps {
  title: string;
  listTitle: string;
  addButtonText: string;
  addButtonLink: string;
  books: Book[];
}

const BookListPage: React.FC<BookListPageProps> = ({
  title,
  listTitle,
  addButtonText,
  addButtonLink,
  books,
}) => {
  return (
    <div className="flex flex-col h-screen bg-gray-100 pb-16 relative">
      <header className="bg-white p-4 text-center text-lg">{title}</header>

      <div className="mt-2 bg-white p-4">
        <h2 className="font-bold mb-2">{listTitle}</h2>
        {books.map((book) => (
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

      <Link 
        to={addButtonLink}
        className="flex items-center justify-center bg-white p-4 mt-2 absolute bottom-14 w-full"
      >
        <div className="flex items-center">
          <div className="w-6 h-6 bg-gray-300 rounded-full mr-2 flex items-center justify-center">
            <PlusIcon className="text-white" />
          </div>
          <span>{addButtonText}</span>
        </div>
      </Link>
    </div>
  );
};

export default BookListPage;