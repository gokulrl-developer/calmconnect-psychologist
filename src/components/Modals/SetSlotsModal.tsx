import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Save, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface SetSlotsModalProps {
  isOpen: boolean;
  onClose: () => void;
  week: any;
  onSave: (slots: any) => void;
}

const SetSlotsModal: React.FC<SetSlotsModalProps> = ({
  isOpen,
  onClose,
  week,
  onSave
}) => {
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [slots, setSlots] = useState<any>({});
  const [savedDays, setSavedDays] = useState<Set<string>>(new Set());
  const { isDarkMode } = useTheme();

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Get working days only
  const workingDays = days.filter(day => 
    week.workingHours[day].isWorking && !week.workingHours[day].isHoliday
  );

  useEffect(() => {
    // Initialize slots for all working days
    const initialSlots: any = {};
    workingDays.forEach(day => {
      const daySlots = generateTimeSlots(
        week.workingHours[day].startTime,
        week.workingHours[day].endTime
      );
      initialSlots[day] = {};
      daySlots.forEach(slot => {
        initialSlots[day][slot] = true; // All slots available by default
      });
    });
    setSlots(initialSlots);

    // Load existing slots if available
    if (week.slots && Object.keys(week.slots).length > 0) {
      setSlots(week.slots);
      setSavedDays(new Set(Object.keys(week.slots)));
    }
  }, [week]);

  const generateTimeSlots = (startTime: string, endTime: string) => {
    const slots = [];
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    
    let current = new Date(start);
    while (current < end) {
      const next = new Date(current);
      next.setHours(current.getHours() + 1); // 1-hour slots
      
      if (next <= end) {
        const startStr = current.toTimeString().slice(0, 5);
        const endStr = next.toTimeString().slice(0, 5);
        slots.push(`${startStr}-${endStr}`);
      }
      
      current = next;
    }
    
    return slots;
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatTimeSlot = (slot: string) => {
    const [start, end] = slot.split('-');
    return `${formatTime(start)} - ${formatTime(end)}`;
  };

  const getCurrentDay = () => {
    return workingDays[currentDayIndex];
  };

  const getCurrentDayLabel = () => {
    const day = getCurrentDay();
    return dayLabels[days.indexOf(day)];
  };

  const toggleSlot = (slot: string) => {
    const currentDay = getCurrentDay();
    setSlots((prev: any) => ({
      ...prev,
      [currentDay]: {
        ...prev[currentDay],
        [slot]: !prev[currentDay][slot]
      }
    }));
  };

  const confirmDay = () => {
    const currentDay = getCurrentDay();
    setSavedDays(prev => new Set([...prev, currentDay]));
    
    if (currentDayIndex < workingDays.length - 1) {
      setCurrentDayIndex(prev => prev + 1);
    }
  };

  const goToPreviousDay = () => {
    if (currentDayIndex > 0) {
      setCurrentDayIndex(prev => prev - 1);
    }
  };

  const goToNextDay = () => {
    if (currentDayIndex < workingDays.length - 1) {
      setCurrentDayIndex(prev => prev + 1);
    }
  };

  const handleSave = () => {
    onSave(slots);
  };

  const getCurrentDaySlots = () => {
    const currentDay = getCurrentDay();
    if (!slots[currentDay]) return [];
    
    return generateTimeSlots(
      week.workingHours[currentDay].startTime,
      week.workingHours[currentDay].endTime
    );
  };

  const getAvailableSlotCount = (day: string) => {
    if (!slots[day]) return 0;
    return Object.values(slots[day]).filter(available => available).length;
  };

  const getTotalSlotCount = (day: string) => {
    return generateTimeSlots(
      week.workingHours[day].startTime,
      week.workingHours[day].endTime
    ).length;
  };

  if (!isOpen || workingDays.length === 0) return null;

  const currentDay = getCurrentDay();
  const currentDaySlots = getCurrentDaySlots();
  const isCurrentDaySaved = savedDays.has(currentDay);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`
        w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border
        ${isDarkMode 
          ? 'bg-gray-800/90 border-gray-700' 
          : 'bg-white/90 border-gray-200'
        } 
        backdrop-blur-xl glassmorphism animate-fade-in
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Set Time Slots
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Week: {new Date(week.weekStart).toLocaleDateString()} - {new Date(week.weekEnd).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Progress: {savedDays.size} of {workingDays.length} days configured
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {Math.round((savedDays.size / workingDays.length) * 100)}% complete
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gray-600 dark:bg-gray-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(savedDays.size / workingDays.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Day Navigation */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <button
              onClick={goToPreviousDay}
              disabled={currentDayIndex === 0}
              className={`
                p-2 rounded-lg transition-all duration-200 flex items-center space-x-2
                ${currentDayIndex === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">Previous</span>
            </button>

            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                {getCurrentDayLabel()}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {week.workingHours[currentDay].startTime} - {week.workingHours[currentDay].endTime}
              </p>
              {isCurrentDaySaved && (
                <div className="flex items-center justify-center space-x-1 mt-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400">Saved</span>
                </div>
              )}
            </div>

            <button
              onClick={goToNextDay}
              disabled={currentDayIndex === workingDays.length - 1}
              className={`
                p-2 rounded-lg transition-all duration-200 flex items-center space-x-2
                ${currentDayIndex === workingDays.length - 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              <span className="text-sm">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Time Slots */}
        <div className="p-6">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h5 className="font-medium text-gray-900 dark:text-white">
                Available Time Slots
              </h5>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {getAvailableSlotCount(currentDay)} of {getTotalSlotCount(currentDay)} slots available
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Click on slots to toggle availability (green = available, gray = unavailable)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentDaySlots.map((slot, index) => {
              const isAvailable = slots[currentDay]?.[slot];
              return (
                <button
                  key={slot}
                  onClick={() => toggleSlot(slot)}
                  className={`
                    p-3 rounded-lg border-2 transition-all duration-200 text-left
                    ${isAvailable
                      ? (isDarkMode 
                          ? 'bg-green-900/20 border-green-700 text-green-300' 
                          : 'bg-green-50 border-green-200 text-green-800'
                        )
                      : (isDarkMode 
                          ? 'bg-gray-700/30 border-gray-600 text-gray-400' 
                          : 'bg-gray-100 border-gray-300 text-gray-600'
                        )
                    }
                    hover:scale-105 animate-slide-up
                  `}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        {formatTimeSlot(slot)}
                      </div>
                      <div className="text-xs opacity-75">
                        1 hour session
                      </div>
                    </div>
                    <div className={`
                      w-4 h-4 rounded-full border-2
                      ${isAvailable
                        ? 'bg-green-500 border-green-500'
                        : 'bg-transparent border-gray-400'
                      }
                    `} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Day Actions */}
          <div className="flex space-x-3 mt-6">
            <button
              onClick={confirmDay}
              className={`
                flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center
                ${isDarkMode 
                  ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                  : 'bg-gray-800 hover:bg-gray-700 text-white'
                }
                ${isCurrentDaySaved ? 'pulse-glow' : ''}
              `}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              {isCurrentDaySaved ? 'Day Updated' : 'Confirm Day'}
            </button>
          </div>
        </div>

        {/* Final Actions */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-3">
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
              disabled={savedDays.size === 0}
              className={`
                flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center
                ${savedDays.size > 0
                  ? (isDarkMode 
                      ? 'bg-gray-600 hover:bg-gray-500 text-white pulse-glow' 
                      : 'bg-gray-800 hover:bg-gray-700 text-white pulse-glow'
                    )
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              <Save className="w-4 h-4 mr-1" />
              Save All Slots ({savedDays.size} days)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetSlotsModal;