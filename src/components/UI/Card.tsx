import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', hover = false }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`
      ${isDarkMode 
        ? 'bg-gray-800/40 border-gray-700' 
        : 'bg-white/40 border-gray-200'
      } 
      backdrop-blur-xl border rounded-xl p-6 glassmorphism
      ${hover ? 'hover:shadow-lg hover:scale-105 transition-all duration-200' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};

export default Card;