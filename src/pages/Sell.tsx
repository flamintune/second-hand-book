// src/pages/Sell.tsx
import React from "react";
import BookListPage, { Book } from "../components/BookListPage";

const Sell: React.FC = () => {
  const sellingBooks: Book[] = [
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
  ];

  return (
    <BookListPage
      title="我的出售"
      listTitle="正在出售"
      addButtonText="添加出售"
      books={sellingBooks}
      addButtonLink="/add-product?mode=sell"
    />
  );
};

export default Sell;
