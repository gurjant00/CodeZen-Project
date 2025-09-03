import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, Save, X } from 'lucide-react';
import { Note } from '../App';

interface QuickNotesProps {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
}

const QuickNotes: React.FC<QuickNotesProps> = ({ notes, setNotes }) => {
  const [newNote, setNewNote] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const addNote = () => {
    if (newNote.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        content: newNote.trim(),
        createdAt: new Date(),
      };
      setNotes([...notes, note]);
      setNewNote('');
    }
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  const saveEdit = () => {
    if (editContent.trim() && editingId) {
      setNotes(notes.map(note => 
        note.id === editingId 
          ? { ...note, content: editContent.trim() }
          : note
      ));
      setEditingId(null);
      setEditContent('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addNote();
    }
  };

  const colors = [
    'bg-yellow-400/20 border-yellow-500/30',
    'bg-blue-400/20 border-blue-500/30',
    'bg-green-400/20 border-green-500/30',
    'bg-purple-400/20 border-purple-500/30',
    'bg-pink-400/20 border-pink-500/30',
    'bg-orange-400/20 border-orange-500/30',
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gold flex items-center">
            <span className="mr-3">📝</span>
            Quick Notes
          </h2>
          <div className="flex gap-3">
            <div className="flex gap-2">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Write a quick note..."
                className="input-field resize-none w-64 h-20"
              />
              <button
                onClick={addNote}
                className="btn-primary self-end"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {notes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`card border-2 ${colors[index % colors.length]} relative group`}
                whileHover={{ y: -5 }}
              >
                {editingId === note.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="input-field resize-none w-full h-32"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={saveEdit}
                        className="btn-primary flex items-center space-x-1"
                      >
                        <Save className="w-3 h-3" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="btn-secondary flex items-center space-x-1"
                      >
                        <X className="w-3 h-3" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-3">
                      <p className="text-sm text-gray-400">
                        {note.createdAt.toLocaleDateString()}
                      </p>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEdit(note)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-white whitespace-pre-wrap break-words">
                      {note.content}
                    </p>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {notes.length === 0 && (
          <motion.div
            className="text-center py-12 text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>No notes yet. Write your first note above!</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default QuickNotes;
