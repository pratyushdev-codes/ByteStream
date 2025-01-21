import { useState, useEffect } from 'react';

const STORAGE_KEY = 'notes';

const colors = [
  'bg-blue-500/20',
  'bg-purple-500/20',
  'bg-green-500/20',
  'bg-orange-500/20',
  'bg-pink-500/20'
];

export function useNotes() {
  // Changed from useState([]) to useState initializer function
  const [notes, setNotes] = useState(() => {
    try {
      const savedNotes = localStorage.getItem(STORAGE_KEY);
      const parsedNotes = savedNotes ? JSON.parse(savedNotes) : [];
      console.log("Initial notes loaded:", parsedNotes);
      return parsedNotes;
    } catch (error) {
      console.error("Error loading initial notes:", error);
      return [];
    }
  });

  // Save notes to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      console.log("Notes saved successfully:", notes);
    } catch (error) {
      console.error("Error saving notes:", error);
    }
  }, [notes]);

  const addNote = (content, category) => {
    const newNote = {
      id: Date.now().toString(),
      content,
      position: { x: Math.random() * 100, y: Math.random() * 100 },
      color: colors[Math.floor(Math.random() * colors.length)],
      createdAt: new Date().toISOString(),
      isPinned: false,
      category,
      progress: category === 'tasks' ? 0 : undefined
    };
    // Changed to use functional update
    setNotes(prevNotes => [...prevNotes, newNote]);
  };

  const deleteNote = (id) => {
    // Changed to use functional update
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
  };

  const updateNotePosition = (id, position) => {
    // Changed to use functional update
    setNotes(prevNotes => prevNotes.map(note =>
      note.id === id ? { ...note, position } : note
    ));
  };

  const togglePin = (id) => {
    // Changed to use functional update
    setNotes(prevNotes => prevNotes.map(note =>
      note.id === id ? { ...note, isPinned: !note.isPinned } : note
    ));
  };

  const clearAllNotes = () => {
    setNotes([]);
  };

  return {
    notes,
    addNote,
    deleteNote,
    updateNotePosition,
    togglePin,
    clearAllNotes
  };
}