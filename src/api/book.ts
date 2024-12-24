import request from '../utils/request';

interface Book {
  ID: number;
  book_name: string;
  isbn: string;
  author: string;
  press: string;
  press_date: string;
  press_place: string;
  price: number;
  pictures: string;
  clc_code: string;
  book_desc: string;
}

export const bookApi = {
  // 搜索书籍
  searchBooks: (query: { name?: string; isbn?: string }) => {
    return request.get<{ data: Book[] }>('/books', { params: query });
  },
};

export type { Book };