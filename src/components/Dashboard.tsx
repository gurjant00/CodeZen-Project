import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TodoList from './TodoList';
import Timetable from './Timetable';
import QuickNotes from './QuickNotes';
import ToolsSection from './ToolsSection';
import StudyBuddy from './StudyBuddy';
import { Task, ClassSchedule, Note, Subject } from '../App';

interface DashboardProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  schedule: ClassSchedule[];
  setSchedule: (schedule: ClassSchedule[]) => void;
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  subjects: Subject[];
  setSubjects: (subjects: Subject[]) => void;
  isDarkMode: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({
  tasks,
  setTasks,
  schedule,
  setSchedule,
  notes,
  setNotes,
  subjects,
  setSubjects,
  isDarkMode
}) => {
  const [activeTab, setActiveTab] = useState('buddy');

  const tabs = [
    { id: 'buddy', name: 'Study Buddy', icon: '✨' },
    { id: 'todo', name: 'To-Do List', icon: '📝' },
    { id: 'timetable', name: 'Timetable', icon: '📅' },
    { id: 'notes', name: 'Quick Notes', icon: '📗' },
    { id: 'tools', name: 'Tools', icon: '🛠️' },
  ];

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gold mb-2">Welcome Back!</h1>
          <p className="text-gray-400 text-lg light-mode:text-gray-600">Ready to boost your productivity?</p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gold text-black'
                  : 'bg-dark-card text-gray-300 hover:bg-dark-border light-mode:bg-gray-100 light-mode:text-gray-700 light-mode:hover:bg-gray-200'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </motion.div>

        {/* Content Area */}
        <motion.div
          className="min-h-[600px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {activeTab === 'buddy' && (
            <StudyBuddy 
              tasksCount={tasks.filter(task => task.completed).length}
              notesCount={notes.length}
              subjectsCount={subjects.length}
              scheduleCount={schedule.length}
            />
          )}
          {activeTab === 'todo' && (
            <TodoList tasks={tasks} setTasks={setTasks} />
          )}
          {activeTab === 'timetable' && (
            <Timetable schedule={schedule} setSchedule={setSchedule} />
          )}
          {activeTab === 'notes' && (
            <QuickNotes notes={notes} setNotes={setNotes} />
          )}
          {activeTab === 'tools' && (
            <ToolsSection 
              subjects={subjects} 
              setSubjects={setSubjects}
              isDarkMode={isDarkMode}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
