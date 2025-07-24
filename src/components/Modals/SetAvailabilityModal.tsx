import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Save, AlertCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface WorkingHours {
  [key: string]: {
    isWorking: boolean;
    startTime: string;
    endTime: string;
    isHoliday: boolean;
  };
}

interface SetAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (weekData: any) => void;
  existingWeek?: any;
}

const SetAvailabilityModal: React.FC<SetAvailabilityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingWeek
}) => {
  const [selectedWeekStart, setSelectedWeekStart] = useState('');
  const [defaultStartTime, setDefaultStartTime] = useState('09:00');
  const [defaultEndTime, setDefaultEndTime] = useState('17:00');
  const [workingHours, setWorkingHours] = useState<WorkingHours>({
    monday: { isWorking: true, startTime: '09:00', endTime: '17:00', isHoliday: false },
    tuesday: { isWorking: true, startTime: '09:00', endTime: '17:00', isHoliday: false },
    wednesday: { isWorking: true, startTime: '09:00', endTime: '17:00', isHoliday: false },
    thursday: { isWorking: true, startTime: '09:00', endTime: '17:00', isHoliday: false },
    friday: { isWorking: true, startTime: '09:00', endTime: '17:00', isHoliday: false },
    saturday: { isWorking: false, startTime: '', endTime: '', isHoliday: false },
    sunday: { isWorking: false, startTime: '', endTime: '', isHoliday: false }
  });
  const { isDarkMode } = useTheme();

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    if (existingWeek) {
      setSelectedWeekStart(existingWeek.weekStart);
      setWorkingHours(existingWeek.workingHours);
    }
  }, [existingWeek]);

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(timeString);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  const getWeekEndDate = (startDate: string) => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return end.toISOString().split('T')[0];
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const applyDefaultHours = () => {
    const updatedHours = { ...workingHours };
    Object.keys(updatedHours).forEach(day => {
      if (updatedHours[day].isWorking && !updatedHours[day].isHoliday) {
        updatedHours[day].startTime = defaultStartTime;
        updatedHours[day].endTime = defaultEndTime;
      }
    });
    setWorkingHours(updatedHours);
  };

  const toggleWorkingDay = (day: string) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        isWorking: !prev[day].isWorking,
        startTime: !prev[day].isWorking ? defaultStartTime : '',
        endTime: !prev[day].isWorking ? defaultEndTime : ''
      }
    }));
  };

  const toggleHoliday = (day: string) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        isHoliday: !prev[day].isHoliday,
        isWorking: prev[day].isHoliday ? true : false
      }
    }));
  };

  const updateDayTime = (day: string, field: 'startTime' | 'endTime', value: string) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    if (!selectedWeekStart) {
      alert('Please select a week start date');
      return;
    }

    const weekData = {
      weekStart: selectedWeekStart,
      weekEnd: getWeekEndDate(selectedWeekStart),
      workingHours
    };

    onSave(weekData);
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`
        w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border
        ${isDarkMode 
          ? 'bg-gray-800/90 border-gray-700' 
          : 'bg-white/90 border-gray-200'
        } 
        backdrop-blur-xl glassmorphism animate-fade-in
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {existingWeek ? 'Edit Weekly Availability' : 'Set Weekly Availability'}
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
          {/* Week Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Week Start Date
              </label>
              <input
                type="date"
                value={selectedWeekStart}
                onChange={(e) => setSelectedWeekStart(e.target.value)}
                min={getMinDate()}
                className={`
                  w-full px-3 py-2 rounded-lg border 
                  ${isDarkMode 
                    ? 'bg-gray-700/50 border-gray-600 text-white' 
                    : 'bg-white/50 border-gray-300 text-gray-900'
                  }
                  focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
                `}
              />
            </div>
            {selectedWeekStart && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Week End Date
                </label>
                <input
                  type="date"
                  value={getWeekEndDate(selectedWeekStart)}
                  disabled
                  className={`
                    w-full px-3 py-2 rounded-lg border 
                    ${isDarkMode 
                      ? 'bg-gray-700/30 border-gray-600 text-gray-400' 
                      : 'bg-gray-100 border-gray-300 text-gray-600'
                    }
                  `}
                />
              </div>
            )}
          </div>

          {/* Default Hours */}
          <div className={`
            p-4 rounded-lg 
            ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'} 
            border-l-4 border-blue-500
          `}>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Default Working Hours
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Time
                </label>
                <select
                  value={defaultStartTime}
                  onChange={(e) => setDefaultStartTime(e.target.value)}
                  className={`
                    w-full px-3 py-2 rounded-lg border 
                    ${isDarkMode 
                      ? 'bg-gray-700/50 border-gray-600 text-white' 
                      : 'bg-white/50 border-gray-300 text-gray-900'
                    }
                    focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
                  `}
                >
                  {timeOptions.map(time => (
                    <option key={time} value={time}>
                      {formatTime(time)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Time
                </label>
                <select
                  value={defaultEndTime}
                  onChange={(e) => setDefaultEndTime(e.target.value)}
                  className={`
                    w-full px-3 py-2 rounded-lg border 
                    ${isDarkMode 
                      ? 'bg-gray-700/50 border-gray-600 text-white' 
                      : 'bg-white/50 border-gray-300 text-gray-900'
                    }
                    focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
                  `}
                >
                  {timeOptions.map(time => (
                    <option key={time} value={time}>
                      {formatTime(time)}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={applyDefaultHours}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-all duration-200
                  ${isDarkMode 
                    ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                    : 'bg-gray-800 hover:bg-gray-700 text-white'
                  }
                `}
              >
                Apply to All Days
              </button>
            </div>
          </div>

          {/* Daily Schedule */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">
              Individual Day Settings
            </h4>
            <div className="space-y-3">
              {days.map((day, index) => (
                <div
                  key={day}
                  className={`
                    p-4 rounded-lg border
                    ${isDarkMode 
                      ? 'bg-gray-700/30 border-gray-600' 
                      : 'bg-gray-50 border-gray-200'
                    }
                  `}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {dayLabels[index]}
                      </span>
                      <div className="flex items-center space-x-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={workingHours[day].isWorking}
                            onChange={() => toggleWorkingDay(day)}
                            className="rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Working Day
                          </span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={workingHours[day].isHoliday}
                            onChange={() => toggleHoliday(day)}
                            className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                          />
                          <span className="text-sm text-red-600 dark:text-red-400">
                            Holiday
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {workingHours[day].isWorking && !workingHours[day].isHoliday && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Start Time
                        </label>
                        <select
                          value={workingHours[day].startTime}
                          onChange={(e) => updateDayTime(day, 'startTime', e.target.value)}
                          className={`
                            w-full px-3 py-2 rounded-lg border text-sm
                            ${isDarkMode 
                              ? 'bg-gray-700/50 border-gray-600 text-white' 
                              : 'bg-white/50 border-gray-300 text-gray-900'
                            }
                            focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
                          `}
                        >
                          {timeOptions.map(time => (
                            <option key={time} value={time}>
                              {formatTime(time)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          End Time
                        </label>
                        <select
                          value={workingHours[day].endTime}
                          onChange={(e) => updateDayTime(day, 'endTime', e.target.value)}
                          className={`
                            w-full px-3 py-2 rounded-lg border text-sm
                            ${isDarkMode 
                              ? 'bg-gray-700/50 border-gray-600 text-white' 
                              : 'bg-white/50 border-gray-300 text-gray-900'
                            }
                            focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
                          `}
                        >
                          {timeOptions.map(time => (
                            <option key={time} value={time}>
                              {formatTime(time)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {workingHours[day].isHoliday && (
                    <div className={`
                      p-2 rounded-lg flex items-center space-x-2
                      ${isDarkMode ? 'bg-red-900/20' : 'bg-red-50'}
                    `}>
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-red-600 dark:text-red-400">
                        Marked as Holiday
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
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
              onClick={handleSave}
              disabled={!selectedWeekStart}
              className={`
                flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center
                ${selectedWeekStart
                  ? (isDarkMode 
                      ? 'bg-gray-600 hover:bg-gray-500 text-white pulse-glow' 
                      : 'bg-gray-800 hover:bg-gray-700 text-white pulse-glow'
                    )
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              <Save className="w-4 h-4 mr-1" />
              Save Availability
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetAvailabilityModal;