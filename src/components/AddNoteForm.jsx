import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export function AddNoteForm({ onAdd }) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('tasks');

  const handleSubmit = () => {
    if (content.trim()) {
      onAdd(content, category);
      setContent('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto mb-4">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          {['work', 'Tech', 'ideas', 'tasks', 'other'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-[#00000019]'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex gap-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
            placeholder="     Write your note here..."
            className="flex-1 bg-white/5 border border-[#00000019] rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500 min-h-[15px] resize-none"
          />
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-[#27282A] px-4  rounded-full transition-colors text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#D9D9D9"><path d="M200-120v-640q0-33 23.5-56.5T280-840h240v80H280v518l200-86 200 86v-278h80v400L480-240 200-120Zm80-640h240-240Zm400 160v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z"/></svg>
            Add Note
          </button>
        </div>
      </div>
    </div>
  );
}
