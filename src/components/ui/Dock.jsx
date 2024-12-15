import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { incrementClickCount } from "../../redux/clickCounterSlice";
import "./style.css";

const Dock = () => {
  const dispatch = useDispatch();

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
            className="fa-solid fa-video"
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
