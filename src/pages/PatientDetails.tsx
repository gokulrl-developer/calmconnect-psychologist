import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  FileText, 
  Lock,
  ExternalLink
} from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useTheme } from '../contexts/ThemeContext';

const PatientDetails: React.FC = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  // Mock patient data
  const patient = {
    id: patientId || 'P001',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    age: 28,
    joinedDate: '2023-11-20',
    totalSessions: 8,
    completedSessions: 6,
    upcomingSessions: 2,
    lastSession: '2024-01-15',
    status: 'Active',
    emergencyContact: 'Jane Doe - +1 (555) 987-6543',
    address: '123 Main St, New York, NY 10001'
  };

  // Mock sessions data
  const sessions = [
    {
      id: 'S001',
      date: '2024-01-15',
      time: '10:00 AM',
      status: 'Completed',
      progressNotes: 'Patient showed significant improvement in managing anxiety symptoms. Cognitive behavioral techniques were effective.',
      processNotes: 'Need to focus more on breathing exercises in next session. Patient responded well to mindfulness techniques.',
      rating: 5
    },
    {
      id: 'S007',
      date: '2024-01-08',
      time: '10:00 AM',
      status: 'Completed',
      progressNotes: {
        subjective: 'Patient practicing meditation daily, reports some improvement.',
        objective: 'Relaxed posture, steady breathing throughout session.',
        assessment: 'Good progress with anxiety management techniques.',
        plan: 'Continue current approach, add breathing exercises.'
      },
      processNotes: 'Patient seems more relaxed. Consider introducing advanced techniques next session.',
      rating: 4
    },
    {
      id: 'S008',
      date: '2024-01-01',
      time: '10:00 AM',
      status: 'Completed',
      progressNotes: {
        subjective: 'Patient reports anxiety affecting work and relationships.',
        objective: 'Fidgeting, rapid speech, difficulty maintaining focus.',
        assessment: 'Moderate anxiety disorder, good insight and motivation.',
        plan: 'Begin CBT, establish coping strategies, weekly sessions.'
      },
      processNotes: 'Good rapport established. Patient is motivated to work on anxiety management.',
      rating: 5
    },
    {
      id: 'S003',
      date: '2024-01-22',
      time: '2:00 PM',
      status: 'Upcoming',
      progressNotes: null,
      processNotes: '',
      rating: null
    },
    {
      id: 'S009',
      date: '2024-01-29',
      time: '2:00 PM',
      status: 'Upcoming',
      progressNotes: null,
      processNotes: '',
      rating: null
    }
  ];

  const handleSessionClick = (sessionId: string) => {
    navigate(`/sessions/${sessionId}`);
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/patients')}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Patients
          </Button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Patient Details
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">
                  {patient.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                {patient.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Patient ID: {patient.id}
              </p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                patient.status === 'Active'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
              }`}>
                {patient.status}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-800 dark:text-white text-sm">
                  {patient.email}
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-800 dark:text-white text-sm">
                  {patient.phone}
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-gray-800 dark:text-white text-sm">
                  Age: {patient.age}
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-800 dark:text-white text-sm">
                  Joined: {patient.joinedDate}
                </span>
              </div>
            </div>
          </Card>

          {/* Session Stats */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Session Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800 dark:text-white">
                  {patient.totalSessions}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Sessions
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {patient.completedSessions}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Completed
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {patient.upcomingSessions}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Upcoming
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Last Session
                </div>
                <div className="text-sm font-medium text-gray-800 dark:text-white">
                  {patient.lastSession}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sessions History */}
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
              Session History
            </h3>
            
            <div className="space-y-4">
              {sessions.map((session, index) => (
                <div
                  key={session.id}
                  className={`
                    p-4 rounded-lg border cursor-pointer
                    ${isDarkMode 
                      ? 'bg-gray-700/30 border-gray-600 hover:bg-gray-600/30' 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }
                    transition-all duration-200 animate-slide-up
                  `}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleSessionClick(session.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-800 dark:text-white">
                          {session.id}
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                        {session.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>{session.date}</span>
                      <Clock className="h-3 w-3" />
                      <span>{session.time}</span>
                    </div>
                  </div>

                  {session.status === 'Completed' && (
                    <div className="space-y-3">
                      {session.progressNotes && (
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <FileText className="h-3 w-3 text-gray-400" />
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                              Progress Notes
                            </span>
                          </div>
                          <div className="text-sm text-gray-800 dark:text-white pl-5">
                            {typeof session.progressNotes === 'string' ? (
                              <p>{session.progressNotes}</p>
                            ) : (
                              <div className="space-y-2">
                                <div>
                                  <span className="font-medium text-gray-700 dark:text-gray-300">Subjective:</span>
                                  <p className="text-gray-800 dark:text-white">{session.progressNotes.subjective}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700 dark:text-gray-300">Objective:</span>
                                  <p className="text-gray-800 dark:text-white">{session.progressNotes.objective}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700 dark:text-gray-300">Assessment:</span>
                                  <p className="text-gray-800 dark:text-white">{session.progressNotes.assessment}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700 dark:text-gray-300">Plan:</span>
                                  <p className="text-gray-800 dark:text-white">{session.progressNotes.plan}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {session.processNotes && (
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <Lock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                              Process Notes (Private)
                            </span>
                          </div>
                          <p className="text-sm text-gray-800 dark:text-white pl-5">
                            {session.processNotes}
                          </p>
                        </div>
                      )}

                      {session.rating && (
                        <div className="flex items-center space-x-2 pl-5">
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            Rating:
                          </span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`text-xs ${
                                  i < session.rating! ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-end mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;