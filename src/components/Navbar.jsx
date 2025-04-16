import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Palette, ChevronDown, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  const themes = [
    { name: 'light', icon: <Sun size={16} /> },
    { name: 'dark', icon: <Moon size={16} /> },
    { name: 'cupcake', icon: <Palette size={16} /> },
    { name: 'bumblebee', icon: <Palette size={16} /> },
    { name: 'emerald', icon: <Palette size={16} /> },
    { name: 'corporate', icon: <Palette size={16} /> },
    { name: 'synthwave', icon: <Palette size={16} /> },
    { name: 'retro', icon: <Palette size={16} /> },
    { name: 'cyberpunk', icon: <Palette size={16} /> },
    { name: 'valentine', icon: <Palette size={16} /> },
    { name: 'halloween', icon: <Palette size={16} /> },
    { name: 'garden', icon: <Palette size={16} /> },
    { name: 'forest', icon: <Palette size={16} /> },
    { name: 'aqua', icon: <Palette size={16} /> },
    { name: 'lofi', icon: <Palette size={16} /> },
    { name: 'pastel', icon: <Palette size={16} /> },
    { name: 'fantasy', icon: <Palette size={16} /> },
    { name: 'wireframe', icon: <Palette size={16} /> },
    { name: 'black', icon: <Palette size={16} /> },
    { name: 'luxury', icon: <Palette size={16} /> },
    { name: 'dracula', icon: <Palette size={16} /> },
    { name: 'cmyk', icon: <Palette size={16} /> },
    { name: 'autumn', icon: <Palette size={16} /> },
    { name: 'business', icon: <Palette size={16} /> },
    { name: 'acid', icon: <Palette size={16} /> },
    { name: 'lemonade', icon: <Palette size={16} /> },
    { name: 'night', icon: <Palette size={16} /> },
    { name: 'coffee', icon: <Palette size={16} /> },
    { name: 'winter', icon: <Palette size={16} /> }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    setIsThemeOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-base-200/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="avatar placeholder"
            >
              <div className="bg-primary text-primary-content rounded-full w-12">
                <Bot size={24} />
              </div>
            </motion.div>
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              >
                AI Chat
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xs text-base-content/70"
              >
                Powered by AI
              </motion.p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsThemeOpen(!isThemeOpen)}
                className="btn btn-ghost gap-2"
              >
                <Palette size={20} />
                <span className="hidden sm:inline">Theme</span>
                <ChevronDown size={16} className={`transition-transform ${isThemeOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {isThemeOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-base-200 border border-base-300"
                  >
                    <div className="p-2 grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                      {themes.map((themeOption) => (
                        <motion.button
                          key={themeOption.name}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleThemeChange(themeOption.name)}
                          className={`btn btn-sm btn-ghost justify-start gap-2 ${
                            theme === themeOption.name ? 'bg-primary/20' : ''
                          }`}
                        >
                          {themeOption.icon}
                          <span className="capitalize">{themeOption.name}</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar; 