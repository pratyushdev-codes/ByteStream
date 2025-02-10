import React from 'react';
import { Trash2 } from 'lucide-react';
import { AddNoteForm } from './AddNoteForm';
import { useDispatch, useSelector } from "react-redux";
import { NoteCard } from './NoteCard';
import { useNotes } from './hooks/useNotes';

function Quickpad() {
    const { theme } = useSelector((state) => state.theme);
    const {
        notes,
        addNote,
        deleteNote,
        updateNotePosition,
        togglePin,
        clearAllNotes
    } = useNotes();

    return (
        <div
        className={`p-8 w-full h-auto max-w-full rounded-lg bg-cover 
          ${theme === "dark" ? " bg-[#141618] text-white" : "bg-white text-black border border-gray-700 rounded-3xl"}`}
      >
      
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex justify-between items-center">
                <h1
  className="text-3xl font-semibold"
  style={
    theme === "light"
      ? { color: "black" } // Light Mode: Black Text
      : {
          background: "linear-gradient(154deg, rgb(221, 230, 232), rgb(51, 152, 219))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        } // Dark Mode: Gradient Text
  }
>
  Quick Pad
</h1>
<button
  onClick={clearAllNotes}
  className={`px-4 md:px-4 py-1 md:py-2 rounded-full flex items-center gap-2 transition-colors 
    ${theme === "light" ? "bg-transparent border border-gray-700 text-black" : "bg-[#222222] text-red-400"}`}
>
  <Trash2 size={20} />
  Clear All
</button>

                </div>
                <p className="text-gray-400 mt-2">
                    Drag notes to organize • Pin important ones • Press Enter to add
                </p>
            </div>

            <AddNoteForm onAdd={addNote} />

            {/* Notes Board */}
            <div className="relative w-full h-[calc(100vh-500px)]  rounded-xl overflow-hidden border border-gray-700 shadow-2xl">
                {notes
                    .sort((a, b) => (b.isPinned ? 1 : -1))
                    .map((note) => (
                        <NoteCard
                            key={note.id}
                            note={note}
                            onDelete={deleteNote}
                            onDrag={updateNotePosition}
                            onPin={togglePin}
                        />
                    ))}
            </div>
        </div>
    );
}

export default Quickpad;