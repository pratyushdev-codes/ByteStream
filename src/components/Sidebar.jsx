import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import VideoChat from './VideoChat';
import { Toaster, toast } from 'react-hot-toast';
import { getUserInfo } from '../Utils';
import { NoProfile } from '../assets';
import { useSelector } from 'react-redux'; // Add Redux import

const Sidebar = ({ isOpen, toggleSidebar }) => { // Remove data prop
  const [showVideoChat, setShowVideoChat] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get user data from Redux store
  const { user: data } = useSelector((state) => state.user);

  // Fetch current user data
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        const user = await getUserInfo(data?.token);
        setUserProfile(user);
        setError(null);
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    if (data?.token) {
      fetchCurrentUser();
    }
  }, [data?.token]); // Add data?.token as dependency

  return (
    <div
      className={`fixed top-0 right-0 h-screen bg-[#222222] text-white transition-transform rounded-l-xl duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{ width: '26rem' }}
    >
      <Toaster />
      <div className="flex justify-end p-4">
        <button onClick={toggleSidebar} className="text-gray-300 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </div>

      {showVideoChat ? (
        <div className="p-4">
          <button
            onClick={() => setShowVideoChat(false)}
            className="mb-4 text-sm text-gray-300 hover:text-white flex items-center gap-2"
          >
            <X size={16} /> Close Video Chat
          </button>
          <div className="h-[calc(100vh-120px)] overflow-y-auto">
            <VideoChat />
          </div>
        </div>
      ) : (
        <nav className="mt-8">
          <div className="flex justify-between items-center p-4">
            <h1
              className="text-3xl font-semibold text-transparent"
              style={{
                background:
                  'linear-gradient(154deg, rgb(221, 230, 232), rgb(221, 230, 232), rgb(51, 152, 219))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ByteCall
            </h1>
          </div>
          <p className="text-gray-400 text-lg pl-4">Schedule Meets • Collaborate Work • Upload Data</p>
          <div className="flex items-center gap-4 p-6">
            <button
              onClick={() => {
                setShowVideoChat(true);
                toast.success('Joined ByteCall');
              }}
              className="text-base flex flex-row text-ascent-1 px-4 md:px-4 py-1 md:py-2 border border-[#666] rounded-full"
            >
              <i className="fa-solid fa-video py-1"></i>&nbsp; Start a call
            </button>
            <div className="flex items-center gap-3 bg-gray-700 py-2 px-4 rounded-full">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-gray-600 animate-pulse" />
              ) : error ? (
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img src={NoProfile} alt="Default Profile" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img 
                    src={userProfile?.profileUrl || NoProfile} 
                    alt={userProfile?.firstName || 'User'} // Use firstName as alt
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <span className="text-gray-300 font-medium">
                {loading ? 'Loading...' : error ? 'User' : (
                  // Show firstName if available, fallback to email
                  userProfile?.firstName || userProfile?.email
                )}
              </span>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
};

export default Sidebar;