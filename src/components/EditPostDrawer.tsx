import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Post } from '../api/post';
import { Book } from '../api/book';

interface EditPostDrawerProps {
  post: (Post & { book?: Book }) | null;
  onClose: () => void;
  onSave: (price: number, notes: string) => Promise<void>;
}

const EditPostDrawer: React.FC<EditPostDrawerProps> = ({ post, onClose, onSave }) => {
  const [form, setForm] = React.useState({ price: '', notes: '' });

  React.useEffect(() => {
    if (post) {
      setForm({
        price: post.price.toString(),
        notes: post.notes || '',
      });
    }
  }, [post]);

  const handleSave = async () => {
    try {
      await onSave(Number(form.price), form.notes);
      onClose();
    } catch (err) {
      // 错误处理由父组件完成
      throw err;
    }
  };

  return (
    <Dialog.Root open={!!post} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30" />
        <Dialog.Content className="fixed right-0 top-0 h-full w-[90%] max-w-md bg-white shadow-xl p-6 animate-slide-left">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-lg font-semibold">
                修改帖子
              </Dialog.Title>
              <Dialog.Close className="rounded-full p-1 hover:bg-gray-100">
                <Cross2Icon className="w-4 h-4" />
              </Dialog.Close>
            </div>

            {/* Content */}
            <div className="flex-grow overflow-y-auto">
              {post && (
                <>
                  <div className="mb-6">
                    <h3 className="text-base font-medium text-gray-900 mb-2">
                      {post.book?.book_name ?? '未知书名'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      作者：{post.book?.author ?? '未知作者'}
                    </p>
                    <p className="text-sm text-gray-500">
                      ISBN：{post.book_isbn}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        价格
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={form.price}
                          onChange={(e) => setForm(prev => ({ ...prev, price: e.target.value }))}
                          className="w-full px-8 py-2 border rounded-lg text-sm"
                          placeholder="请输入价格"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          ¥
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        备注
                      </label>
                      <textarea
                        value={form.notes}
                        onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                        rows={4}
                        placeholder="添加备注信息"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex space-x-4 pt-4 mt-4 border-t">
              <button
                onClick={onClose}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-sm"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2 bg-blue-500 text-white rounded-lg text-sm"
              >
                确定
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default EditPostDrawer; 