// src/components/Profile.tsx
import React from 'react';
import { GearIcon } from '@radix-ui/react-icons';

const Profile: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white p-4 flex justify-end">
        <GearIcon className="h-6 w-6 text-gray-500" />
      </header>
      
      <div className="flex flex-col items-center mt-8">
        <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
        <h2 className="mt-4 text-xl font-bold">爱睡觉的南泽洋</h2>
        <p className="text-sm text-gray-500">2023级|测绘</p>
        <div className="mt-2 text-sm text-gray-500">
          <p>+8613806628888</p>
          <p>2521373229</p>
        </div>
      </div>

      <div className="mt-8 mx-4">
        <button className="w-full py-3 bg-white rounded-lg mb-3 text-left px-4 flex items-center">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
          设置年级 (现在: 2023级)
        </button>
        <button className="w-full py-3 bg-white rounded-lg mb-3 text-left px-4 flex items-center">
          <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
          设置专业
        </button>
        <button className="w-full py-3 bg-white rounded-lg mb-3 text-left px-4 flex items-center">
          <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
          设置电话号码
        </button>
        <button className="w-full py-3 bg-white rounded-lg mb-3 text-left px-4 flex items-center">
          <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
          设置QQ号
        </button>
      </div>
    </div>
  );
};

export default Profile;