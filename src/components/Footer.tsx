import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Github, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-card border-t border-dark-border py-8 mt-20 transition-colors duration-300 light-mode:bg-white light-mode:border-gray-200">
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
          
                     <p className="text-gray-400 text-sm mb-4 light-mode:text-gray-600">
            Smart Student Companion - Your all-in-one student productivity hub
          </p>
          
                     <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 light-mode:text-gray-600">
            <span>© 2025 Smart Student Companion</span>
            <span>•</span>
            <span>Made with React & Tailwind CSS</span>
            <span>•</span>
            <span>Powered by Framer Motion</span>
          </div>
        </motion.div>
          {/* Developer Info with Social Links */}
          <div className="flex flex-col items-center justify-center mt-6 space-y-4">
            <div className="text-sm text-pink-500 flex items-center">
              Made with <Heart className="w-4 h-4 mx-1 text-red-500 animate-pulse" /> by Gurjant Singh
            </div>
            
            {/* Social Media Icons */}
            <div className="flex items-center space-x-6">
              <motion.a
                href="https://github.com/gurjant00"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-2 px-4 py-2 rounded-lg bg-dark-bg border border-gray-600 hover:border-gold transition-all duration-300 light-mode:bg-gray-100 light-mode:border-gray-300 light-mode:hover:border-gold"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github className="w-5 h-5 text-gray-400 group-hover:text-gold transition-colors duration-300 light-mode:text-gray-600" />
                <span className="text-sm font-medium text-gray-300 group-hover:text-gold transition-colors duration-300 light-mode:text-gray-700">
                  GitHub
                </span>
              </motion.a>
              
              <motion.a
                href="https://www.instagram.com/gurjant_sandha_"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-2 px-4 py-2 rounded-lg bg-dark-bg border border-gray-600 hover:border-gold transition-all duration-300 light-mode:bg-gray-100 light-mode:border-gray-300 light-mode:hover:border-gold"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Instagram className="w-5 h-5 text-gray-400 group-hover:text-gold transition-colors duration-300 light-mode:text-gray-600" />
                <span className="text-sm font-medium text-gray-300 group-hover:text-gold transition-colors duration-300 light-mode:text-gray-700">
                  Instagram
                </span>
              </motion.a>
            </div>
            
            {/* Professional Tagline */}
            <div className="text-xs text-gray-500 text-center max-w-md light-mode:text-gray-600">
              Connect with me for collaboration, feedback, or just to say hi! 🚀
            </div>
          </div>
      </div>
    </footer>
  );
};

export default Footer;
