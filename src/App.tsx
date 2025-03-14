import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { GeotabProvider, useGeotab } from './contexts/GeotabContext';

// Simplified components
const Login = () => {
  const { login, isLoading, error } = useGeotab();
  const [database, setDatabase] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(database, username, password);
    } catch (err) {
      // Error handling is done in context
    }
  };

  return (
    <div className="scratchie-login-container">
      <div className="scratchie-login-card">
        <h2>Geotab Login</h2>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="scratchie-login-error">
              {error}
            </div>
          )}
          
          <div className="scratchie-form-field">
            <label>Database</label>
            <input
              type="text"
              value={database}
              onChange={(e) => setDatabase(e.target.value)}
              placeholder="Your Geotab database"
              required
            />
          </div>
          
          <div className="scratchie-form-field">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your Geotab username"
              required
            />
          </div>
          
          <div className="scratchie-form-field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your Geotab password"
              required
            />
          </div>
          
          <div className="scratchie-form-actions">
            <button
              type="submit"
              disabled={isLoading}
              className="scratchie-button"
            >
              {isLoading ? 'Logging in...' : 'Log In with Geotab'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { logout, userPreferences } = useGeotab();
  const [drivers, setDrivers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate loading drivers
    setTimeout(() => {
      setDrivers([
        { id: 1, name: 'John Doe', performanceScore: 85 },
        { id: 2, name: 'Jane Smith', performanceScore: 92 },
        { id: 3, name: 'Bob Johnson', performanceScore: 78 },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="scratchie-dashboard">
      <header className="scratchie-header">
        <h1>Scratchie Rewards Dashboard</h1>
        <div className="scratchie-user-info">
          {userPreferences ? (
            <span>Units: {userPreferences.isMetric ? 'Metric' : 'Imperial'}</span>
          ) : null}
          <button onClick={logout} className="scratchie-button">Logout</button>
        </div>
      </header>
      
      <main className="scratchie-main">
        <h2>Driver Performance</h2>
        {loading ? (
          <p>Loading drivers...</p>
        ) : (
          <div className="scratchie-driver-list">
            {drivers.map((driver: any) => (
              <div key={driver.id} className="scratchie-driver-card">
                <h3>{driver.name}</h3>
                <p>Performance Score: {driver.performanceScore}%</p>
                <button className="scratchie-button">Reward</button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

// Protected route component
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
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
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
