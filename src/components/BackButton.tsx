// src/components/BackButton.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from '@radix-ui/react-icons';

interface BackButtonProps {
  to?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ to = 'back' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to === 'back') {
      navigate(-1);
    } else {
      navigate(to);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="absolute top-4 left-4 flex items-center text-gray-600 hover:text-gray-900 z-10"
    >
      <ChevronLeftIcon className="w-5 h-5 mr-1" />
    </button>
  );
};

export default BackButton;