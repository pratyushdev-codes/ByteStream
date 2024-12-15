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
import {apiRequest, deletePost, fetchPosts, getUserInfo, handleFileUpload, handleView, likePost, sendFriendRequest} from "../Utils/index.js";
import { useNavigate } from "react-router-dom";
import { NoProfile } from "../assets";
import { BsFiletypeGif, BsPersonFillAdd } from "react-icons/bs";
import { BiImages, BiSolidVideo } from "react-icons/bi";
import { useForm } from "react-hook-form";
import { userLogin } from "../redux/userSlice.js";
import { Link } from "react-router-dom";
import Dock from "../components/ui/Dock";
import ProductBoard from "../components/ProductBoard";


//importing click counter



const Home = () => {

  const { user, edit } = useSelector((state) => state.user);
  const [friendRequest, setFriendRequest] = useState([]);
  const {posts} = useSelector((state) => state.posts);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [file, setFile] = useState(null);
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(false);

  const clickCount = useSelector((state) => 
    state.clickCounter?.clickCount ?? 0
  );


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  
  const getUser = async() => {

    const res = await getUserInfo(user?.token);
    const newData = {token: user?.token, ...res}
    dispatch(userLogin(newData));

  }

  const fetchPost = async() => {

    await fetchPosts(user?.token, dispatch);
    setLoading(false);

  }

  const handlePostSubmit = async (data) => {

    setPosting(true);
    setErrMsg("");

    try {
      
      const uri = file && (await handleFileUpload(file));
      const newData = uri ? {...data, image:uri} : data;
      //If an image is existing in post then, we append that image to the post data which already includes the post info such as description, user, and time.

      const res = await apiRequest({
        url: "posts/create-post",
        data: newData,
        token: user?.token,
        method: "POST"
      });


            if(res?.status === 'failed'){
        setErrMsg(res);
      }
      else{
        setErrMsg("");
        reset({description:""});
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
  const handleLikePost = async(uri) => {

    await likePost({uri:uri, token:user?.token});
    await fetchPost();

  }
  const handleDelete = async(id) => {

    await deletePost(id, user?.token);
    await fetchPost();  

  }
  const fetchFriendRequests = async() => {
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
  const fetchSuggestedFriends = async() => {
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
  const handleFriendRequest = async(id) => {

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
  
  const acceptFriendRequest = async(id, status) => {
    try {
      await apiRequest({
        url: "/users/accept-request/",
        token: user?.token,
        method: "POST",
        data: {
          rid: id,
          status: status.toLowerCase() // Ensure consistent casing
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
      <TopBar/>
      <div className='w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full'>
        {/*Left*/}
        <div className='hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto'>
          <ProfileCard user={user}/>
          <FriendsCard friends={user?.friends}/>
        </div>
         {/* CENTER */}
         <div className='flex-1 h-full px-4 flex flex-col gap-6 overflow-y-auto rounded-lg'>

{/* Activity Center Heading */}
<div className="w-full py-3 md:py-6 px-4 bg-primary bg-[url('./images/grad1.png')] rounded-lg text-[blue]">
<p
  className='text-xl md:text-2xl text-white font-semibold'
  style={{
    background: 'linear-gradient(135deg, #DDE6E8, #3398DB)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }}
>
  Dynamic Space
</p>


  <div className="flex gap-6 justify-center mt-4">

  <div
className="recording flex gap-3 items-center  text-ascent-1 text-lg md:text-lg border-[white]  rounded-2xl p-4 bg-white bg-opacity-20 backdrop-blur-md"
><div className="hidden lg:flex bg-[white] w-12 h-9 rounded-full text-white items-center justify-center">
<i class="fa-solid fa-square blink" style={{color:"#ff3737", scale:"0.9"}}></i><br/>
</div>

   <span className="text-sm font-medium">{clickCount} Connections in ByteMeet</span>
</div>


<div
className="recording  gap-3 items-center hidden lg:flex  text-ascent-1 text-lg md:text-lg border-[white]  rounded-2xl p-4 bg-white bg-opacity-20 backdrop-blur-md"
>
<i class="fa-solid fa-file" style={{color:"#045AD8", scale:"1.5"}}></i><br/>

   <span className="text-sm font-medium">6 are editing ByteDoc</span>
</div>



<div
className="recording flex gap-3 items-center  text-ascent-1 text-lg md:text-lg border-[white]  rounded-2xl p-4 bg-white bg-opacity-20 backdrop-blur-md"
>

<i class="fa-solid fa-cloud-arrow-up " style={{color:"#045AD8", scale:"1.2"}}></i><br/>
   <span className="text-sm font-medium">Upload Media to ByteCloud</span>
</div>

  </div>
</div>


{/* Recording Section */}
<ProductBoard/>




          
            <form
              onSubmit={handleSubmit(handlePostSubmit)}
              className='bg-primary px-4 rounded-lg'
            >
              <div className='w-full flex items-center gap-2 py-4 border-b border-[#66666645]'>
                <img
                  src={user?.profileUrl ?? NoProfile}
                  alt='User Image'
                  className='w-12 h-12 rounded-full object-cover'
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
                  className={`text-sm ${
                    errMsg?.status === "failed"
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
                    />
                  )}
                </div>
              </div>
              <Dock/>
            </form>

          
            

            {loading ? (
              <Loading />
            ) : posts?.length > 0 ? (
              posts?.map((post) => (
                <PostCard
                key={post?._id}
                post={post}
                user={user}
                deletePost={() => handleDelete(post._id)}
                likePost={() => handleLikePost(post._id)}
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
              <div className='flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]  '>
                <span>Stream Request &nbsp; <i className="fa-solid fa-code-pull-request " style={{scale:"0.9"}}></i></span>
                <span>{friendRequest?.length}</span>
              </div>

              <div className='w-full flex flex-col gap-4 pt-4'>
                {friendRequest?.map(({ _id, requestFrom: from }) => (
                  <div key={_id} className='flex items-center justify-between'>
                    <Link
                      to={"/profile/" + from._id}
                      className='w-full flex gap-4 items-center cursor-pointer'
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
                          {from?.profession ?? "No Profession"}
                        </span>
                      </div>
                    </Link>

                    <div className='flex gap-1'>
  <CustomButton
    title='Accept'
    onClick={() => acceptFriendRequest(_id, 'accepted')}
    containerStyles='bg-white text-xs text-[#045AD8] px-1.5 py-1 rounded-full'
  />
  <CustomButton
    title='Deny'
    onClick={() => acceptFriendRequest(_id, 'denied')}
    containerStyles='border border-[#666] text-xs text-ascent-1 px-1.5 py-1 rounded-full'
  />
</div>
                  </div>
                ))}
              </div>
            </div>

            {/* SUGGESTED FRIENDS */}
            <div className='w-full bg-primary shadow-sm rounded-lg px-5 py-5'>
              <div className='flex items-center justify-between text-lg text-ascent-1 border-b border-[#66666645]'>
                <span>Stream Suggestions &nbsp;<i class="fa-solid fa-user-plus" style={{scale:"0.9"}}></i> </span>
              </div>
              <div className='w-full flex flex-col gap-4 pt-4'>
                {suggestedFriends?.map((friend) => (
                  <div
                    className='flex items-center justify-between'
                    key={friend._id}
                  >
                    <Link
                      to={"/profile/" + friend?._id}
                      key={friend?._id}
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
                    </Link>

<div class="w-full bg-primary shadow-sm rounded-lg px-5 py-5">
  <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
      <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
    </svg>
  </div>
  <input datepicker id="default-datepicker" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date"/>
</div>


                    <div className='flex gap-1'>
                    <button
  className='bg-[#0444a430] text-sm text-white p-1 rounded'
  onClick={() => handleFriendRequest(friend._id)}
>
  <BsPersonFillAdd size={20} className='text-[#0f52b6]' />
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