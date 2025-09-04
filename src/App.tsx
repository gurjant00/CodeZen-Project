import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './components/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export interface ClassSchedule {
  id: string;
  day: string;
  time: string;
  subject: string;
  room: string;
}

export interface Note {
  id: string;
  content: string;
  createdAt: Date;
}

export interface Subject {
  id: string;
  name: string;
  credits: number;
  grade: string;
}

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [schedule, setSchedule] = useState<ClassSchedule[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  // Load data from localStorage on app start
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    const savedSchedule = localStorage.getItem('schedule');
    const savedNotes = localStorage.getItem('notes');
    const savedSubjects = localStorage.getItem('subjects');
    const savedTheme = localStorage.getItem('theme');

    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedSchedule) setSchedule(JSON.parse(savedSchedule));
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    if (savedSubjects) setSubjects(JSON.parse(savedSubjects));
    if (savedTheme) setIsDarkMode(savedTheme === 'dark');
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('schedule', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    // Apply theme class to body
    if (isDarkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [isDarkMode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gold text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-dark-bg text-white' : 'bg-gray-100 text-gray-900'
    }`}>
      <Navbar 
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
      
      <AnimatePresence mode="wait">
        {!user ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LandingPage onLogin={() => {}} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Dashboard 
              tasks={tasks}
              setTasks={setTasks}
              schedule={schedule}
              setSchedule={setSchedule}
              notes={notes}
              setNotes={setNotes}
              subjects={subjects}
              setSubjects={setSubjects}
              isDarkMode={isDarkMode}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
