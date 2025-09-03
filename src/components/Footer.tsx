import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-card border-t border-dark-border py-8 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-gold font-semibold">Built for</span>
            <span className="text-white font-bold text-lg">CodeZen Innovate Challenge</span>
            <Heart className="w-5 h-5 text-red-500 animate-pulse" />
          </div>
          
          <p className="text-gray-400 text-sm mb-4">
            Smart Student Companion - Your all-in-one student productivity hub
          </p>
          
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <span>© 2024 Smart Student Companion</span>
            <span>•</span>
            <span>Made with React & Tailwind CSS</span>
            <span>•</span>
            <span>Powered by Framer Motion</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
