import React, { useState } from 'react';
import { Search, Filter, User, Calendar, FileText, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useTheme } from '../contexts/ThemeContext';

const Patients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const patients = [
    {
      id: 'P001',
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      totalSessions: 8,
      completedSessions: 6,
      upcomingSessions: 2,
      lastSession: '2024-01-15',
      joinedDate: '2023-11-20',
      status: 'Active'
    },
    {
      id: 'P002',
      name: 'Sarah Miller',
      email: 'sarah.miller@email.com',
      phone: '+1 (555) 234-5678',
      totalSessions: 12,
      completedSessions: 10,
      upcomingSessions: 2,
      lastSession: '2024-01-14',
      joinedDate: '2023-10-15',
      status: 'Active'
    },
    {
      id: 'P003',
      name: 'Mike Rodriguez',
      email: 'mike.rodriguez@email.com',
      phone: '+1 (555) 345-6789',
      totalSessions: 5,
      completedSessions: 3,
      upcomingSessions: 2,
      lastSession: '2024-01-12',
      joinedDate: '2023-12-01',
      status: 'Active'
    },
    {
      id: 'P004',
      name: 'Anna Johnson',
      email: 'anna.johnson@email.com',
      phone: '+1 (555) 456-7890',
      totalSessions: 15,
      completedSessions: 15,
      upcomingSessions: 0,
      lastSession: '2024-01-10',
      joinedDate: '2023-09-10',
      status: 'Inactive'
    },
    {
      id: 'P005',
      name: 'David Wilson',
      email: 'david.wilson@email.com',
      phone: '+1 (555) 567-8901',
      totalSessions: 20,
      completedSessions: 18,
      upcomingSessions: 2,
      lastSession: '2024-01-13',
      joinedDate: '2023-08-05',
      status: 'Active'
    }
  ];

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePatientClick = (patientId: string) => {
    navigate(`/patients/${patientId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Patients
        </h1>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {filteredPatients.length} patients
        </div>
      </div>

      {/* Search */}
      <Card>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients..."
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
      </Card>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient, index) => (
          <Card
            key={patient.id}
            hover
            className="cursor-pointer animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => handlePatientClick(patient.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-medium">
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    {patient.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {patient.id}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                {patient.status}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Email:</span>
                <span className="text-gray-800 dark:text-white truncate ml-2">
                  {patient.email}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                <span className="text-gray-800 dark:text-white">
                  {patient.phone}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Last Session:</span>
                <span className="text-gray-800 dark:text-white">
                  {patient.lastSession}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePatientClick(patient.id);
                }}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <Card>
          <div className="text-center py-8">
            <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No patients found matching your search.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Patients;