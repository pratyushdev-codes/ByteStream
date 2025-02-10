import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { LiaEditSolid } from "react-icons/lia";

import {
  BsBriefcase,

  BsPersonFillAdd,
} from "react-icons/bs";

import { CiLocationOn } from "react-icons/ci";
import moment from "moment";
import ProjectTags from "./ProjectTag";
import { NoProfile } from "../assets";
import { UpdateProfile } from "../redux/userSlice";
import EditProfile from "./EditProfile";
import { apiRequest, sendFriendRequest } from "../Utils";

const ProfileCard = ({ user }) => {
  const { user: data, edit } = useSelector((state) => state.user);
     const { theme } = useSelector((state) => state.theme);
  const [mutualFriends, setMutualFriends] = useState("No");
  const dispatch = useDispatch();

   const handleFriendRequest = async() => {

    try {
      await sendFriendRequest(data.token, user._id);
      checkFriendRequestSent();
      } 
    catch (error) {
    console.log(error);
      }
  }
const checkFriendRequestSent = useCallback(async () => {
    try {
      const res = await apiRequest({
        url: "/users/check-friend-request-sent/",
        token: data.token,
        method: "POST",
        data: {
          from_id: user._id,
          to_id: data._id
        }
      });
      setMutualFriends(res.message);
    } catch (error) {
      console.log(error);
    }
  }, [user, data]);

  useEffect(() => {
    checkFriendRequestSent();
  }, [user, checkFriendRequestSent]);


  return (
    <div>
      <div className='w-full bg-primary flex flex-col items-center shadow-sm rounded-xl px-6 py-4 '>
        <div className='w-full flex items-center justify-between border-b pb-5 border-[#66666645]'>
        <Link to={"/profile/" + user?._id} className='flex gap-2'>
            <img
              src={user?.profileUrl ?? NoProfile}
              alt={user?.email}
              className='w-14 h-14 object-cover rounded-full'
            />

            <div className='flex flex-col justify-center'>
              <p className='text-2xl font-medium text-ascent-1'>
                {user?.firstName} {user?.lastName}
              </p>
              <span className='text-ascent-2'>
                {user?.profession ?? "No Profession"}
              </span>
            </div>
          </Link>

          <div className=''>
          {/* {console.log(data._id, 'dataid')}
          {console.log(user._id, 'user')} */}

            {user?._id === data?._id ? (
              
             
              <svg 
              xmlns="http://www.w3.org/2000/svg" 
              height="26px" 
              viewBox="0 -960 960 960" 
              width="26px" 
              fill="#D9D9D9" 
              onClick={() => dispatch(UpdateProfile(true))} // Dispatch to set edit mode
            >
              <path d="M240-160q-33 0-56.5-23.5T160-240q0-33 23.5-56.5T240-320q33 0 56.5 23.5T320-240q0 33-23.5 56.5T240-160Zm0-240q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm0-240q-33 0-56.5-23.5T160-720q0-33 23.5-56.5T240-800q33 0 56.5 23.5T320-720q0 33-23.5 56.5T240-640Zm240 0q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Zm240 0q-33 0-56.5-23.5T640-720q0-33 23.5-56.5T720-800q33 0 56.5 23.5T800-720q0 33-23.5 56.5T720-640ZM480-400q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm40 240v-123l221-220q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q8 9 12.5 20t4.5 22q0 11-4 22.5T863-380L643-160H520Zm300-263-37-37 37 37ZM580-220h38l121-122-18-19-19-18-122 121v38Zm141-141-19-18 37 37-18-19Z" />
            </svg>
            
            ) : (
              mutualFriends === 'No' ? (
              <button
                className='bg-[#0444a430] text-sm text-white p-1 rounded'
                onClick={() => {handleFriendRequest();}}
              >
              
                <BsPersonFillAdd size={20} className='text-[#0f52b6]' />
              </button>) : (<div></div>)
            )}
          </div>
        </div>

        <div className='w-full flex flex-col mb-4 gap-2 py-4 border-b border-[#66666645]'>
          <div className='flex gap-2 items-center text-ascent-2'>
            <CiLocationOn className='text-xl text-ascent-1' />
            <span>{user?.location ?? "Add Location"}</span>
          </div>

          <div className='flex gap-2 items-center text-ascent-2'>
            <BsBriefcase className=' text-lg text-ascent-1' />
            <span>{user?.profession ?? "Add Profession"}</span>
          </div>
        </div>

        <div className='w-full flex flex-col gap-2 mb-6'>
          <p className='text-xl text-ascent-1 font-semibold'>
            {user?.friends?.length} Connections
          </p>

          <div className='flex items-center justify-between'>
            <span className='text-ascent-2'>Who viewed your profile</span>
            <span className='text-ascent-1 text-lg'>{user?.views?.length}</span>
          </div>

          <span className='text-base text-blue'>
           {user?.verified ? "Verified Account" : "Not Verified"}
          </span>

          <div className='flex items-center justify-between'>
            <span className='text-ascent-2'>Joined</span>
            <span className='text-ascent-1 text-base'>
              {moment(user?.createdAt).fromNow()}
            </span>
          </div>
        </div>

        <div
  className={`w-full flex flex-col gap-4 py-4 pb-6 mb-2 rounded-2xl p-4 
    ${theme === "light" ? "bg-transparent border border-gray-700" : "bg-[#222222]"}`}
>
  <p className="text-ascent-1 flex flex-row text-lg font-semibold">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="#D9D9D9"
    >
      <path d="m656-120-56-56 63-64-63-63 56-57 64 64 63-64 57 57-64 63 64 64-57 56-63-63-64 63Zm-416-80q17 0 28.5-11.5T280-240q0-17-11.5-28.5T240-280q-17 0-28.5 11.5T200-240q0 17 11.5 28.5T240-200Zm0 80q-50 0-85-35t-35-85q0-50 35-85t85-35q37 0 67.5 20.5T352-284q39-11 63.5-43t24.5-73v-160q0-83 58.5-141.5T640-760h46l-63-63 57-57 160 160-160 160-57-56 63-64h-46q-50 0-85 35t-35 85v160q0 73-47 128.5T354-203q-12 37-43.5 60T240-120Zm-64-480-56-56 63-64-63-63 56-57 64 64 63-64 57 57-64 63 64 64-57 56-63-63-64 63Z" />
    </svg>
    &nbsp; Tag Projects
  </p>

  <ProjectTags />
</div>

      </div>
    </div>
  );
};

export default ProfileCard;