import React, { useState } from 'react';
import { X } from 'lucide-react';
import ByteMessageMainComp from './ByteMessageMainComp';
const ByteMessagingSideBar = ({ isOpen, toggleSidebar }) => {


    return (
        <div
            className={`fixed top-0 left-0 h-screen bg-[#222222] text-white transition-transform rounded-r-xl duration-300 ease-in-out z-50 ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
            style={{ width: '35rem' }}
        >
            <div className="flex justify-end p-2">

            </div>
            <ByteMessageMainComp />
        </div>
    );
};

export default ByteMessagingSideBar;