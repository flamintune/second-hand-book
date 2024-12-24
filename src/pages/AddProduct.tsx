// src/components/AddProduct.tsx
import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import { postApi } from "../api/post";
import { bookApi, type Book } from "../api/book";
import * as Toast from "@radix-ui/react-toast";
import * as Dialog from "@radix-ui/react-dialog";
import { MagnifyingGlassIcon, Cross2Icon } from "@radix-ui/react-icons";

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "sell";

  const [searchMode, setSearchMode] = useState<'name' | 'isbn'>('name');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [price, setPrice] = useState("");
  const [bookCondition, setBookCondition] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchError, setSearchError] = useState("");

  // 搜索书籍
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      setIsSearching(true);
      setSearchError("");
      const response = await bookApi.searchBooks(
        searchMode === 'name' 
          ? { name: searchTerm }
          : { isbn: searchTerm }
      );

      if (response.data.length === 0) {
        setSearchError(
          searchMode === 'name' 
            ? "未找到相关图书" 
            : "未找到该ISBN对应的图书"
        );
        return;
      }

      if (searchMode === 'isbn') {
        // ISBN 搜索直接选中第一本书
        setSelectedBook(response.data[0]);
        setSearchTerm("");
      } else {
        // 书名搜索显示结果列表
        setSearchResults(response.data);
      }
    } catch (err) {
      setSearchError("搜索失败，请稍后重试");
    } finally {
      setIsSearching(false);
    }
  };

  // 处理书籍选择
  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
    setSearchTerm("");
    setSearchResults([]);
    setDrawerOpen(false);
  };

  // 修改表单验证
  const validateForm = () => {
    if (!selectedBook) {
      return "请先选择要出售的书籍";
    }
    if (!price.trim() || isNaN(Number(price))) {
      return "请输入有效价格";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const error = validateForm();
    if (error) {
      setToastMessage(error);
      setShowToast(true);
      return;
    }

    try {
      setIsSubmitting(true);
      // 合并书籍状态和备注为一个字符串
      let notes = note.trim();
      if (bookCondition.length > 0) {
        notes = bookCondition.join('；') + (notes ? '；' + notes : '');
      }
      if (!selectedBook) {
        setToastMessage("请先选择要出售的书籍");
        setShowToast(true);
        return;
      }
      await postApi.createPost({
        book_isbn: selectedBook.isbn,
        price: Number(price),
        notes: notes,
        is_purchase: mode === 'buy',
      });

      setToastMessage(mode === "buy" ? "求购信息发布成功" : "出售信息发布成功");
      setShowToast(true);
      
      setTimeout(() => {
        navigate(mode === "buy" ? "/my-purchase" : "/sell");
      }, 1000);
    } catch (err) {
      setToastMessage("发布失败，请稍后重试");
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 处理书籍状态选择
  const handleBookConditionChange = (condition: string) => {
    setBookCondition((prev) =>
      prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition]
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <BackButton />
      <header className="bg-white p-4 flex items-center justify-center">
        <h1 className="text-lg font-semibold">
          {mode === "buy" ? "添加求购信息" : "添加出售商品"}
        </h1>
      </header>

      <div className="flex-1 relative">
        <form onSubmit={handleSubmit} className="h-full overflow-y-auto pb-20">
          <div className="p-4 space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-md font-semibold mb-4">图书信息</h2>
              
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setSearchMode('name');
                    setSearchTerm("");
                    setSearchError("");
                    setSelectedBook(null);
                  }}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                    searchMode === 'name'
                      ? "bg-blue-500 text-white" 
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  通过书名搜索
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchMode('isbn');
                    setSearchTerm("");
                    setSearchError("");
                    setSelectedBook(null);
                  }}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                    searchMode === 'isbn'
                      ? "bg-blue-500 text-white" 
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  通过ISBN搜索
                </button>
              </div>

              {/* 书名搜索模式 */}
              {searchMode === 'name' && (
                <Dialog.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
                  <Dialog.Trigger asChild>
                    <button
                      type="button"
                      className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 mb-4"
                    >
                      选择课本
                    </button>
                  </Dialog.Trigger>

                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/30" />
                    <Dialog.Content className="fixed bottom-0 left-0 right-0 h-[80vh] bg-white rounded-t-xl p-4 shadow-xl focus:outline-none">
                      <div className="flex items-center justify-between mb-4">
                        <Dialog.Title className="text-lg font-medium">
                          搜索课本
                        </Dialog.Title>
                        <Dialog.Close className="rounded-full p-1 hover:bg-gray-100">
                          <Cross2Icon className="h-4 w-4" />
                        </Dialog.Close>
                      </div>

                      <div className="relative mb-4">
                        <div className="absolute inset-y-0 left-3 flex items-center">
                          <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setSearchError("");
                          }}
                          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                          className="w-full pl-10 pr-20 py-2 text-sm text-gray-700 bg-gray-100 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent"
                          placeholder="搜索课本..."
                        />
                        <button
                          type="button"
                          onClick={handleSearch}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
                        >
                          搜索
                        </button>
                      </div>

                      <div className="overflow-y-auto h-[calc(100%-120px)]">
                        {isSearching ? (
                          <div className="flex items-center justify-center h-[200px]">
                            <div className="text-gray-500">搜索中...</div>
                          </div>
                        ) : searchResults.length > 0 ? (
                          <div className="grid grid-cols-2 gap-4">
                            {searchResults.map((book) => (
                              <button
                                key={book.isbn}
                                onClick={() => handleBookSelect(book)}
                                className="p-3 text-left border rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              >
                                <div className="font-medium line-clamp-2">{book.book_name}</div>
                                <div className="text-xs text-gray-500 mt-1">作者：{book.author}</div>
                                <div className="text-xs text-gray-500">出版社：{book.press}</div>
                                <div className="text-xs text-gray-500">ISBN：{book.isbn}</div>
                              </button>
                            ))}
                          </div>
                        ) : searchError ? (
                          <div className="flex items-center justify-center h-[200px]">
                            <div className="text-gray-500">{searchError}</div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-[200px]">
                            <div className="text-gray-500">请输入书名搜索</div>
                          </div>
                        )}
                      </div>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>
              )}

              {/* ISBN 搜索模式 */}
              {searchMode === 'isbn' && (
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-3 flex items-center">
                    <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setSearchError("");
                      if (e.target.value.length >= 10) {
                        handleSearch();
                      }
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className={`w-full pl-10 pr-20 py-2 text-sm text-gray-700 bg-gray-100 border ${
                      searchError ? 'border-red-500' : 'border-transparent'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent`}
                    placeholder="输入ISBN搜索..."
                  />
                  {isSearching ? (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSearch}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
                    >
                      搜索
                    </button>
                  )}
                </div>
              )}

              {searchError && searchMode === 'isbn' && (
                <p className="mt-1 text-sm text-red-500">{searchError}</p>
              )}

              {/* 已选择的书籍信息 */}
              {selectedBook && (
                <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                  <div className="text-lg font-medium mb-2">{selectedBook.book_name}</div>
                  <div className="text-sm text-gray-500">作者：{selectedBook.author}</div>
                  <div className="text-sm text-gray-500">出版社：{selectedBook.press}</div>
                  <div className="text-sm text-gray-500">ISBN：{selectedBook.isbn}</div>
                </div>
              )}

              {(selectedBook || searchMode) && (
                <>
                  <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      设置价格：
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="请输入价格"
                    />
                  </div>

                  {mode === "sell" && (
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                      <h2 className="text-md font-semibold mb-4">书籍状态</h2>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "包含课后题答案",
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
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder={mode === "sell" 
                        ? "例如：上22点后可来信宿自取、可配送到宿舍等" 
                        : "例如：急需此书、希望尽快联系等"}
                      className="w-full p-2 border border-gray-300 rounded-md min-h-[100px] resize-none"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </form>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
          <button
            type="submit"
            disabled={isSubmitting || (!selectedBook && !searchMode)}
            onClick={handleSubmit}
            className={`w-full py-3 text-white rounded-md ${
              isSubmitting || (!selectedBook && !searchMode) 
                ? "bg-blue-300" 
                : "bg-blue-500"
            }`}
          >
            {isSubmitting 
              ? "发布中..." 
              : mode === "buy" 
                ? "发布求购信息" 
                : "提交出售信息"}
          </button>
        </div>
      </div>

      <Toast.Provider swipeDirection="right">
        <Toast.Root
          className="bg-white rounded-lg shadow-lg p-4 flex items-center justify-between"
          open={showToast}
          onOpenChange={setShowToast}
          duration={2000}
        >
          <Toast.Title>{toastMessage}</Toast.Title>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-0 right-0 flex flex-col p-6 gap-2 w-96 max-w-[100vw] m-0 list-none z-50" />
      </Toast.Provider>
    </div>
  );
};

export default AddProduct;
