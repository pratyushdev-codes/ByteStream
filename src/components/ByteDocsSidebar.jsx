import React, { useState } from 'react';
import { X } from 'lucide-react';
import VideoChat from './VideoChat';
import { Toaster, toast } from 'react-hot-toast'; // Import toast
import ByteDocs from './ByteDocs';

const ByteDocsSidebar = ({ isOpen, toggleSidebar }) => {
 

  return (
    <div
      className={`fixed top-0 right-0 h-screen bg-gray-950 text-white transition-transform rounded-l-xl duration-300 ease-in-out z-10 ${
        isOpen ? 'translate-x-0' : 'translate-x-full '
      }`}
      style={{ width: '40rem' }} // 96px equivalent in Tailwind CSS
    >
     {/* Toaster for displaying notifications */}
      
     <div className="flex justify-between bg-gray-900 rounded-tl-2xl p-4 items-center">
  <h1
    className="text-3xl font-semibold text-transparent"
    style={{
      background: 'linear-gradient(154deg, rgb(221, 230, 232), rgb(221, 230, 232), rgb(51, 152, 219))',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    }}
  >
    ByteDocs
  </h1>
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
