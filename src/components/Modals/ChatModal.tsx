import React, { useState, useRef, useEffect } from 'react';
import { X, Send, User } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface Message {
  id: string;
  sender: 'psychologist' | 'user';
  content: string;
  timestamp: string;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  requestId: string;
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, userName, requestId }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'user',
      content: 'Hi Dr. Smith, I would like to schedule a session to discuss my anxiety issues.',
      timestamp: '2024-01-15 10:30 AM'
    },
    {
      id: '2',
      sender: 'psychologist',
      content: 'Hello! I\'d be happy to help you with that. Can you tell me a bit more about what specific aspects of anxiety you\'d like to work on?',
      timestamp: '2024-01-15 10:32 AM'
    },
    {
      id: '3',
      sender: 'user',
      content: 'I\'ve been having trouble with work-related stress and it\'s affecting my sleep and daily routine. I\'m available between 1-5 PM on the 20th if that works for you.',
      timestamp: '2024-01-15 10:35 AM'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        sender: 'psychologist',
        content: newMessage.trim(),
        timestamp: new Date().toLocaleString()
      };
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Simulate user typing response
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const userResponse: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'user',
          content: 'Thank you for your response. That sounds helpful.',
          timestamp: new Date().toLocaleString()
        };
        setMessages(prev => [...prev, userResponse]);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`
        w-full max-w-2xl h-[600px] rounded-2xl border flex flex-col
        ${isDarkMode 
          ? 'bg-gray-800/90 border-gray-700' 
          : 'bg-white/90 border-gray-200'
        } 
        backdrop-blur-xl glassmorphism animate-fade-in
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {userName.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {userName}
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Booking Request: {requestId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'psychologist' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md ${
                message.sender === 'psychologist' ? 'order-2' : 'order-1'
              }`}>
                <div className={`
                  px-4 py-2 rounded-2xl
                  ${message.sender === 'psychologist'
                    ? (isDarkMode 
                        ? 'bg-gray-600 text-white' 
                        : 'bg-gray-800 text-white'
                      )
                    : (isDarkMode 
                        ? 'bg-gray-700 text-gray-200' 
                        : 'bg-gray-100 text-gray-900'
                      )
                  }
                `}>
                  <p className="text-sm">{message.content}</p>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 px-2">
                  {message.timestamp}
                </p>
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.sender === 'psychologist' ? 'order-1 ml-2' : 'order-2 mr-2'
              }`}>
                {message.sender === 'psychologist' ? (
                  <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">DR</span>
                  </div>
                ) : (
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-xs lg:max-w-md">
                <div className={`
                  px-4 py-2 rounded-2xl
                  ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}
                `}>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className={`
                flex-1 px-4 py-2 rounded-lg border resize-none
                ${isDarkMode 
                  ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500'
                }
                focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
              `}
              rows={2}
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className={`
                px-4 py-2 rounded-lg transition-all duration-200
                ${newMessage.trim()
                  ? (isDarkMode 
                      ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                      : 'bg-gray-800 hover:bg-gray-700 text-white'
                    )
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;