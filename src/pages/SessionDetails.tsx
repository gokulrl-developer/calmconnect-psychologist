import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Video, 
  FileText, 
  Lock,
  Save,
  Star,
  ExternalLink
} from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useTheme } from '../contexts/ThemeContext';

const SessionDetails: React.FC = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  const [progressNotes, setProgressNotes] = useState('Patient showed significant improvement in managing anxiety symptoms. Cognitive behavioral techniques were effective.');
  const [processNotes, setProcessNotes] = useState('Need to focus more on breathing exercises in next session. Patient responded well to mindfulness techniques.');

  // Mock session data
  const session = {
    id: sessionId || 'S001',
    patient: 'John Doe',
    patientId: 'P001',
    date: '2024-01-15',
    time: '10:00 AM',
    duration: '50 min',
    status: 'Completed',
    rating: 5,
    review: 'Dr. Smith was very helpful and understanding. The session helped me gain new perspectives on managing my anxiety.',
    patientAge: 28,
    sessionType: 'Individual Therapy',
    appointmentType: 'Follow-up'
  };

  const handleSave = () => {
    // Handle saving notes
    alert('Notes saved successfully!');
  };

  const handleStartVideoCall = () => {
    // Handle video call
    alert('Starting video call...');
  };

  const handleViewPatient = () => {
    navigate(`/patients/${session.patientId}`);
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/sessions')}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Sessions
          </Button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Session Details
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleViewPatient}
          >
            <User className="w-4 h-4 mr-2" />
            View Patient
          </Button>
          {session.status === 'Upcoming' && (
            <Button
              variant="primary"
              onClick={handleStartVideoCall}
              className="pulse-glow"
            >
              <Video className="w-4 h-4 mr-2" />
              Start Video Call
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Session Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Session Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Session ID
                </label>
                <p className="text-gray-800 dark:text-white">{session.id}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Patient
                </label>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      {session.patient.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <span className="text-gray-800 dark:text-white">
                    {session.patient}
                  </span>
                </div>
              </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleViewPatient}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
              
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Date & Time
                </label>
                <div className="flex items-center space-x-2 mt-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-800 dark:text-white">
                    {session.date}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-800 dark:text-white">
                    {session.time}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Duration
                </label>
                <p className="text-gray-800 dark:text-white">{session.duration}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Status
                </label>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                  session.status === 'Completed'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                }`}>
                  {session.status}
                </span>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Session Type
                </label>
                <p className="text-gray-800 dark:text-white">{session.sessionType}</p>
              </div>
            </div>
          </Card>

          {/* Rating & Review */}
          {session.status === 'Completed' && session.rating && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Patient Feedback
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Rating
                  </label>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < session.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-gray-800 dark:text-white">
                      {session.rating}/5
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Review
                  </label>
                  <p className="text-gray-800 dark:text-white mt-1 text-sm">
                    {session.review}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Notes Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Notes */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Progress Notes
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  (Visible to admin)
                </span>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSave}
                className="pulse-glow"
              >
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
            </div>
            
            <textarea
              value={progressNotes}
              onChange={(e) => setProgressNotes(e.target.value)}
              placeholder="Enter progress notes here..."
              className={`
                w-full h-32 p-3 rounded-lg border resize-none
                ${isDarkMode 
                  ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500'
                }
                focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
              `}
            />
          </Card>

          {/* Process Notes */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Lock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Process Notes
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  (Private - Only visible to you)
                </span>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSave}
                className="pulse-glow"
              >
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
            </div>
            
            <textarea
              value={processNotes}
              onChange={(e) => setProcessNotes(e.target.value)}
              placeholder="Enter private process notes here..."
              className={`
                w-full h-32 p-3 rounded-lg border resize-none
                ${isDarkMode 
                  ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500'
                }
                focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
              `}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SessionDetails;