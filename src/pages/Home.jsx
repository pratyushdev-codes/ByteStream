import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CustomButton,
  EditProfile,
  FriendsCard,
  Loading,
  PostCard,
  ProfileCard,
  TextInput,
  TopBar,
} from "../components";
import { apiRequest, deletePost, fetchPosts, getUserInfo, handleFileUpload, handleView, likePost, sendFriendRequest } from "../Utils/index.js";
import { useNavigate } from "react-router-dom";
import { NoProfile } from "../assets";
import { BsFiletypeGif, BsPersonFillAdd } from "react-icons/bs";
import { BiImages, BiSolidVideo } from "react-icons/bi";
import { useForm } from "react-hook-form";
import { userLogin } from "../redux/userSlice.js";
import ProductBoard from "../components/ProductBoard";
// import Dock from "../components/ui/Dock";
import Quickpad from "../components/Quickpad";
import { ProjectTags } from "../components/ProjectTags";
import { Toaster, toast } from 'react-hot-toast'; // Import toast

const Home = () => {

  const { user, edit } = useSelector((state) => state.user);
  const [friendRequest, setFriendRequest] = useState([]);
  const { posts } = useSelector((state) => state.posts);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [file, setFile] = useState(null);
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(false);



  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();

  const getUser = async () => {

    const res = await getUserInfo(user?.token);
    const newData = { token: user?.token, ...res }
    dispatch(userLogin(newData));

  }

  const fetchPost = async () => {

    await fetchPosts(user?.token, dispatch);
    setLoading(false);

  }

  const handlePostSubmit = async (data) => {

    setPosting(true);
    setErrMsg("");

    try {

      const uri = file && (await handleFileUpload(file));
      const newData = uri ? { ...data, image: uri } : data;
      //If an image is existing in post then, we append that image to the post data which already includes the post info such as description, user, and time.

      const res = await apiRequest({
        url: "posts/create-post",
        data: newData,
        token: user?.token,
        method: "POST"
      });


      if (res?.status === 'failed') {
        setErrMsg(res);
      }
      else {
        setErrMsg("");
        reset({ description: "" });
        setFile(null);
        await fetchPost();
      }

      setPosting(false);

    } catch (error) {
      console.log(error)
      setPosting(false);
      setErrMsg(error);
    }

  };
  const handleLikePost = async (uri) => {

    await likePost({ uri: uri, token: user?.token });
    await fetchPost();

  }
  const handleDelete = async (id) => {

    await deletePost(id, user?.token);
    await fetchPost();

  }
  const fetchFriendRequests = async () => {

    try {
      const res = await apiRequest({
        url: "/users/get-friend-request/",
        method: "POST",
        token: user?.token,
      });

      setFriendRequest(res?.data);
    } catch (error) {
      console.log(error);
    }

  }
  const fetchSuggestedFriends = async () => {

    try {
      const res = await apiRequest({
        url: "/users/suggested-friends/",
        token: user?.token,
        method: "POST",
      });
      setSuggestedFriends(res?.data);
    } catch (error) {
      console.log(error);
    }

  }
  const handleFriendRequest = async (id) => {

    try {
      await sendFriendRequest(user.token, id);
      await fetchSuggestedFriends();
      await fetchFriendRequests();
      getUser();
    }
    catch (error) {
      console.log(error);
    }
  }

  const acceptFriendRequest = async (id, status) => {

    try {

      await apiRequest({
        url: "/users/accept-request/",
        token: user?.token,
        method: "POST",
        data: {
          rid: id,
          status
        }
      });

      await fetchSuggestedFriends();
      await fetchFriendRequests();
      getUser();
    } catch (error) {
      console.log(error);
    }

  }
  useEffect(() => {
    setLoading(true);
    getUser();
    fetchPost();
    fetchFriendRequests();
    fetchSuggestedFriends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLoading(true);
    getUser();
    fetchPost();
    fetchFriendRequests();
    fetchSuggestedFriends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edit]);

  //Edit is a state in userSlice which is set to true when the user clicks the edit button in ProfileCard. When the edit state changes, the useEffect hook will run again and fetch the user data from the server. For example - when user updates profile picture then after updating, edit will become false, so if we again fetch posts, the post which this user itself had posted will come with updated profile picture otherwise it will come with the old profile picture.

  // useEffect hook here is to set the loading state to true initially and then fetch user data, posts, friend requests, and suggested friends from the server when the component renders.

  // When the component mounts or when the edit state changes, the useEffect runs.



  const navigate = useNavigate();

  return (
    <>
      <div className='home w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden'>
        <TopBar />
        <div className='w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full'>
          {/*Left*/}
          <div className='hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto'>
            <ProfileCard user={user} />
            <FriendsCard friends={user?.friends} />
          </div>
          {/* CENTER */}
          <div className='flex-1 h-full px-4 flex flex-col gap-6 overflow-y-auto rounded-lg'>

            {/* Activity Center Heading */}
            <div className="w-full py-4 md:py-6 px-4 bg-primary bg-[url('./images/grad1.png')] rounded-lg text-[blue]">

              <div className="max-w-7xl mx-auto mb-8">
              <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-semibold text-transparent" style={{
                    background: 'linear-gradient(154deg, rgb(221, 230, 232), rgb(221, 230, 232), rgb(51, 152, 219))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    Dynamic Space
                  </h1>
                  <div className="flex items-center gap-4">
                    <button

                      className="text-base flex flex-row text-ascent-1 px-4 md:px-4 py-1 md:py-2 border border-[#666] rounded-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#D9D9D9"><path d="M200-766v572q-17-17-32-36t-28-39v-422q13-20 28-39t32-36Zm160-96v764q-21-7-41-15.5T280-133v-694q19-11 39-19.5t41-15.5Zm280 749v-734q106 47 173 145t67 222q0 124-67 222T640-113ZM480-80q-10 0-20-.5T440-82v-796q10-1 20-1.5t20-.5q20 0 40 2t40 6v784q-20 4-40 6t-40 2Z" /></svg>&nbsp;
                      Explore
                    </button>
                  </div>
                </div>
                <p className="text-gray-400 mt-2">
                  Schedule Meets • Collaborate work • Upload Data
                </p>
              </div>


              <div className="flex gap-6 justify-center mt-4">

                <div
                  className="recording flex gap-3 items-center  text-ascent-1 text-lg md:text-lg border-[white]  rounded-2xl p-4 bg-white bg-opacity-20 backdrop-blur-md"
                ><div className="hidden lg:flex bg-[white] w-12 h-9 rounded-full text-white items-center justify-center">
                    <i class="fa-solid fa-square blink" style={{ color: "#ff3737", scale: "0.9" }}></i><br />
                  </div>

                  <span className="text-sm font-medium">Schedule Meets in ByteMeet</span>
                </div>


                <div
                  className="recording  gap-3 items-center hidden lg:flex  text-ascent-1 text-lg md:text-lg border-[white]  rounded-2xl p-4 bg-white bg-opacity-20 backdrop-blur-md"
                >
                  <i class="fa-solid fa-file" style={{ color: "#045AD8", scale: "1.5" }}></i><br />

                  <span className="text-sm font-medium">Draft a ByteDoc</span>
                </div>



                <div
                  className="recording flex gap-3 items-center  text-ascent-1 text-lg md:text-lg border-[white]  rounded-2xl p-4 bg-white bg-opacity-20 backdrop-blur-md"
                >

                  <i class="fa-solid fa-message " style={{ color: "#045AD8", scale: "1.2" }}></i><br />
                  <span className="text-sm font-medium">In app messaging ByteMessaging</span>
                </div>

              </div>
            </div>


<div className="w-full py-4 md:py-6 px-4 bg-primary bg-[url('./images/grad1.png')] rounded-lg text-[blue]">
<div className="flex justify-between items-center">
  <h1 className="text-3xl font-semibold text-transparent" style={{
                    background: 'linear-gradient(154deg, rgb(221, 230, 232), rgb(221, 230, 232), rgb(51, 152, 219))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    Sync Space
                  </h1>
                  <div className="flex items-center gap-4">
                    <button

                      className="text-base flex flex-row text-ascent-1 px-4 md:px-4 py-1 md:py-2 border border-[#666] rounded-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#D9D9D9"><path d="M200-766v572q-17-17-32-36t-28-39v-422q13-20 28-39t32-36Zm160-96v764q-21-7-41-15.5T280-133v-694q19-11 39-19.5t41-15.5Zm280 749v-734q106 47 173 145t67 222q0 124-67 222T640-113ZM480-80q-10 0-20-.5T440-82v-796q10-1 20-1.5t20-.5q20 0 40 2t40 6v784q-20 4-40 6t-40 2Z" /></svg>&nbsp;
                      Session Flow
                    </button>
                  </div>

                </div>
                <p className="text-gray-400 mt-2">
                  No active session
                  
                </p> </div>
                  

            {/* Recording Section */}
            {/* Product board div */}
            <ProductBoard />

            {/* Quick Notes */}
            <Quickpad />




            <form
              onSubmit={handleSubmit(handlePostSubmit)}
              className='bg-primary px-4 rounded-lg'
            >
              <div className='w-full flex items-center gap-2 py-4 border-b border-[#66666645]'>
                <img
                  src={user?.profileUrl ?? NoProfile}
                  alt='User Image'
                  className='w-14 h-14 rounded-full object-cover'
                />
                <TextInput
                  styles='w-full rounded-full py-5'
                  placeholder="What's on your mind...."
                  name='description'
                  register={register("description", {
                    required: "Write something about post",
                  })}
                  error={errors.description ? errors.description.message : ""}
                />
              </div>
              {errMsg?.message && (
                <span
                  role='alert'
                  className={`text-sm ${errMsg?.status === "failed"
                    ? "text-[#f64949fe]"
                    : "text-[#2ba150fe]"
                    } mt-0.5`}
                >
                  {errMsg?.message}
                </span>
              )}

              <div className='flex items-center justify-between py-4'>
                <label
                  htmlFor='imgUpload'
                  className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'
                >
                  <input
                    type='file'
                    onChange={(e) => setFile(e.target.files[0])}
                    className='hidden'
                    id='imgUpload'
                    data-max-size='5120'
                    accept='.jpg, .png, .jpeg'
                  />
                  <BiImages />
                  <span>Image</span>
                </label>

                <label
                  className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'
                  htmlFor='videoUpload'
                >
                  <input
                    type='file'
                    data-max-size='5120'
                    onChange={(e) => setFile(e.target.files[0])}
                    className='hidden'
                    id='videoUpload'
                    accept='.mp4, .wav'
                  />
                  <BiSolidVideo />
                  <span>Video</span>
                </label>

                <label
                  className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'
                  htmlFor='vgifUpload'
                >
                  <input
                    type='file'
                    data-max-size='5120'
                    onChange={(e) => setFile(e.target.files[0])}
                    className='hidden'
                    id='vgifUpload'
                    accept='.gif'
                  />
                  <BsFiletypeGif />
                  <span>Gif</span>
                </label>
                <div>
                  <CustomButton

                    title='Summarize with AI'
                    containerStyles='bg-[linear-gradient(to_right,#a1c4fd_0%,#c2e9fb_51%,#a1c4fd_100%)] text-[grey] py-1 px-4 rounded-full font-semibold text-sm'
                  />
                </div>

                <div>
                  {posting ? (
                    <Loading />
                  ) : (
                    <CustomButton
                      type='submit'
                      title='Post'
                      containerStyles='bg-white text-blue py-1 px-6 rounded-full font-semibold text-sm'
                      onClick={() => {
                        toast.success("Posted in Stream");
                      }}
                    />
                  )}
                </div>
              </div>
              {/* <Dock /> */}
              <div flex flex-col>
                <button


                  className="text-base flex mb-3 flex-row text-ascent-1 px-4 md:px-4 py-1 md:py-2  rounded-full"
                >
                  <ProjectTags />
                </button>
              </div>
            </form>




            {loading ? (
              <Loading />
            ) : posts?.length > 0 ? (
              posts?.map((post) => (
                <PostCard
                  key={post?._id}
                  post={post}
                  user={user}
                  deletePost={handleDelete}
                  likePost={handleLikePost}
                />
              ))
            ) : (
              <div className='flex w-full h-full items-center justify-center'>
                <p className='text-lg text-ascent-2'>No Post Available</p>
              </div>
            )}
          </div>

          {/*Right*/}
          <div className='hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto'>
            {/* FRIEND REQUEST */}
            <div className='w-full bg-primary shadow-sm rounded-lg px-6 py-5'>
              <div className='flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]'>
                <span className="text-xl text-ascent-1  font-semibold flex flex-row"> Stream Requests &nbsp; <i className="fa-solid fa-code-pull-request " style={{ scale: "0.9" }}></i></span>
                <span>{friendRequest?.length}</span>
                {(!friendRequest) && <span>0</span>}
              </div>

              <div className='w-full flex flex-col gap-2 pt-2'>
                {friendRequest?.map(({ _id, requestFrom: from }) => (
                  <div key={_id} className='flex items-center justify-between'>
                    <div

                      className='w-full flex gap-4 items-center cursor-pointer'
                      onClick={() => {
                        handleView(from, user);
                        navigate("/profile/" + from._id)
                      }}
                    >
                      <img
                        src={from?.profileUrl ?? NoProfile}
                        alt={from?.firstName}
                        className='w-10 h-10 object-cover rounded-full'
                      />
                      <div className='flex-1'>
                        <p className='text-base font-medium text-ascent-1'>
                          {from?.firstName} {from?.lastName}
                        </p>

                        <span className='text-sm text-ascent-2'>
                          {from?.profession ?? ""}
                        </span>
                      </div>
                    </div>

                    <div className='flex gap-1'>
                      <CustomButton
                        title='Accept'
                        containerStyles='bg-[] text-xs text-white px-1.5 py-1 rounded-full'
                        onClick={() => acceptFriendRequest(_id, "Accepted")}
                      />
                      <CustomButton
                        title='Deny'
                        containerStyles='border border-[#666] text-xs text-ascent-1 px-1.5 py-1 rounded-full'
                        onClick={() => acceptFriendRequest(_id, "Denied")}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SUGGESTED FRIENDS */}
            <div className='w-full bg-primary shadow-sm rounded-lg px-5 py-5'>
              <div className='flex items-center justify-between text-lg text-ascent-1 border-[#66666645]'>
                <span className="text-xl text-ascent-1  font-semibold flex flex-row">Stream Suggestion &nbsp;<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#D9D9D9"><path d="M500-482q29-32 44.5-73t15.5-85q0-44-15.5-85T500-798q60 8 100 53t40 105q0 60-40 105t-100 53Zm220 322v-120q0-36-16-68.5T662-406q51 18 94.5 46.5T800-280v120h-80Zm80-280v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Zm-480-40q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM0-160v-112q0-34 17.5-62.5T64-378q62-31 126-46.5T320-440q66 0 130 15.5T576-378q29 15 46.5 43.5T640-272v112H0Zm320-400q33 0 56.5-23.5T400-640q0-33-23.5-56.5T320-720q-33 0-56.5 23.5T240-640q0 33 23.5 56.5T320-560ZM80-240h480v-32q0-11-5.5-20T540-306q-54-27-109-40.5T320-360q-56 0-111 13.5T100-306q-9 5-14.5 14T80-272v32Zm240-400Zm0 400Z" /></svg> </span>
              </div>
              <div className='w-full flex flex-col gap-4 pt-4'>
                {suggestedFriends?.map((friend) => (
                  <div
                    className='flex items-center justify-between'
                    key={friend._id}
                  >
                    <div
                      key={friend?._id}

                      onClick={() => {
                        handleView(friend, user);
                        navigate("/profile/" + friend?._id)
                      }}
                      className='w-full flex gap-4 items-center cursor-pointer'
                    >

                      <img
                        src={friend?.profileUrl ?? NoProfile}
                        alt={friend?.firstName}
                        className='w-10 h-10 object-cover rounded-full'
                      />
                      <div className='flex-1 '>
                        <p className='text-base font-medium text-ascent-1'>
                          {friend?.firstName} {friend?.lastName}
                        </p>
                        <span className='text-sm text-ascent-2'>
                          {friend?.profession ?? "No Profession"}
                        </span>
                      </div>
                    </div>

                    <div className='flex gap-1'>
                      <button
                        className='bg-[#E2E2E2] text-sm text-white p-1 rounded-xl'
                        onClick={() => { handleFriendRequest(friend._id) }}
                      >
                        <BsPersonFillAdd size={28} className='text-[#0f52b6]' />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {edit && <EditProfile />}
    </>
  )
}

export default Home