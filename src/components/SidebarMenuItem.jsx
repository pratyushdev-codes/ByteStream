import React from 'react';

const SidebarMenuItem = ({ icon, label, isOpen }) => {
  return (
    <a
      href="#"
      className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
    >
      <span className="inline-flex">{icon}</span>
      <span
        className={`ml-4 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {label}
      </span>
    </a>
  );
};

export default SidebarMenuItem;
