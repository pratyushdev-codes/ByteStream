import React, { useState } from "react";
import { TbSocial } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import TextInput from "./TextInput";
import CustomButton from "./CustomButton";
import { useForm } from "react-hook-form";
import { BsMoon, BsSunFill } from "react-icons/bs";
import { IoMdNotificationsOutline } from "react-icons/io";
import { SetTheme } from "../redux/theme";
import { Logout } from "../redux/userSlice";
import Ai from "./Ai";

const TopBar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Initialize modal state
  const { theme } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleTheme = () => {
    const themeValue = theme === "light" ? "dark" : "light";
    dispatch(SetTheme(themeValue));
  };

  const handleSearch = async (data) => {
    console.log("Search Data:", data);
  };

  return (
    <div className="topbar w-full flex items-center justify-between py-3 md:py-6 px-4 bg-[black]  text-white rounded-xl">
      <Link to="/" className="flex gap-2 items-center">
        <div className="rounded text-white">
          <img
            src="./images/ByteStream.png"
            style={{
              width: "50px",
              height: "50px",
              animation: "rotate 12s linear 0s infinite",
            }}
            alt="ByteStream"
          />
        </div>
        <span className="text-xl md:text-2xl text-[#065ad8] font-semibold">
          Byte<span style={{ color: "white" }}>Stream</span>
        </span>
      </Link>

      {/* Search Form */}
      <form
        className="hidden md:flex items-center justify-center"
        onSubmit={handleSubmit(handleSearch)}
      >
        <TextInput
          placeholder="Search ByteStream"
          styles="w-[18rem] lg:w-[18rem] rounded-full py-3 bg-[#101010] border-[#666060] border"
          register={register("search")}
        />{" "}
        &nbsp;&nbsp;
        <CustomButton
          title={
            <>
              <i className="fa-solid fa-magnifying-glass"></i>
            </>
          }
          type="submit"
          containerStyles="bg-blue pw-3 text-white px-7 py-2.5 mt-2 rounded-full"
        />
      </form>

      {/* Icons */}
      <div className="flex gap-3 items-center text-ascent-1 text-md md:text-xl">
        {/* Direct Message */}
        <div
          className="hidden lg:flex bg-[#065ad8] w-10 h-10 rounded-full text-white items-center justify-center cursor-pointer"
          onClick={() => {
            let newWindow = window.open(
              "https://intelsy.onrender.com/",
              "example",
              "width=700,height=700,left=380,top=100"
            );
            newWindow.focus();
            newWindow.onload = function () {
              newWindow.document.body.insertAdjacentHTML(
                "afterbegin",
                `<div style="font-size:30px">ByteChat</div>`
              );
            };
          }}
        >
          <i className="fa-solid fa-message" style={{ scale: "0.9" }}></i>
        </div>

        {/* Modal Trigger */}
        <div
          className="hidden lg:flex bg-[#1d2224] w-10 h-10 rounded-full text-white items-center justify-center cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="white"
          >
            <path d="M200-313q10-3 19.5-5t20.5-2h40v-480h-40q-17 0-28.5 11.5T200-760v447Zm40 233q-50 0-85-35t-35-85v-560q0-50 35-85t85-35h280v80H360v480h240v-120h80v200H240q-17 0-28.5 11.5T200-200q0 17 11.5 28.5T240-160h520v-320h80v400H240Zm-40-233v-487 487Zm500-167q0-92 64-156t156-64q-92 0-156-64t-64-156q0 92-64 156t-156 64q92 0 156 64t64 156Z" />
          </svg>
        </div>

        {/* Upload Media */}
        <div className="hidden lg:flex bg-[#1d2224] w-10 h-10 rounded-full text-white items-center justify-center">
          <i className="fa-solid fa-cloud-arrow-up" style={{ scale: "0.9" }}></i>
        </div>

        {/* Theme Toggle */}
        <button
          className="bg-[#1d2224] hidden lg:flex w-10 h-10 rounded-full text-white flex items-center justify-center"
          onClick={() => handleTheme()}
        >
          {theme === "light" ? <BsMoon /> : <BsSunFill />}
        </button>

        {/* Notifications */}
        <div className="hidden lg:flex bg-[#1d2224] w-12 h-10 rounded-full text-white items-center justify-center">
          <IoMdNotificationsOutline />
        </div>

{/* Intelsy Redirect */}
<div className="hidden lg:flex bg-[#1d2224] w-fit h-10 px-4 rounded-3xl text-white items-center space-x-2">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24"
    viewBox="0 -960 960 960"
    width="24"
    fill="#D9D9D9"
  >
    <path d="M600-120v-120H440v-400h-80v120H80v-320h280v120h240v-120h280v320H600v-120h-80v320h80v-120h280v320H600ZM160-760v160-160Zm520 400v160-160Zm0-400v160-160Zm0 160h120v-160H680v160Zm0 400h120v-160H680v160ZM160-600h120v-160H160v160Z" />
  </svg>
  <span className="text-sm "><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#D9D9D9"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/></svg></span>
</div>




        {/* Log Out */}
        <div>
          <CustomButton
            onClick={() => dispatch(Logout())}
            title="Log Out"
            containerStyles="text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border border-[#666] rounded-full"
          />
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[rgb(27 27 28)] text-white p-6 rounded-lg shadow-lg">
           <Ai/>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Close Modal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopBar;