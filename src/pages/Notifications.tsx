import React, { useState } from 'react';
import { Bell, CheckCircle, Settings2 } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

const initialNotifications = [
  {
    id: 1,
    type: 'Session Timing',
    message: 'Room opens in 5 minutes for session with John Doe.',
    date: '2025-07-25',
    time: '09:55',
    read: false,
  },
  {
    id: 2,
    type: 'Appointment',
    message: 'Appointment with Jane Smith scheduled for tomorrow.',
    date: '2025-07-24',
    time: '15:00',
    read: false,
  },
  {
    id: 3,
    type: 'Wrong Action',
    message: 'Wrong action detected: Explanation needed for late session start.',
    date: '2025-07-23',
    time: '11:30',
    read: true,
  },
  {
    id: 4,
    type: 'Session Timing',
    message: 'Room opens in 1 hour for session with Alex Brown.',
    date: '2025-07-25',
    time: '09:00',
    read: false,
  },
  {
    id: 5,
    type: 'Appointment',
    message: 'Appointment with Sam Lee cancelled.',
    date: '2025-07-22',
    time: '10:00',
    read: true,
  },
];

const notificationCategories = [
  { key: 'Session Timing', label: 'Session Timing Related' },
  { key: 'Appointment', label: 'Appointment Related' },
  { key: 'Wrong Action', label: 'Wrong Action Related' }
];

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [preferences, setPreferences] = useState({
    'Session Timing': true,
    'Appointment': true,
    'Wrong Action': true,
  });

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const togglePreference = (category: string) => {
    setPreferences(prev => ({ ...prev, [category]: !prev[category] }));
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
          <Bell className="w-6 h-6 mr-2 text-blue-500" />
          Notifications
        </h1>
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-gray-700">Recent Notifications</span>
          <Button variant="primary" size="sm" onClick={markAllAsRead}>
            <CheckCircle className="w-4 h-4 mr-1" /> Mark All as Read
          </Button>
        </div>
        <div className="space-y-3 mb-8">
          {notifications.length === 0 && (
            <div className="text-gray-500 text-center py-8">No notifications.</div>
          )}
          {notifications.map(n => (
            <Card key={n.id} className="p-3 rounded-lg shadow border flex items-center justify-between bg-white">
              <div>
                <div className="font-semibold text-gray-700">{n.message}</div>
                <div className="text-xs text-gray-500">{n.date} {n.time} • {n.type}</div>
              </div>
              <div className="flex items-center space-x-2">
                {!n.read ? (
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => markAsRead(n.id)}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" /> Mark Read
                  </Button>
                ) : (
                  <span className="text-green-600 text-xs flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" /> Read
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow border p-4">
          <div className="flex items-center mb-2">
            <Settings2 className="w-5 h-5 text-gray-500 mr-2" />
            <span className="font-semibold text-gray-700">Notification Preferences</span>
          </div>
          <div className="flex flex-col gap-4">
            {notificationCategories.map(cat => (
              <div key={cat.key} className="flex items-center justify-between py-2">
                <span className="text-gray-700 text-sm">{cat.label}</span>
                <label className="inline-flex items-center cursor-pointer">
                  <span
                    className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200
                      ${preferences[cat.key] ? 'bg-blue-500' : 'bg-gray-300'}`}
                    style={{ minWidth: 40 }}
                  >
                    <span
                      className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-200
                        ${preferences[cat.key] ? 'translate-x-4' : 'translate-x-0'}`}
                    />
                  </span>
                  <input
                    type="checkbox"
                    checked={preferences[cat.key]}
                    onChange={() => togglePreference(cat.key)}
                    className="hidden"
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;