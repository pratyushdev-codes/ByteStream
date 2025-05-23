import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { TbSocial } from "react-icons/tb";
import { BsShare } from "react-icons/bs";
import { AiOutlineInteraction } from "react-icons/ai";
import { ImConnection } from "react-icons/im";
import { CustomButton, Loading, TextInput } from "../components";
import { BgImage } from "../assets";
import { apiRequest, handleFileUpload } from "../Utils";
import toast from "react-hot-toast";
const Register = () => {

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const [errMsg, setErrMsg] = useState("");
  const [picture, setPicture] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelect = (e) => {
    setPicture(e.target.files[0]);
  };

  const onSubmit = async (data) => {
    
    setIsSubmitting(true);
    const { firstName, lastName, email, password } = data;
    const uri = picture && (await handleFileUpload(picture));
    

    try {
      
      const res = await apiRequest({
        url: '/auth/register',
        data: { firstName, lastName, email, password, profileUrl: uri ? uri : "" },
        method: 'POST'
      })

      if(res?.status === "failed") {
        setErrMsg(res);
        setIsSubmitting(false);
        toast.error("Unable to Sign Up")
      }

      else{
        setErrMsg(res);
        setTimeout(() =>{
          window.location.replace('/login');
        }, 1000)
        setIsSubmitting(false);
        toast.success("Email Verification sent to your Email ID")
      }

    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }

  };

  return (
    <div className='bg-bgColor w-full h-[100vh] flex items-center justify-center p-6'>
      <div className='w-full md:w-2/3 h-fit lg:h-full 2xl:h-400px py-8 lg:py-0 flex flex-row-reverse bg-primary rounded-xl overflow-hidden shadow-xl'>
        {/* RIGHT */}
        <div className='w-full lg:w-1/2 h-full p-10 2xl:px-20 flex flex-col justify-center '>
          <div className='w-full flex gap-2 items-center mb-4'>
            <img src="./images/ByteStream.png" style={{ width: "50px", height: "50px", animation: "rotate 12s linear 0s infinite normal none running", }} alt="ByteStream" />
            <span className='text-2xl text-[#065ad8] font-semibold'>
              ByteStream
            </span>
          </div>

          <p className='text-ascent-1 text-base font-semibold'>
            Create your account
          </p>

          <form
            className='py-5 flex flex-col gap-5'
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className='w-full flex flex-col lg:flex-row gap-1 md:gap-2'>
              <TextInput
                name='firstName'
                label='First Name'
                placeholder='First Name'
                type='text'
                styles='w-full rounded-full'
                
                register={register("firstName", {
                  required: "First Name is required!",
                })}
                error={errors.firstName ? errors.firstName?.message : ""}
              />

              <TextInput
                label='Last Name'
                placeholder='Last Name'
                type='lastName'
                styles='w-full  rounded-full'
                register={register("lastName", {
                  required: "Last Name do no match",
                })}
                error={errors.lastName ? errors.lastName?.message : ""}
              />
            </div>

            <TextInput
              name='email'
              placeholder='email@example.com'
              label='Email Address'
              type='email'
              register={register("email", {
                required: "Email Address is required",
              })}
              styles='w-full  rounded-full'
              error={errors.email ? errors.email.message : ""}
            />

            <div className='w-full flex flex-col lg:flex-row gap-1 md:gap-2'>
              <TextInput
                name='password'
                label='Password'
                placeholder='Password'
                type='password'
                styles='w-full  rounded-full'
                register={register("password", {
                  required: "Password is required!",
                })}
                error={errors.password ? errors.password?.message : ""}
              />

              <TextInput
                label='Confirm Password'
                placeholder='Password'
                type='password'
                styles='w-full  rounded-full'
                register={register("cPassword", {
                  validate: (value) => {
                    const { password } = getValues();

                    if (password !== value) {
                      return "Passwords do no match";
                    }
                  },
                })}
                error={
                  errors.cPassword && errors.cPassword.type === "validate"
                    ? errors.cPassword?.message
                    : ""
                }
              />
            </div>
              <label
                className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4'
                htmlFor='imgUpload'
              >Upload your Profile Picture
                <input
                  type='file'
                  className=''
                  id='imgUpload'
                  onChange={(e) => handleSelect(e)}
                  accept='.jpg, .png, .jpeg'
                /> 
              </label>

            {/* {errMsg?.message && (
              <span
                className={`text-sm ${
                  errMsg?.status === "failed"
                    ? "text-[#f64949fe]"
                    : "text-[#2ba150fe]"
                } mt-0.5`}
              >
                {errMsg?.message}
              </span>
            )} */}

            {isSubmitting ? (
              <Loading />
            ) : (
              <CustomButton
                type='submit'
                containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none`}
                title='Create Account'
              />
            )}
          </form>

          <p className='text-ascent-2 text-sm text-center'>
            Already have an account?{" "}
            <Link
              to='/login'
              className='text-[#065ad8] font-semibold ml-2 cursor-pointer'
            >
              Login
            </Link>
          </p>
        </div>
        {/* LEFT */}
        <div className='hidden w-1/2 h-full lg:flex flex-col items-center justify-center bg-[#0d1014]'>
          <div className='relative w-full flex items-center justify-center'>
             <img src="./images/Group_34.1112b5fbb5287de0fd42.png"
              alt='Bg'
              className='w-50 2xl:w-64 h-50 2xl:h-64 object-cover'
            />

            <div className='absolute flex items-center gap-1 bg-white right-10 top-10 py-2 px-5 rounded-full'>
              <BsShare size={14} />
              <span className='text-xs font-medium'>Share</span>
            </div>

            <div className='absolute flex items-center gap-1 bg-white left-10 top-6 py-2 px-5 rounded-full'>
              <ImConnection />
              <span className='text-xs font-medium'>Connect</span>
            </div>

            <div className='absolute flex items-center gap-1 bg-white left-10 bottom-6 py-2 px-5 rounded-full'>
              <AiOutlineInteraction />
              <span className='text-xs font-medium'>Interact</span>
            </div>
          </div>

          <div className='mt-16 text-center'>
            <p className='text-white text-base'>
            Meets teams where they work!
            </p>
            <span className='text-sm text-white/80'>
            Link work to goals so everyone can see how their work contributes to company objectives and stay aligned to what’s important.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;