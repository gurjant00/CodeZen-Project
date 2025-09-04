import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, LogOut, BookOpen, User } from 'lucide-react';
import { useAuth } from './AuthContext';

interface NavbarProps {
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isDarkMode, setIsDarkMode }) => {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-dark-card border-b border-dark-border px-6 py-4 transition-colors duration-300 light-mode:bg-white light-mode:border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.div 
          className="flex items-center space-x-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gold">Smart Student Companion</h1>
            <p className="text-sm text-gray-400 light-mode:text-gray-600">Your productivity hub</p>
          </div>
        </motion.div>

        <motion.div 
          className="flex items-center space-x-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg bg-dark-card border border-dark-border hover:border-gold transition-colors duration-200 light-mode:bg-gray-100 light-mode:border-gray-300"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-gold" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {user && (
            <>
              <div className="flex items-center space-x-2 text-gray-300 light-mode:text-gray-700">
                <User className="w-4 h-4" />
                <span className="text-sm">{user.name || user.email}</span>
              </div>
              <button
                onClick={logout}
                className="btn-secondary flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          )}
        </motion.div>
      </div>
    </nav>
  );
};

export default Navbar;
