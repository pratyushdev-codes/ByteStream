import React, { useState, useEffect, useRef } from "react";
import { Send, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getUserInfo } from "../Utils";
import { NoProfile } from "../assets";
import { useSelector } from "react-redux";

function ByteMessageMainComp({ isOpen, toggleSidebar, userId }) {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);
  const messagesEndRef = useRef(null);
  const { user: data } = useSelector((state) => state.user);

  // WebSocket connection
  useEffect(() => {
    wsRef.current = new WebSocket("ws://localhost:8000");

    wsRef.current.onopen = () => {
      setIsConnected(true);
    };

    wsRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]);
    };

    wsRef.current.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Fetch current user data
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        const user = await getUserInfo(data?.token);
        setUserProfile(user);
        setError(null);
        // console.log("Message user data", user);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    if (data?.token) {
      fetchCurrentUser();
    }
  }, [data?.token]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !wsRef.current) return;

    const message = {
      type: "message",
      username: userProfile?.firstName || "Anonymous", // Ensure firstName is used
      content: messageInput,
      timestamp: new Date().toISOString(),
    };

    wsRef.current.send(JSON.stringify(message));
    setMessageInput("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="shadow-lg p-4 border-b border-gray-700">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span
              className="text-3xl font-semibold text-transparent"
              style={{
                background: "linear-gradient(154deg, rgb(221, 230, 232), rgb(51, 152, 219))",
                WebkitBackgroundClip: "text",
              }}
            >
              ByteChat
            </span>
          
          </h1>
          <div className="flex items-center gap-1 bg-gray-700 py-2 px-3 rounded-full">
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
                  alt={userProfile?.email || "User"}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <span className="text-gray-300 font-medium">
              {loading ? "Loading..." : error ? "User" : userProfile?.email}
            </span>
            <span className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
          </div>
          <button
              onClick={toggleSidebar}
              className="text-gray-300 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          {error && (
            <div className="text-red-500 text-center p-4 bg-red-100 rounded-lg">
              {error}
            </div>
          )}
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex flex-col ${message.username === userProfile?.firstName ? "items-end" : "items-start"}`}
              >
                <div className="flex flex-row ">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img
                    src={userProfile?.profileUrl || NoProfile}
                    alt={userProfile?.email || "User"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  className={`max-w-[80%] break-words rounded-3xl p-3 shadow-md ${message.username === userProfile?.firstName
                      ? "bg-blue-600 text-white "
                      : "bg-transparent border border-gray-700 text-gray-200"
                    }`}
                >

                  <div className="font-semibold text-xs mb-1 text-gray-400">
                    {message.username === userProfile?.firstName ? "You" : message.username}
                  </div>
                  <div className="text-sm">{message.content}</div>
                  <div className="text-xs opacity-75 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className="flex gap-2 p-4">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            className="flex-1 p-4 bg-transparent border-b border-[#66666645] text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition duration-200 rounded-full"
            placeholder="Type your message..."
            disabled={!isConnected || loading || error}
          />
          <button
            type="submit"
            disabled={!isConnected || loading || error}
            className="bg-[#045AD8] text-white p-4 rounded-full transition duration-200 transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </main>
    </div>
  );
}

export default ByteMessageMainComp;
