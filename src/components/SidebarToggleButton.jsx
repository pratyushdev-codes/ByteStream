import React from 'react';
import { Menu } from 'lucide-react';

const SidebarToggleButton = ({ onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors ${className}`}
    >


    </button>
  );
};

export default SidebarToggleButton;
