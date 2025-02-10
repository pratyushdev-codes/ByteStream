import React from 'react';
import { useState } from 'react';
import ByteMessagingSideBar from './ByteMessagingSideBar';

const ByteMessaging = () => {
  const [isByteChat, setIsByteChatOpen] = useState(false);
  
  const toggleByteChat = () => {
    setIsByteChatOpen(!isByteChat);
  };

  return (
    <div className="w-full bg-primary shadow-sm rounded-xl px-6 py-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between text-ascent-1 pb-2">
          <span className="text-xl text-ascent-1 font-semibold flex flex-row">
            ByteChat &nbsp;
            <i className="fa-regular fa-message pt-1 px-1" style={{ scale: "0.9" }}></i>
          </span>
        </div>
        <div className="pt-6">
          <button 
            onClick={toggleByteChat}
            className="text-base flex flex-row text-ascent-1 md:px-4 md:py-2 border border-[#666] rounded-full"
          >
            Start Chat 
            <i className="fa-solid fa-caret-right pt-1 px-2"></i>
          </button>
          
          <ByteMessagingSideBar 
            isOpen={isByteChat} 
            toggleSidebar={toggleByteChat}
          />
        </div>
      </div>
    </div>
  );
};

export default ByteMessaging;