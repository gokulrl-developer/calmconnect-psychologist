import React from 'react';
import { Moon, Sun, Bell } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const TopBar: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className={`h-16 ${
      isDarkMode 
        ? 'bg-gray-900/80 backdrop-blur-xl border-gray-700' 
        : 'bg-white/80 backdrop-blur-xl border-gray-200'
    } border-b glassmorphism flex items-center justify-between px-6`}>
      
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Psychologist Dashboard
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <Bell size={20} className="text-gray-600 dark:text-gray-400" />
        </button>
        
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105"
        >
          {isDarkMode ? (
            <Sun size={20} className="text-yellow-400" />
          ) : (
            <Moon size={20} className="text-gray-600" />
          )}
        </button>

        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
          <span className="text-white text-sm font-medium">DR</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;