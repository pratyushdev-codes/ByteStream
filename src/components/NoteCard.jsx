import React from 'react';
import { X, GripHorizontal, Pin, Clock, Users } from 'lucide-react';
import Draggable from 'react-draggable';

export function NoteCard({ note, onDelete, onDrag, onPin }) {
  return (
    <Draggable
      position={note.position}
      onStop={(_, data) => onDrag(note.id, { x: data.x, y: data.y })}
      handle=".handle"
    >
      <div className="absolute w-72 rounded-2xl bg-white/5 backdrop-blur-lg p-5 shadow-2xl border ">
        {/* Category Badge */}
        <div className="flex items-center gap-2 mb-3 rounded-full">
          <span className={`px-3 py-1 rounded-full text-xs bg-white font-medium ${getCategoryColor(note.category)}`}>
            {note.category.charAt(0).toUpperCase() + note.category.slice(1)}
          </span>
          {note.progress !== undefined && (
            <span className="text-xs text-gray-400">{note.progress}/10</span>
          )}
        </div>

        {/* Content */}
        <p className="text-white text-sm font-medium mb-4 whitespace-pre-wrap break-words">
          {note.content}
        </p>

        {/* Progress Bar */}
        {note.progress !== undefined && (
          <div className="w-full h-1 bg-gray-700 rounded-full mb-4">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${(note.progress / 10) * 100}%` }}
            />
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t ">
          <div className="flex items-center gap-2">
            <div className="handle cursor-move">
              <GripHorizontal size={16} className="text-gray-400 hover:text-white transition-colors" />
            </div>
            <button
              onClick={() => onPin(note.id)}
              className={`transition-colors ${note.isPinned ? 'text-yellow-400' : 'text-gray-400 hover:text-white'}`}
            >
              <Pin size={16} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            
            <button
              onClick={() => onDelete(note.id)}
              className="text-gray-400 hover:text-red-400 transition-colors ml-2"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Timestamp */}
        <div className="absolute bottom-2 right-2">
          <div className="flex items-center text-[10px] text-gray-400">
            <Clock size={10} className="mr-1" />
            <span>{new Date(note.createdAt).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </Draggable>
  );
}

function getCategoryColor(category) {
  const colors = {
    work: 'bg-blue-500/20 text-blue-400',
    personal: 'bg-purple-500/20 text-purple-400',
    ideas: 'bg-green-500/20 text-green-400',
    tasks: 'bg-orange-500/20 text-orange-400',
    other: 'bg-gray-500/20 text-gray-400'
  };
  return colors[category] || colors.other;
}
