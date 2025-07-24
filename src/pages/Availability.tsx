import React, { useState } from 'react';
import { Plus, Calendar, Clock, Settings, CheckCircle, XCircle } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import SetAvailabilityModal from '../components/Modals/SetAvailabilityModal';
import SetSlotsModal from '../components/Modals/SetSlotsModal';
import { useTheme } from '../contexts/ThemeContext';

interface WeekAvailability {
  id: string;
  weekStart: string;
  weekEnd: string;
  status: 'not_set' | 'hours_set' | 'slots_set';
  workingHours: {
    [key: string]: {
      isWorking: boolean;
      startTime: string;
      endTime: string;
      isHoliday: boolean;
    };
  };
  slots: {
    [key: string]: {
      [key: string]: boolean; // time slot -> available
    };
  };
}

const Availability: React.FC = () => {
  const [setAvailabilityModalOpen, setSetAvailabilityModalOpen] = useState(false);
  const [setSlotsModalOpen, setSetSlotsModalOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<WeekAvailability | null>(null);
  const { isDarkMode } = useTheme();

  // Mock data for weekly availability
  const [weeklyAvailability, setWeeklyAvailability] = useState<WeekAvailability[]>([
    {
      id: 'week-1',
      weekStart: '2025-01-20',
      weekEnd: '2025-01-26',
      status: 'slots_set',
      workingHours: {
        monday: { isWorking: true, startTime: '09:00', endTime: '17:00', isHoliday: false },
        tuesday: { isWorking: true, startTime: '09:00', endTime: '17:00', isHoliday: false },
        wednesday: { isWorking: true, startTime: '09:00', endTime: '17:00', isHoliday: false },
        thursday: { isWorking: true, startTime: '09:00', endTime: '17:00', isHoliday: false },
        friday: { isWorking: true, startTime: '09:00', endTime: '17:00', isHoliday: false },
        saturday: { isWorking: false, startTime: '', endTime: '', isHoliday: false },
        sunday: { isWorking: false, startTime: '', endTime: '', isHoliday: false }
      },
      slots: {}
    },
    {
      id: 'week-2',
      weekStart: '2025-01-27',
      weekEnd: '2025-02-02',
      status: 'hours_set',
      workingHours: {
        monday: { isWorking: true, startTime: '10:00', endTime: '18:00', isHoliday: false },
        tuesday: { isWorking: true, startTime: '10:00', endTime: '18:00', isHoliday: false },
        wednesday: { isWorking: false, startTime: '', endTime: '', isHoliday: true },
        thursday: { isWorking: true, startTime: '10:00', endTime: '18:00', isHoliday: false },
        friday: { isWorking: true, startTime: '10:00', endTime: '18:00', isHoliday: false },
        saturday: { isWorking: false, startTime: '', endTime: '', isHoliday: false },
        sunday: { isWorking: false, startTime: '', endTime: '', isHoliday: false }
      },
      slots: {}
    }
  ]);

  const handleSetAvailability = (weekData: any) => {
    const newWeek: WeekAvailability = {
      id: `week-${Date.now()}`,
      weekStart: weekData.weekStart,
      weekEnd: weekData.weekEnd,
      status: 'hours_set',
      workingHours: weekData.workingHours,
      slots: {}
    };

    setWeeklyAvailability(prev => [...prev, newWeek]);
    setSetAvailabilityModalOpen(false);
    alert('Weekly availability set successfully!');
  };

  const handleSetSlots = (week: WeekAvailability) => {
    setSelectedWeek(week);
    setSetSlotsModalOpen(true);
  };

  const handleSlotsUpdated = (updatedSlots: any) => {
    if (selectedWeek) {
      setWeeklyAvailability(prev => 
        prev.map(week => 
          week.id === selectedWeek.id 
            ? { ...week, slots: updatedSlots, status: 'slots_set' }
            : week
        )
      );
    }
    setSetSlotsModalOpen(false);
    setSelectedWeek(null);
    alert('Time slots updated successfully!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'slots_set':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'hours_set':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'not_set':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'slots_set':
        return 'Slots Set';
      case 'hours_set':
        return 'Working Hours Set';
      case 'not_set':
        return 'Not Set';
      default:
        return status;
    }
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const startFormatted = start.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
    
    const endFormatted = end.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
    
    return `${startFormatted} – ${endFormatted}`;
  };

  const getWorkingDaysCount = (workingHours: any) => {
    return Object.values(workingHours).filter((day: any) => day.isWorking && !day.isHoliday).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Availability Management
        </h1>
        <Button
          variant="primary"
          onClick={() => setSetAvailabilityModalOpen(true)}
          className="pulse-glow"
        >
          <Plus className="w-4 h-4 mr-2" />
          Set Availability
        </Button>
      </div>

      {/* Weekly Availability Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {weeklyAvailability.map((week, index) => (
          <Card
            key={week.id}
            hover
            className="animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Week {index + 1}
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {formatDateRange(week.weekStart, week.weekEnd)}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(week.status)}`}>
                  {getStatusLabel(week.status)}
                </span>
              </div>

              {/* Working Days Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">Working Days:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {getWorkingDaysCount(week.workingHours)} days
                  </span>
                </div>
                
                {week.status !== 'not_set' && (
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Hours configured
                    </span>
                    {week.status === 'slots_set' && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedWeek(week);
                    setSetAvailabilityModalOpen(true);
                  }}
                  className="flex-1"
                >
                  <Settings className="w-4 h-4 mr-1" />
                  Edit Hours
                </Button>
                {week.status === 'hours_set' || week.status === 'slots_set' ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleSetSlots(week)}
                    className="flex-1"
                  >
                    <Calendar className="w-4 h-4 mr-1" />
                    {week.status === 'slots_set' ? 'Edit Slots' : 'Set Slots'}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Set Hours First
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {weeklyAvailability.length === 0 && (
        <Card>
          <div className="text-center py-8">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              No weekly availability set yet.
            </p>
            <Button
              variant="primary"
              onClick={() => setSetAvailabilityModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Set Your First Week
            </Button>
          </div>
        </Card>
      )}

      {/* Set Availability Modal */}
      {setAvailabilityModalOpen && (
        <SetAvailabilityModal
          isOpen={setAvailabilityModalOpen}
          onClose={() => {
            setSetAvailabilityModalOpen(false);
            setSelectedWeek(null);
          }}
          onSave={handleSetAvailability}
          existingWeek={selectedWeek}
        />
      )}

      {/* Set Slots Modal */}
      {setSlotsModalOpen && selectedWeek && (
        <SetSlotsModal
          isOpen={setSlotsModalOpen}
          onClose={() => {
            setSetSlotsModalOpen(false);
            setSelectedWeek(null);
          }}
          week={selectedWeek}
          onSave={handleSlotsUpdated}
        />
      )}
    </div>
  );
};

export default Availability;