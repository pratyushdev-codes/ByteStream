import React, { useState } from 'react';
import { X } from 'lucide-react';
import VideoChat from './VideoChat';
import { Toaster, toast } from 'react-hot-toast'; // Import toast
import ByteDocs from './ByteDocs';

const ByteDocsSidebar = ({ isOpen, toggleSidebar }) => {
 

  return (
    <div
      className={`fixed top-0 right-0 h-screen bg-gray-950 text-white transition-transform rounded-l-xl duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full '
      }`}
      style={{ width: '50rem' }} // 96px equivalent in Tailwind CSS
    >
     {/* Toaster for displaying notifications */}
      
      <div className="flex justify-end p-4">
        <button
          onClick={toggleSidebar}
          className="text-gray-300 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>

     <ByteDocs/>

    </div>
  );
};

export default ByteDocsSidebar;
