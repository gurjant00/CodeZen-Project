import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, Calculator, FileText, Target, Zap } from 'lucide-react';
import AuthModal from './AuthModal';
import { useAuth } from './AuthContext';

interface LandingPageProps {
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { signInAsGuest } = useAuth();
  const [guestLoading, setGuestLoading] = useState(false);
  const handleGuestSignIn = async () => {
    setGuestLoading(true);
    try {
      await signInAsGuest();
    } catch (error) {
      console.error('Guest sign-in failed:', error);
    } finally {
      setGuestLoading(false);
    }
  };

  const features = [
    { icon: Target, title: 'Smart To-Do Lists', description: 'Organize tasks with ease' },
    { icon: Calendar, title: 'Class Timetable', description: 'Never miss a class again' },
    { icon: FileText, title: 'Quick Notes', description: 'Capture ideas instantly' },
    { icon: Calculator, title: 'CGPA Calculator', description: 'Track your academic progress' },
    { icon: BookOpen, title: 'Unit Converter', description: 'Convert units on the fly' },
    { icon: Zap, title: 'Motivational Quotes', description: 'Stay inspired daily' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-24 h-24 bg-gold rounded-full flex items-center justify-center mx-auto mb-8">
              <BookOpen className="w-12 h-12 text-black" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gold mb-6">
              Smart Student Companion
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto light-mode:text-gray-600">
              Your all-in-one student productivity hub. Organize tasks, track classes, 
              calculate grades, and stay motivated throughout your academic journey.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                onClick={() => setShowAuthModal(true)}
                className="btn-primary text-lg px-8 py-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
              
              <motion.button
                onClick={handleGuestSignIn}
                disabled={guestLoading}
                className="bg-gray-700 hover:bg-gray-600 text-white font-semibold text-lg px-8 py-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed light-mode:bg-gray-200 light-mode:hover:bg-gray-300 light-mode:text-gray-800"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {guestLoading ? 'Loading...' : 'Try as Guest'}
              </motion.button>
            </div>
            
            <p className="text-sm text-gray-500 mt-4 light-mode:text-gray-600">
              Guest mode: No account required • Data won't be saved
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-dark-card transition-colors duration-300 light-mode:bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center text-gold mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Everything You Need to Excel
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="card text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-gold mb-2">{feature.title}</h3>
                <p className="text-gray-400 light-mode:text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};

export default LandingPage;
