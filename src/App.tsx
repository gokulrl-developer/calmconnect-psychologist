import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import MainLayout from './components/Layout/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Sessions from './pages/Sessions';
import SessionDetails from './pages/SessionDetails';
import Patients from './pages/Patients';
import PatientDetails from './pages/PatientDetails';
import Availability from './pages/Availability';
import Bookings from './pages/Bookings';
import Wallet from './pages/Wallet';
import Complaints from './pages/Complaints';
import ComplaintDetails from './pages/ComplaintDetails';
import Profile from './pages/Profile';
import WrongActions from './pages/WrongActions';
import Notifications from './pages/Notifications';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="sessions" element={<Sessions />} />
              <Route path="sessions/:sessionId" element={<SessionDetails />} />
              <Route path="patients" element={<Patients />} />
              <Route path="patients/:patientId" element={<PatientDetails />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="availability" element={<Availability />} />
              <Route path="wallet" element={<Wallet />} />
              <Route path="complaints" element={<Complaints />} />
              <Route path="complaints/:complaintId" element={<ComplaintDetails />} />
              <Route path="profile" element={<Profile />} />
              <Route path="wrong-actions" element={<WrongActions />} />
              <Route path="notifications" element={<Notifications />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;