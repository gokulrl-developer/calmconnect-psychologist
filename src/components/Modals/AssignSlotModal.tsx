import React, { useState } from 'react';
import { X, Calendar, Clock, Save, User } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface BookingRequest {
  id: string;
  userName: string;
  concernSummary: string;
  proposedDate: string;
  proposedTimeStart: string;
  proposedTimeEnd: string;
}

interface AssignSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: BookingRequest;
  onAssign: (startTime: string, endTime: string, duration: number) => void;
}

const AssignSlotModal: React.FC<AssignSlotModalProps> = ({ 
  isOpen, 
  onClose, 
  request, 
  onAssign 
}) => {
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');
  const { isDarkMode } = useTheme();

  // Generate time slots within the proposed window
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = parseInt(request.proposedTimeStart.split(':')[0]);
    const startMinute = parseInt(request.proposedTimeStart.split(':')[1]);
    const endHour = parseInt(request.proposedTimeEnd.split(':')[0]);
    const endMinute = parseInt(request.proposedTimeEnd.split(':')[1]);
    
    let currentHour = startHour;
    let currentMinute = startMinute;
    
    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
      const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      slots.push(timeString);
      
      currentMinute += 15; // 15-minute intervals
      if (currentMinute >= 60) {
        currentMinute = 0;
        currentHour++;
      }
    }
    
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const calculateDuration = () => {
    if (!selectedStartTime || !selectedEndTime) return 0;
    
    const start = new Date(`2000-01-01T${selectedStartTime}:00`);
    const end = new Date(`2000-01-01T${selectedEndTime}:00`);
    const diffMs = end.getTime() - start.getTime();
    return Math.round(diffMs / (1000 * 60)); // Duration in minutes
  };

  const duration = calculateDuration();

  const handleAssign = () => {
    if (selectedStartTime && selectedEndTime && duration > 0) {
      onAssign(selectedStartTime, selectedEndTime, duration);
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isValidTimeRange = () => {
    if (!selectedStartTime || !selectedEndTime) return false;
    return selectedStartTime < selectedEndTime;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`
        w-full max-w-lg rounded-2xl border
        ${isDarkMode 
          ? 'bg-gray-800/90 border-gray-700' 
          : 'bg-white/90 border-gray-200'
        } 
        backdrop-blur-xl glassmorphism animate-fade-in
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Assign Session Slot
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Info */}
          <div className={`
            p-4 rounded-lg 
            ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'} 
            border-l-4 border-blue-500
          `}>
            <div className="flex items-center space-x-3 mb-2">
              <User className="h-5 w-5 text-blue-500" />
              <h4 className="font-medium text-gray-900 dark:text-white">
                {request.userName}
              </h4>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              {request.concernSummary}
            </p>
            <div className="space-y-1 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">
                  {formatDate(request.proposedDate)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">
                  Available: {formatTime(request.proposedTimeStart)} - {formatTime(request.proposedTimeEnd)}
                </span>
              </div>
            </div>
          </div>

          {/* Time Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Time
              </label>
              <select
                value={selectedStartTime}
                onChange={(e) => setSelectedStartTime(e.target.value)}
                className={`
                  w-full px-3 py-2 rounded-lg border 
                  ${isDarkMode 
                    ? 'bg-gray-700/50 border-gray-600 text-white' 
                    : 'bg-white/50 border-gray-300 text-gray-900'
                  }
                  focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
                `}
              >
                <option value="">Select start time</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {formatTime(time)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Time
              </label>
              <select
                value={selectedEndTime}
                onChange={(e) => setSelectedEndTime(e.target.value)}
                className={`
                  w-full px-3 py-2 rounded-lg border 
                  ${isDarkMode 
                    ? 'bg-gray-700/50 border-gray-600 text-white' 
                    : 'bg-white/50 border-gray-300 text-gray-900'
                  }
                  focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
                `}
                disabled={!selectedStartTime}
              >
                <option value="">Select end time</option>
                {timeSlots
                  .filter(time => time > selectedStartTime)
                  .map((time) => (
                    <option key={time} value={time}>
                      {formatTime(time)}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Duration Display */}
          {duration > 0 && (
            <div className={`
              p-3 rounded-lg 
              ${isDarkMode ? 'bg-green-900/20' : 'bg-green-50'} 
              border-l-4 border-green-500
            `}>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  Session Duration: {duration} minutes
                </span>
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                {formatTime(selectedStartTime)} - {formatTime(selectedEndTime)}
              </p>
            </div>
          )}

          {/* Validation Message */}
          {selectedStartTime && selectedEndTime && !isValidTimeRange() && (
            <div className={`
              p-3 rounded-lg 
              ${isDarkMode ? 'bg-red-900/20' : 'bg-red-50'} 
              border-l-4 border-red-500
            `}>
              <p className="text-sm text-red-700 dark:text-red-300">
                End time must be after start time
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              className={`
                flex-1 px-4 py-2 rounded-lg border font-medium transition-all duration-200
                ${isDarkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={!isValidTimeRange() || duration === 0}
              className={`
                flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center
                ${isValidTimeRange() && duration > 0
                  ? (isDarkMode 
                      ? 'bg-gray-600 hover:bg-gray-500 text-white pulse-glow' 
                      : 'bg-gray-800 hover:bg-gray-700 text-white pulse-glow'
                    )
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              <Save className="w-4 h-4 mr-1" />
              Assign Slot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignSlotModal;