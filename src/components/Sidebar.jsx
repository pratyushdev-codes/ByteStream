import React, { useState } from 'react';
import { X } from 'lucide-react';
import VideoChat from './VideoChat';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [showVideoChat, setShowVideoChat] = useState(false);

  return (
    <div
      className={`fixed top-0 right-0 h-screen bg-[#222222] text-white transition-transform rounded-l-xl duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full '
      }`}
      style={{ width: '26rem' }} // 96px equivalent in Tailwind CSS
    >
      <div className="flex justify-end p-4">
        <button
          onClick={toggleSidebar}
          className="text-gray-300 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {showVideoChat ? (
        <div className="p-4">
          <button
            onClick={() => setShowVideoChat(false)}
            className="mb-4 text-sm text-gray-300 hover:text-white flex items-center gap-2"
          >
            <X size={16} /> Close Video Chat
          </button>
          <div className="h-[calc(100vh-120px)] overflow-y-auto">
            <VideoChat />
          </div>
        </div>
      ) : (
        <nav className="mt-8">
          <div className="flex justify-between items-center p-4">
            <h1
              className="text-3xl font-semibold text-transparent"
              style={{
                background:
                  'linear-gradient(154deg, rgb(221, 230, 232), rgb(221, 230, 232), rgb(51, 152, 219))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ByteCall
            </h1>
          </div>
          <p className="text-gray-400 text-lg pl-4">
            Schedule Meets • Collaborate Work • Upload Data
          </p>
          <div className="flex items-center gap-4 p-6">
              <button
                onClick={() => setShowVideoChat(true)}
                className="text-base flex flex-row text-ascent-1 px-4 md:px-4 py-1 md:py-2 border border-[#666] rounded-full"
              >
       <i className="fa-solid fa-video py-1 " 
                
                >
                  
                  </i>
                &nbsp; Start a call
              </button>
            </div>
        </nav>
      )}
    </div>
  );
};

export default Sidebar;
