// src/components/Setting.tsx
import React from "react";
import BackButton from "../components/BackButton";

const Setting: React.FC = () => {
  const handleLogout = () => {
    // 实现退出登录的逻辑
    console.log("退出登录");
  };

  const handleDeleteAccount = () => {
    // 实现注销账号的逻辑
    console.log("注销账号");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <BackButton />
      <header className="bg-white p-4 flex items-center justify-center">
        <h1 className="text-lg font-semibold">设置</h1>
      </header>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            注销账号是不可恢复的操作，你应自行备份账号相关的信息和数据，操作之前，请确认与账号相关的所有服务均已妥善处理。
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mb-2">
            注销账号后，你将无法再使用本账号或找回你添加的任何内容信息，包括但不限于:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 leading-relaxed pl-4">
            <li>你将无法登录、使用本账号，你的朋友将无法通过本账号联系你。</li>
            <li>你账号的个人资料和历史信息都将无法找回。</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-auto">
          <button 
            onClick={handleDeleteAccount}
            className="w-full py-3 px-4 text-left text-red-500 font-medium border-b border-gray-200 hover:bg-red-50 transition duration-200"
          >
            注销账号
          </button>
          <button 
            onClick={handleLogout}
            className="w-full py-3 px-4 text-left text-gray-700 font-medium hover:bg-gray-50 transition duration-200"
          >
            退出登录
          </button>
        </div>
      </div>
    </div>
  );
};

export default Setting;