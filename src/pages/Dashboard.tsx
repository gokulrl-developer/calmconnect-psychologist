import React from 'react';
import { Calendar, Clock, Users, AlertTriangle, TrendingUp } from 'lucide-react';
import Card from '../components/UI/Card';
import { useTheme } from '../contexts/ThemeContext';

const Dashboard: React.FC = () => {
  const { isDarkMode } = useTheme();

  const stats = [
    {
      title: "Today's Sessions",
      value: "3",
      icon: Calendar,
      color: "from-blue-500 to-blue-600",
      change: "+2 from yesterday"
    },
    {
      title: "Upcoming Sessions",
      value: "7",
      icon: Clock,
      color: "from-green-500 to-green-600",
      change: "Next: 2:00 PM"
    },
    {
      title: "Total Sessions",
      value: "142",
      icon: Users,
      color: "from-purple-500 to-purple-600",
      change: "+15 this month"
    },
    {
      title: "Active Complaints",
      value: "2",
      icon: AlertTriangle,
      color: "from-orange-500 to-orange-600",
      change: "1 pending review"
    }
  ];

  const recentSessions = [
    { id: 1, patient: "John D.", time: "10:00 AM", status: "Completed", rating: 5 },
    { id: 2, patient: "Sarah M.", time: "11:30 AM", status: "Completed", rating: 4 },
    { id: 3, patient: "Mike R.", time: "2:00 PM", status: "Upcoming", rating: null },
    { id: 4, patient: "Anna L.", time: "3:30 PM", status: "Upcoming", rating: null },
  ];

  // Mock data for the chart
  const chartData = [
    { week: 'Week 1', sessions: 12 },
    { week: 'Week 2', sessions: 15 },
    { week: 'Week 3', sessions: 18 },
    { week: 'Week 4', sessions: 22 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Dashboard
        </h1>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Welcome back, Dr. Smith
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} hover className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {stat.change}
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sessions Chart */}
        <Card className="animate-slide-up" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Sessions This Month
            </h3>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="space-y-4">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {item.week}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div
                      className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${(item.sessions / 25) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-800 dark:text-white">
                    {item.sessions}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Sessions */}
        <Card className="animate-slide-up" style={{ animationDelay: '500ms' }}>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Recent Sessions
          </h3>
          <div className="space-y-3">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                } hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      {session.patient.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {session.patient}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {session.time}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    session.status === 'Completed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                  }`}>
                    {session.status}
                  </span>
                  {session.rating && (
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-xs ${
                            i < session.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;