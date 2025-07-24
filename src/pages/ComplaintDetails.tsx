import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  AlertCircle, 
  Calendar, 
  User, 
  MessageSquare, 
  Clock,
  FileText
} from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useTheme } from '../contexts/ThemeContext';

const ComplaintDetails: React.FC = () => {
  const { complaintId } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  // Mock complaint data
  const complaint = {
    id: complaintId || 'C001',
    sessionId: 'S001',
    patient: 'John Doe',
    type: 'Technical Issues',
    reason: 'Video call connection was poor throughout the session. The audio kept cutting out and the video quality was very low, making it difficult to conduct an effective therapy session. This significantly impacted the quality of care I could provide to the patient.',
    status: 'Under Review',
    date: '2024-01-15',
    submittedAt: '2024-01-15 11:30 AM',
    response: null,
    adminNotes: 'Investigating technical issues reported during session S001. Checking server logs and connection quality metrics.',
    priority: 'High'
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
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
            onClick={() => navigate('/complaints')}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Complaints
          </Button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Complaint Details
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Complaint Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Complaint Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Complaint ID
                </label>
                <p className="text-gray-800 dark:text-white font-medium">{complaint.id}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Status
                </label>
                <div className="mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                    {complaint.status}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Priority
                </label>
                <div className="mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
                    {complaint.priority}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Related Session
                </label>
                <div className="flex items-center space-x-2 mt-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-800 dark:text-white">
                    {complaint.sessionId}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Patient
                </label>
                <div className="flex items-center space-x-2 mt-1">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-800 dark:text-white">
                    {complaint.patient}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Complaint Type
                </label>
                <p className="text-gray-800 dark:text-white">{complaint.type}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Submitted
                </label>
                <div className="flex items-center space-x-2 mt-1">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-800 dark:text-white">
                    {complaint.submittedAt}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Complaint Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Complaint Reason */}
          <Card>
            <div className="flex items-center space-x-2 mb-4">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Complaint Details
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                  Reason for Complaint
                </label>
                <div className={`
                  p-4 rounded-lg border
                  ${isDarkMode 
                    ? 'bg-gray-700/30 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                  }
                `}>
                  <p className="text-gray-800 dark:text-white leading-relaxed">
                    {complaint.reason}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Admin Response */}
          {complaint.response ? (
            <Card>
              <div className="flex items-center space-x-2 mb-4">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Admin Response
                </h3>
              </div>
              
              <div className={`
                p-4 rounded-lg 
                ${isDarkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'} 
                border-l-4 border-blue-500
              `}>
                <p className="text-gray-800 dark:text-white leading-relaxed">
                  {complaint.response}
                </p>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-5 w-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Status Update
                </h3>
              </div>
              
              <div className={`
                p-4 rounded-lg 
                ${isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'} 
                border
              `}>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  {complaint.status === 'Pending' 
                    ? 'Your complaint is pending review. We will respond as soon as possible.'
                    : complaint.status === 'Under Review'
                    ? 'Your complaint is currently under review. Our team is investigating the issue.'
                    : 'No response available yet.'
                  }
                </p>
                
                {complaint.adminNotes && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Internal Notes:</strong> {complaint.adminNotes}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Timeline */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Timeline
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    Complaint Submitted
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {complaint.submittedAt}
                  </p>
                </div>
              </div>
              
              {complaint.status === 'Under Review' && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      Under Review
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Investigation in progress
                    </p>
                  </div>
                </div>
              )}
              
              {complaint.response && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      Response Provided
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Admin responded to your complaint
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;