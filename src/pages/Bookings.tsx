import React, { useState } from 'react';
import { MessageCircle, Calendar, Clock, User, CheckCircle, Filter, ChevronDown } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import ChatModal from '../components/Modals/ChatModal';
import AssignSlotModal from '../components/Modals/AssignSlotModal';
import { useTheme } from '../contexts/ThemeContext';

interface BookingRequest {
  id: string;
  userName: string;
  userEmail: string;
  profilePhoto?: string;
  concernSummary: string;
  proposedDate: string;
  proposedTimeStart: string;
  proposedTimeEnd: string;
  status: 'proposed' | 'pending' | 'confirmed';
  assignedTimeStart?: string;
  assignedTimeEnd?: string;
  assignedDuration?: number;
  createdAt: string;
}

const Bookings: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [assignSlotModalOpen, setAssignSlotModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BookingRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'proposed' | 'pending' | 'confirmed'>('all');
  const { isDarkMode } = useTheme();

  // Mock data for booking requests
  const bookingRequests: BookingRequest[] = [
    {
      id: 'BR001',
      userName: 'Sarah Johnson',
      userEmail: 'sarah.johnson@email.com',
      concernSummary: 'Dealing with work-related anxiety and stress management issues',
      proposedDate: '2025-01-20',
      proposedTimeStart: '13:00',
      proposedTimeEnd: '17:00',
      status: 'proposed',
      createdAt: '2024-01-15 09:30 AM'
    },
    {
      id: 'BR002',
      userName: 'Michael Chen',
      userEmail: 'michael.chen@email.com',
      concernSummary: 'Relationship counseling and communication improvement',
      proposedDate: '2025-01-22',
      proposedTimeStart: '10:00',
      proposedTimeEnd: '14:00',
      status: 'proposed',
      createdAt: '2024-01-15 11:15 AM'
    },
    {
      id: 'BR003',
      userName: 'Emily Rodriguez',
      userEmail: 'emily.rodriguez@email.com',
      concernSummary: 'Depression and mood management support',
      proposedDate: '2025-01-23',
      proposedTimeStart: '15:00',
      proposedTimeEnd: '18:00',
      status: 'pending',
      assignedTimeStart: '15:30',
      assignedTimeEnd: '16:30',
      assignedDuration: 60,
      createdAt: '2024-01-15 02:45 PM'
    },
    {
      id: 'BR004',
      userName: 'David Wilson',
      userEmail: 'david.wilson@email.com',
      concernSummary: 'Career transition and life coaching',
      proposedDate: '2025-01-18',
      proposedTimeStart: '14:00',
      proposedTimeEnd: '16:00',
      status: 'confirmed',
      assignedTimeStart: '14:30',
      assignedTimeEnd: '16:00',
      assignedDuration: 90,
      createdAt: '2024-01-14 04:20 PM'
    },
    {
      id: 'BR005',
      userName: 'Lisa Thompson',
      userEmail: 'lisa.thompson@email.com',
      concernSummary: 'Grief counseling and emotional support',
      proposedDate: '2025-01-19',
      proposedTimeStart: '11:00',
      proposedTimeEnd: '15:00',
      status: 'confirmed',
      assignedTimeStart: '11:00',
      assignedTimeEnd: '12:15',
      assignedDuration: 75,
      createdAt: '2024-01-14 01:10 PM'
    }
  ];

  const filteredRequests = bookingRequests.filter(request => {
    if (filterStatus === 'all') return true;
    return request.status === filterStatus;
  });

  const handleChatOpen = (request: BookingRequest) => {
    setSelectedRequest(request);
    setSelectedUser(request.userName);
    setChatModalOpen(true);
  };

  const handleAssignSlot = (request: BookingRequest) => {
    setSelectedRequest(request);
    setAssignSlotModalOpen(true);
  };

  const handleSlotAssigned = (startTime: string, endTime: string, duration: number) => {
    // Handle slot assignment logic
    console.log('Slot assigned:', { startTime, endTime, duration, request: selectedRequest });
    setAssignSlotModalOpen(false);
    setSelectedRequest(null);
    alert('Slot assigned successfully! User will be notified.');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'proposed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'proposed':
        return 'Proposed Request';
      case 'pending':
        return 'Pending Response';
      case 'confirmed':
        return 'Confirmed Session';
      default:
        return status;
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

  const calculateTimeWindow = (startTime: string, endTime: string) => {
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return `${diffHours}h window`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Bookings
        </h1>
        <div className="text-sm text-gray-700 dark:text-gray-300">
          {filteredRequests.length} requests
        </div>
      </div>

      {/* Filter Controls */}
      <Card>
        <div className="flex items-center space-x-4">
          <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className={`
                appearance-none px-4 py-2 pr-8 rounded-lg border 
                ${isDarkMode 
                  ? 'bg-gray-700/50 border-gray-600 text-white' 
                  : 'bg-white/50 border-gray-300 text-gray-900'
                }
                focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
                cursor-pointer
              `}
            >
              <option value="all">All Requests</option>
              <option value="proposed">Proposed Requests</option>
              <option value="pending">Pending Responses</option>
              <option value="confirmed">Confirmed Sessions</option>
            </select>
            <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
          
          <div className="flex space-x-2">
            {['proposed', 'pending', 'confirmed'].map((status) => {
              const count = bookingRequests.filter(req => req.status === status).length;
              return (
                <div key={status} className="flex items-center space-x-1">
                  <span className={`w-3 h-3 rounded-full ${getStatusColor(status).split(' ')[0]}`}></span>
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                    {status}: {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Booking Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredRequests.map((request, index) => (
          <Card
            key={request.id}
            hover
            className="animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg font-medium">
                      {request.userName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {request.userName}
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {request.userEmail}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                  {getStatusLabel(request.status)}
                </span>
              </div>

              {/* Concern Summary */}
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Concern Summary
                </label>
                <p className="text-sm text-gray-900 dark:text-white mt-1">
                  {request.concernSummary}
                </p>
              </div>

              {/* Date and Time Range */}
              <div className="space-y-2">
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Proposed Date
                  </label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      {formatDate(request.proposedDate)}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Available Time Window
                  </label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      {formatTime(request.proposedTimeStart)} - {formatTime(request.proposedTimeEnd)}
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      ({calculateTimeWindow(request.proposedTimeStart, request.proposedTimeEnd)})
                    </span>
                  </div>
                </div>
              </div>

              {/* Assigned Slot (if exists) */}
              {request.assignedTimeStart && request.assignedTimeEnd && (
                <div className={`
                  p-3 rounded-lg 
                  ${isDarkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'} 
                  border-l-4 border-green-500
                `}>
                  <label className="text-xs font-medium text-green-700 dark:text-green-300">
                    Assigned Slot
                  </label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="h-3 w-3 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-green-800 dark:text-green-200">
                      {formatTime(request.assignedTimeStart)} - {formatTime(request.assignedTimeEnd)}
                    </span>
                    <span className="text-xs text-green-600 dark:text-green-400">
                      ({request.assignedDuration} min)
                    </span>
                  </div>
                </div>
              )}

              {/* Request Date */}
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Requested: {request.createdAt}
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleChatOpen(request)}
                  className="flex-1"
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Chat
                </Button>
                {request.status === 'proposed' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAssignSlot(request)}
                    className="flex-1 pulse-glow"
                  >
                    <Calendar className="w-4 h-4 mr-1" />
                    Assign Slot
                  </Button>
                )}
                {request.status === 'pending' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAssignSlot(request)}
                    className="flex-1"
                  >
                    <Calendar className="w-4 h-4 mr-1" />
                    Modify
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <Card>
          <div className="text-center py-8">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-700 dark:text-gray-300">
              No booking requests found for the selected filter.
            </p>
          </div>
        </Card>
      )}

      {/* Chat Modal */}
      {chatModalOpen && selectedUser && (
        <ChatModal
          isOpen={chatModalOpen}
          onClose={() => {
            setChatModalOpen(false);
            setSelectedUser(null);
            setSelectedRequest(null);
          }}
          userName={selectedUser}
          requestId={selectedRequest?.id || ''}
        />
      )}

      {/* Assign Slot Modal */}
      {assignSlotModalOpen && selectedRequest && (
        <AssignSlotModal
          isOpen={assignSlotModalOpen}
          onClose={() => {
            setAssignSlotModalOpen(false);
            setSelectedRequest(null);
          }}
          request={selectedRequest}
          onAssign={handleSlotAssigned}
        />
      )}
    </div>
  );
};

export default Bookings;