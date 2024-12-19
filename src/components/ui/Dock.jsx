import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./style.css";
import Sidebar from "../Sidebar";
import { Menu } from "lucide-react";

const Dock = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Move toggleSidebar inside Dock to access setIsSidebarOpen
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const ToggleButton = () => (
    <button
      onClick={toggleSidebar}
      className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
    >
      <Menu size={20} />
      <span>Toggle Menu</span>
    </button>
  );

  // Ensure clickCount has a default fallback to 0
  const clickCount = useSelector((state) => state?.clickCounter?.clickCount ?? 0);

  console.log("Current Click Count:", clickCount);

  return (
    <div>
      <nav className="ui-dock">
        <a
          href="https://bytecall.onrender.com"
          target="_blank"
          rel="noopener noreferrer"
        >
        
          <i
            className="fa-solid fa-message"
            style={{ transform: "scale(1.3)", color: "#ffffff" }}
          ></i>
        </a>
        <a href="#search">
          <i
            className="fa-solid fa-cloud-arrow-up"
            style={{ transform: "scale(1.3)", color: "#ffffff" }}
          ></i>
        </a>
        <a href="#following">
          <i
            className="fa-solid fa-file"
            style={{ transform: "scale(1.3)", color: "#ffffff" }}
          ></i>
        </a>
      </nav>
    </div>
  );
};

export default Dock;
