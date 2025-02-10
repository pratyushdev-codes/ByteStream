import React from 'react';
import ByteMessageMainComp from './ByteMessageMainComp';

const ByteMessagingSideBar = ({ isOpen, toggleSidebar }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-[#222222] text-white transition-transform rounded-r-xl duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      style={{ width: '35rem' }}
    >
      <ByteMessageMainComp isOpen={isOpen} toggleSidebar={toggleSidebar} />
    </div>
  );
};

export default ByteMessagingSideBar;