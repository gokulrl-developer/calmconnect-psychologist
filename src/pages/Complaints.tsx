import React, { useState } from 'react';
import { Plus, AlertCircle, Calendar, User, MessageSquare, ExternalLink, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useTheme } from '../contexts/ThemeContext';

const Complaints: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    sessionId: '',
    complaintType: '',
    reason: ''
  });
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const complaintTypes = [
    'Technical Issues',
    'Patient Behavior',
    'Payment Issues',
    'Platform Issues',
    'Other'
  ];

  const pastSessions = [
    { id: 'S001', patient: 'John Doe', date: '2024-01-15' },
    { id: 'S002', patient: 'Sarah Miller', date: '2024-01-14' },
    { id: 'S003', patient: 'Mike Rodriguez', date: '2024-01-13' },
    { id: 'S004', patient: 'Anna Johnson', date: '2024-01-12' },
    { id: 'S005', patient: 'David Wilson', date: '2024-01-11' },
  ];

  const myComplaints = [
    {
      id: 'C001',
      sessionId: 'S001',
      patient: 'John Doe',
      type: 'Technical Issues',
      reason: 'Video call connection was poor throughout the session',
      status: 'Pending',
      date: '2024-01-15',
      response: null
    },
    {
      id: 'C002',
      sessionId: 'S005',
      patient: 'David Wilson',
      type: 'Patient Behavior',
      reason: 'Patient was disruptive and used inappropriate language',
      status: 'Resolved',
      date: '2024-01-11',
      response: 'Issue has been addressed with the patient. Additional support measures implemented.'
    },
    {
      id: 'C003',
      sessionId: 'S003',
      patient: 'Mike Rodriguez',
      type: 'Payment Issues',
      reason: 'Payment for session was not processed correctly',
      status: 'Under Review',
      date: '2024-01-13',
      response: null
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Complaint submitted:', formData);
    setShowForm(false);
    setFormData({ sessionId: '', complaintType: '', reason: '' });
    alert('Complaint submitted successfully!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const handleViewComplaint = (complaintId: string) => {
    navigate(`/complaints/${complaintId}`);
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Complaints
        </h1>
        <Button
          variant="primary"
          onClick={() => setShowForm(true)}
          className="pulse-glow"
        >
          <Plus className="w-4 h-4 mr-2" />
          Raise a Complaint
        </Button>
      </div>

      {/* Complaint Form */}
      {showForm && (
        <Card className="animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              New Complaint
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Session ID
              </label>
              <select
                value={formData.sessionId}
                onChange={(e) => setFormData({ ...formData, sessionId: e.target.value })}
                className={`
                  w-full px-3 py-2 rounded-lg border 
                  ${isDarkMode 
                    ? 'bg-gray-700/50 border-gray-600 text-white' 
                    : 'bg-white/50 border-gray-300 text-gray-900'
                  }
                  focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
                `}
                required
              >
                <option value="">Select a session</option>
                {pastSessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.id} - {session.patient} ({session.date})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Complaint Type
              </label>
              <select
                value={formData.complaintType}
                onChange={(e) => setFormData({ ...formData, complaintType: e.target.value })}
                className={`
                  w-full px-3 py-2 rounded-lg border 
                  ${isDarkMode 
                    ? 'bg-gray-700/50 border-gray-600 text-white' 
                    : 'bg-white/50 border-gray-300 text-gray-900'
                  }
                  focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
                `}
                required
              >
                <option value="">Select complaint type</option>
                {complaintTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Reason
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Please describe the issue in detail..."
                className={`
                  w-full px-3 py-2 rounded-lg border resize-none h-32
                  ${isDarkMode 
                    ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500'
                  }
                  focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
                `}
                required
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Submit Complaint
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* My Complaints */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          My Complaints
        </h3>
        
        {myComplaints.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              You haven't raised any complaints yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myComplaints.map((complaint, index) => (
              <Card
                key={complaint.id}
                hover
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <span className="font-medium text-gray-800 dark:text-white">
                        {complaint.id}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewComplaint(complaint.id)}
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                  </div>

                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Type</label>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{complaint.type}</p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Date & Time</label>
                    <p className="text-sm text-gray-800 dark:text-white">{complaint.date}</p>
                  </div>

                  {complaint.sessionId && (
                    <div>
                      <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Session</label>
                      <p className="text-sm text-gray-800 dark:text-white">{complaint.sessionId}</p>
                    </div>
                  )}

                  {complaint.patient && (
                    <div>
                      <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Patient</label>
                      <p className="text-sm text-gray-800 dark:text-white">{complaint.patient}</p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Complaints;