// src/pages/MyPurchases.tsx
import React from "react";
import BookListPage, { Book } from "../components/BookListPage";

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
    <BookListPage
      title="我的求购"
      listTitle="正在求购"
      addButtonText="添加求购"
      books={wantedBooks}
      addButtonLink=""
    />
  );
};

export default MyPurchases;