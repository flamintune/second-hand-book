// src/components/AddProduct.tsx
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import BackButton from "../components/BackButton";

const AddProduct: React.FC = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "sell"; // 默认为卖书模式

  const [isbn, setIsbn] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [bookCondition, setBookCondition] = useState<string[]>([]);
  const [message, setMessage] = useState<string[]>([]);

  const handleIsbnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsbn(e.target.value);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthor(e.target.value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value);
  };

  const handleBookConditionChange = (condition: string) => {
    setBookCondition((prev) =>
      prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition]
    );
  };

  const handleMessageChange = (msg: string) => {
    setMessage((prev) =>
      prev.includes(msg) ? prev.filter((m) => m !== msg) : [...prev, msg]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ mode, isbn, title, author, price, bookCondition, message });
    // 这里可以添加提交逻辑
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <BackButton />
      <header className="bg-white p-4 flex items-center justify-center">
        <h1 className="text-lg font-semibold">
          {mode === "buy" ? "添加求购信息" : "添加出售商品"}
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="flex-1 p-4 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h2 className="text-md font-semibold mb-4">添加图书信息</h2>
          <div className="mb-4">
            <label
              htmlFor="isbn"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ISBN编号:
            </label>
            <input
              type="text"
              id="isbn"
              value={isbn}
              onChange={handleIsbnChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="点击添加内容"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              书名:
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="点击添加内容"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="author"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              作者:
            </label>
            <input
              type="text"
              id="author"
              value={author}
              onChange={handleAuthorChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="点击添加内容"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              定价:
            </label>
            <input
              type="text"
              id="price"
              value={price}
              onChange={handlePriceChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="点击添加内容"
            />
          </div>
        </div>

        {mode === "sell" && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <h2 className="text-md font-semibold mb-4">添加书籍情况</h2>
            <div className="flex flex-wrap gap-2">
              {[
                "包含课后习题答案",
                "涂抹痕迹严重",
                "缺页",
                "书籍封面缺失",
                "书籍印刷水泡后模糊",
              ].map((condition) => (
                <button
                  key={condition}
                  type="button"
                  onClick={() => handleBookConditionChange(condition)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    bookCondition.includes(condition)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {condition}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h2 className="text-md font-semibold mb-4">添加留言</h2>
          <div className="flex flex-wrap gap-2">
            {[
              "晚上22点后可来信宿自取",
              "可配送到宿舍",
              mode === "sell" ? "买书赠送矿泉水一瓶" : "急需此书",
            ].map((msg) => (
              <button
                key={msg}
                type="button"
                onClick={() => handleMessageChange(msg)}
                className={`px-3 py-1 rounded-full text-sm ${
                  message.includes(msg)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {msg}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-4 py-3 bg-blue-500 text-white rounded-md"
        >
          {mode === "buy" ? "发布求购信息" : "提交出售信息"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
