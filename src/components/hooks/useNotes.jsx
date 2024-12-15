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
  const [notes, setNotes] = useState([]);

  // Load notes from local storage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem(STORAGE_KEY);
    console.log("Loaded notes from localStorage:", savedNotes); // Log loaded data
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        console.log("Parsed notes:", parsedNotes); // Log parsed notes
        setNotes(parsedNotes);
      } catch (error) {
        console.error("Error parsing notes from localStorage", error);
      }
    }
  }, []);

  // Save notes to local storage whenever the notes state changes
  useEffect(() => {
    try {
      console.log("Saving notes to localStorage", notes); // Log notes being saved
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error("Error saving notes to localStorage", error);
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
    setNotes(prev => {
      const newNotes = [...prev, newNote];
      console.log("Updated notes:", newNotes); // Log after updating state
      return newNotes;
    });
  };

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const updateNotePosition = (id, position) => {
    setNotes(prev => prev.map(note =>
      note.id === id ? { ...note, position } : note
    ));
  };

  const togglePin = (id) => {
    setNotes(prev => prev.map(note =>
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
