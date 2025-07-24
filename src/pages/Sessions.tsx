import React, { useState } from 'react';
import { Calendar, Clock, User, Search, Filter, Video, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useTheme } from '../contexts/ThemeContext';

const Sessions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const sessions = [
    {
      id: 'S001',
      patient: 'John Doe',
      date: '2024-01-15',
      time: '10:00 AM',
      status: 'Completed',
      notes: 'Patient showed significant improvement'
    },
    {
      id: 'S002',
      patient: 'Sarah Miller',
      date: '2024-01-15',
      time: '11:30 AM',
      status: 'Completed',
      notes: 'Good progress, continue current approach'
    },
    {
      id: 'S003',
      patient: 'Mike Rodriguez',
      date: '2024-01-15',
      time: '2:00 PM',
      status: 'Upcoming',
      notes: ''
    },
    {
      id: 'S004',
      patient: 'Anna Johnson',
      date: '2024-01-15',
      time: '3:30 PM',
      status: 'Upcoming',
      notes: ''
    },
    {
      id: 'S005',
      patient: 'David Wilson',
      date: '2024-01-14',
      time: '9:00 AM',
      status: 'Completed',
      notes: 'Excellent session, major breakthrough'
    },
    {
      id: 'S006',
      patient: 'Emily Brown',
      date: '2024-01-14',
      time: '4:00 PM',
      status: 'Cancelled',
      notes: 'Patient cancelled last minute'
    }
  ];

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || session.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Upcoming':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const handleSessionClick = (sessionId: string) => {
    navigate(`/sessions/${sessionId}`);
  };

  const isSessionTimeReached = (date: string, time: string) => {
    // For demo purposes, we'll simulate that sessions at 2:00 PM and later are available
    const sessionTime = time.replace(' AM', '').replace(' PM', '');
    const hour = parseInt(sessionTime.split(':')[0]);
    const isPM = time.includes('PM');
    const sessionHour24 = isPM && hour !== 12 ? hour + 12 : (hour === 12 && !isPM ? 0 : hour);
    
    // Simulate current time as 2:00 PM (14:00)
    const currentHour = 14;
    return sessionHour24 <= currentHour;
  };

  const handleJoinSession = (sessionId: string, date: string, time: string) => {
    if (isSessionTimeReached(date, time)) {
      // Navigate to video meeting room - replace with actual video call integration
      window.open(`/video-call/${sessionId}`, '_blank');
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Sessions
        </h1>
        <Button variant="primary">
          <Calendar className="w-4 h-4 mr-2" />
          Schedule New Session
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`
                w-full pl-10 pr-4 py-2 rounded-lg border 
                ${isDarkMode 
                  ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500'
                }
                focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
              `}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`
                px-3 py-2 rounded-lg border 
                ${isDarkMode 
                  ? 'bg-gray-700/50 border-gray-600 text-white' 
                  : 'bg-white/50 border-gray-300 text-gray-900'
                }
                focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
              `}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="upcoming">Upcoming</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Sessions Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300">
                  Session ID
                </th>
                <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300">
                  Patient
                </th>
                <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300">
                  Date
                </th>
                <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300">
                  Time
                </th>
                <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300">
                  Status
                </th>
                <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map((session, index) => (
                <tr
                  key={session.id}
                  className={`
                    border-b border-gray-100 dark:border-gray-800 
                    hover:bg-gray-50 dark:hover:bg-gray-700/50 
                    transition-colors cursor-pointer
                    animate-slide-up
                  `}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => handleSessionClick(session.id)}
                >
                  <td className="py-4 px-2">
                    <span className="font-medium text-gray-800 dark:text-white">
                      {session.id}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          {session.patient.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="text-gray-800 dark:text-white">
                        {session.patient}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {session.date}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {session.time}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                      {session.status}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center space-x-2">
                      {session.status === 'Upcoming' && (
                        <Button
                          variant={isSessionTimeReached(session.date, session.time) ? "primary" : "outline"}
                          size="sm"
                          disabled={!isSessionTimeReached(session.date, session.time)}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleJoinSession(session.id, session.date, session.time);
                          }}
                          className={isSessionTimeReached(session.date, session.time) ? "pulse-glow" : ""}
                        >
                          <Video className="w-4 h-4 mr-1" />
                          {isSessionTimeReached(session.date, session.time) ? 'Join' : 'Waiting'}
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSessionClick(session.id);
                        }}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Sessions;