import React from "react";
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

const TopBar = () => {
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

  const handleSearch = async (data) => { };

  return (
    <div className='topbar w-full flex items-center justify-between py-3 md:py-6 px-4 bg-primary rounded-xl'>
      <Link to='/' className='flex gap-2 items-center'>
        <div className=' rounded text-white'>
          {/* <TbSocial /> */}
          <img src="./images/ByteStream.png" style={{ width: "50px", height: "50px", animation: "rotate 12s linear 0s infinite normal none running", }} alt="ByteStream" />
        </div>
        <span className='text-xl md:text-2xl text-[#065ad8] font-semibold'>
          Byte<span style={{ color: "white" }}>Stream</span>
        </span>
      </Link>

      <form
  className='hidden md:flex items-center justify-center'
  onSubmit={handleSubmit(handleSearch)}
>
  <TextInput
    placeholder='Search ByteStream'
    styles='w-[18rem] lg:w-[18rem] rounded-full py-3 bg-[#101010] border-[#666060] border' 
    register={register("search")}
  /> &nbsp;&nbsp;
  <CustomButton
    title={
      <>
        <i className="fa-solid fa-magnifying-glass"></i>
      </>
    }
    type='submit'
    containerStyles='bg-blue pw-3 text-white px-7 py-2.5 mt-2 rounded-full'
  />
</form>




      {/* ICONS */}
      <div className='flex gap-3 items-center text-ascent-1 text-md md:text-xl'>

        {/* Direct Message */}
      
        <div className="hidden lg:flex bg-[#065ad8] w-10 h-10 rounded-full text-white items-center justify-center cursor-pointer" 
  onClick={() => {
    // Open a new window with the specified URL, dimensions, and position
    let newWindow = window.open(
      'https://intelsy.onrender.com/', 
      'example', 
      'width=700,height=700,left=380,top=100'
    );
    newWindow.focus();

    // Add content to the new window once it has loaded
    newWindow.onload = function() {
      let html = `<div style="font-size:30px">ByteChat</div>`;
      newWindow.document.body.insertAdjacentHTML('afterbegin', html);
    };
  }}
>
  <i className="fa-solid fa-message" style={{ scale: "0.9" }}></i>
</div>


        <div className="hidden lg:flex bg-[#1d2224] w-10 h-10 rounded-full text-white items-center justify-center">
          <a href="" target="_blank" rel="noopener noreferrer">
            <img src="./images/Web.png" style={{ width: "35px", height: "23px" }} alt="Web Search" />
          </a>

        </div>

        {/* Upload media icons    */}
        <div className="hidden lg:flex bg-[#1d2224] w-10 h-10 rounded-full text-white items-center justify-center">
          <i class="fa-solid fa-cloud-arrow-up" style={{ scale: "0.9" }}></i>
        </div>


        <button className="bg-[#1d2224] hidden lg:flex w-10 h-10 rounded-full text-white flex items-center justify-center"
          onClick={() => handleTheme()}>
          {theme ? <BsMoon /> : <BsSunFill />}
        </button>
        <div className='hidden lg:flex bg-[#1d2224] w-10 h-10 rounded-full text-white items-center justify-center'>
          <IoMdNotificationsOutline />
        </div>

        {/* Intelsy Code editor redirect  */}

        <div className="hidden lg:flex bg-[#1d2224] w-14 h-10 rounded-3xl text-white items-center justify-center">
          <a href="https://intelsy.onrender.com/" target="_blank" rel="noopener noreferrer">
            <img src="./images/Intelsycompiler.png" style={{ width: "22px", height: "22px" }} alt="Intelsy Compiler" />
          </a>

        </div>
        <div>
          <CustomButton
            onClick={() => dispatch(Logout())}
            title='Log Out'
            containerStyles='text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border border-[#666] rounded-full'
          />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
