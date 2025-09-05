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

  // Load user-specific data when user changes
  useEffect(() => {
    if (user) {
      // Load user-specific data
      const userDataKey = user.isGuest ? 'guest_data' : `user_${user.id}_data`;
      let savedUserData = localStorage.getItem(userDataKey);
      
      // Migration: Move legacy global data to demo user if it exists
      if (!savedUserData && user.id === 'demo_001') {
        const legacyTasks = localStorage.getItem('tasks');
        const legacySchedule = localStorage.getItem('schedule');
        const legacyNotes = localStorage.getItem('notes');
        const legacySubjects = localStorage.getItem('subjects');
        
        if (legacyTasks || legacySchedule || legacyNotes || legacySubjects) {
          const legacyData = {
            tasks: legacyTasks ? JSON.parse(legacyTasks) : [],
            schedule: legacySchedule ? JSON.parse(legacySchedule) : [],
            notes: legacyNotes ? JSON.parse(legacyNotes) : [],
            subjects: legacySubjects ? JSON.parse(legacySubjects) : []
          };
          localStorage.setItem(userDataKey, JSON.stringify(legacyData));
          savedUserData = JSON.stringify(legacyData);
          
          // Clean up old global data
          localStorage.removeItem('tasks');
          localStorage.removeItem('schedule');
          localStorage.removeItem('notes');
          localStorage.removeItem('subjects');
        }
      }
      
      if (savedUserData && !user.isGuest) {
        const userData = JSON.parse(savedUserData);
        
        // Convert date strings back to Date objects for tasks
        const tasks = (userData.tasks || []).map((task: any) => ({
          ...task,
          createdAt: task.createdAt ? new Date(task.createdAt) : new Date()
        }));
        
        // Convert date strings back to Date objects for notes
        const notes = (userData.notes || []).map((note: any) => ({
          ...note,
          createdAt: note.createdAt ? new Date(note.createdAt) : new Date()
        }));
        
        setTasks(tasks);
        setSchedule(userData.schedule || []);
        setNotes(notes);
        setSubjects(userData.subjects || []);
      } else {
        // Reset to empty state for new users or guests
        setTasks([]);
        setSchedule([]);
        setNotes([]);
        setSubjects([]);
      }
    }
    
    // Load theme (global setting)
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) setIsDarkMode(savedTheme === 'dark');
  }, [user]);

  // Save user-specific data to localStorage whenever it changes
  useEffect(() => {
    if (user && !user.isGuest) {
      const userDataKey = `user_${user.id}_data`;
      const userData = {
        tasks,
        schedule,
        notes,
        subjects
      };
      localStorage.setItem(userDataKey, JSON.stringify(userData));
    }
  }, [user, tasks, schedule, notes, subjects]);

  // Clear data when user logs out
  useEffect(() => {
    if (!user) {
      setTasks([]);
      setSchedule([]);
      setNotes([]);
      setSubjects([]);
    }
  }, [user]);

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
