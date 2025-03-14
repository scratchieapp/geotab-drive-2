import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navigation from './components/shared/Navigation';
import AdminDashboard from './components/dashboard/AdminDashboard';
import DispatchLeaderboard from './components/leaderboard/DispatchLeaderboard';
import SettingsPage from './components/settings/SettingsPage';
import GeotabLogin from './components/GeotabLogin';
import { GeotabProvider, useGeotab } from './contexts/GeotabContext';

// Protected route component that redirects to login if not authenticated
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useGeotab();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function AppContent() {
  const { isAuthenticated } = useGeotab();
  
  return (
    <div className="App">
      {isAuthenticated && <Navigation />}
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<GeotabLogin />} />
          <Route path="/" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dispatch" element={
            <ProtectedRoute>
              <DispatchLeaderboard />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <GeotabProvider>
        <AppContent />
      </GeotabProvider>
    </Router>
  );
}

export default App;
