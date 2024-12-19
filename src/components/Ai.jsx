import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import { Send, Loader2 } from "lucide-react";

function Ai() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function generateAnswer(e) {
    e.preventDefault();            
    setLoading(true);
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.REACT_APP_INTELSYAIKEY}`,
        {
          contents: [{ parts: [{ text: question }] }],
        }
      );
      setAnswer(response.data.candidates[0].content.parts[0].text);
      toast.success("Intelsy AI : Answer Generated")
    } catch (error) {
      console.log(error);
      setAnswer("Sorry, something went wrong. Please try again!");
    }
    setLoading(false);
  }

  return (

      <div className="w-full max-w-4xl  bg-gray-800 rounded-2xl shadow-2xl p-6 space-y-6">
         <h1 className="text-3xl font-semibold text-transparent" style={{
            background: 'linear-gradient(154deg, rgb(221, 230, 232), rgb(221, 230, 232), rgb(51, 152, 219))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            AI Assistant
          </h1>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            AI Assistant
          </h1>
        </div>

        <form onSubmit={generateAnswer} className="space-y-4">
          <div className="relative">
            <textarea
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything..."
              className="w-full h-32 bg-gray-700 text-gray-100 rounded-xl p-4 shadow-inner 
                       border border-gray-600 focus:border-blue-500 focus:ring-2 
                       focus:ring-blue-500 focus:outline-none resize-none
                       placeholder-gray-400 transition duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 
                     hover:from-blue-600 hover:to-purple-700
                     text-white font-semibold py-3 px-6 rounded-xl
                     flex items-center justify-center space-x-2
                     transform transition duration-200 hover:scale-[1.02]
                     disabled:opacity-50 disabled:cursor-not-allowed
                     shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Generate Answer</span>
              </>
            )}
          </button>
        </form>

        {answer && (
          <div className="mt-6 bg-gray-700 rounded-xl p-6 shadow-inner">
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown className="text-gray-200 leading-relaxed">
                {answer}
              </ReactMarkdown>
            </div>
          </div>
        )}
  
    </div>
  );
}

export default Ai;