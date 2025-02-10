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
    wsRef.current = new WebSocket("https://bytecall-messaging-backend-service.onrender.com/");

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
      username: userProfile?.firstName || "Anonymous",
      content: messageInput,
      timestamp: new Date().toISOString(),
      senderId: userProfile?.id // Add sender ID to identify message ownership
    };

    wsRef.current.send(JSON.stringify(message));
    setMessageInput("");
  };

  // Group messages by user and consecutive messages
  const groupedMessages = messages.reduce((groups, message, index) => {
    const prevMessage = messages[index - 1];
    const isSameUser = prevMessage && prevMessage.username === message.username;
    const isWithinTimeWindow = prevMessage && 
      (new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime() < 300000); // 5 minutes

    if (isSameUser && isWithinTimeWindow) {
      groups[groups.length - 1].messages.push(message);
    } else {
      groups.push({
        username: message.username,
        messages: [message],
        senderId: message.senderId
      });
    }
    return groups;
  }, []);

  const isCurrentUser = (senderId) => {
    return senderId === userProfile?.id;
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
          <div className="flex items-center gap-3 bg-gray-700 py-2 px-3 rounded-full">
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
            <div className="flex flex-col space-y-6">
              {groupedMessages.map((group, groupIndex) => (
                <motion.div
                  key={groupIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${isCurrentUser(group.senderId) ? "justify-end" : "justify-start"}`}
                >
                  <div className="flex items-start max-w-[80%] space-x-2">
                    {!isCurrentUser(group.senderId) && (
                      <div className="flex-shrink-0">
                        <div className="relative w-8 h-8">
                          <img
                            src={NoProfile} // Use a different avatar for other users
                            alt={group.username}
                            className="absolute top-0 left-0 w-8 h-8 rounded-full object-cover border-2 border-gray-800"
                          />
                          {group.messages.length > 1 && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-[10px] text-white">
                              {group.messages.length}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="flex flex-col space-y-1">
                      <div className="font-semibold text-xs text-gray-400 mb-1">
                        {isCurrentUser(group.senderId) ? "You" : group.username}
                      </div>
                      {group.messages.map((message, messageIndex) => (
                        <div
                          key={messageIndex}
                          className={`break-words rounded-xl px-4 py-2 ${
                            isCurrentUser(group.senderId)
                              ? "bg-blue-600 text-white"
                              : "bg-gray-700 text-white"
                          } ${messageIndex === 0 ? "rounded-t-xl" : ""} ${
                            messageIndex === group.messages.length - 1 ? "rounded-b-xl" : ""
                          }`}
                        >
                          <div className="text-sm">{message.content}</div>
                          {messageIndex === group.messages.length - 1 && (
                            <div className="text-xs opacity-75 mt-1">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    {isCurrentUser(group.senderId) && (
                      <div className="flex-shrink-0">
                        <div className="relative w-8 h-8">
                          <img
                            src={userProfile?.profileUrl || NoProfile}
                            alt="You"
                            className="absolute top-0 left-0 w-8 h-8 rounded-full object-cover border-2 border-gray-800"
                          />
                          {group.messages.length > 1 && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-[10px] text-white">
                              {group.messages.length}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
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
            <Send className="" />
          </button>
        </form>
      </main>
    </div>
  );
}

export default ByteMessageMainComp;