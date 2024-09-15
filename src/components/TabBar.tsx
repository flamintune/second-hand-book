import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, MagnifyingGlassIcon, PlusCircledIcon, PersonIcon } from '@radix-ui/react-icons';

type Tab = {
  icon: React.ReactNode;
  label: string;
  to: string;
};

const TabBar: React.FC = () => {
  const tabs: Tab[] = [
    { icon: <HomeIcon className="w-6 h-6" />, label: '主页', to: '/home' },
    { icon: <MagnifyingGlassIcon className="w-6 h-6" />, label: '我的求购', to: '/my-purchases' },
    { icon: <PlusCircledIcon className="w-6 h-6" />, label: '我要卖', to: '/sell' },
    { icon: <PersonIcon className="w-6 h-6" />, label: '我的', to: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around items-center h-14">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full ${
                isActive ? 'text-blue-500' : 'text-gray-600'
              }`
            }
          >
            <div className="mb-1">{tab.icon}</div>
            <span className="text-xs">{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default TabBar;