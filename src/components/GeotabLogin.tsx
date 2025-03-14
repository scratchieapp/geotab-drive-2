import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeotab } from '../contexts/GeotabContext';

// Using Geotab Zenith components as mentioned in the guide
import { 
  Card,
  Button,
  TextInput,
  Callout,
  Icon
} from '@geotab/zenith';

const GeotabLogin: React.FC = () => {
  const [database, setDatabase] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useGeotab();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(database, username, password);
      
      // Redirect to dashboard on successful login
      navigate('/dashboard');
    } catch (err) {
      // Error handling is already done in the GeotabContext
    }
  };

  return (
    <div className="scratchie-login-container">
      <Card title="Geotab Login" className="scratchie-login-card">
        <form onSubmit={handleSubmit}>
          {error && (
            <Callout 
              variant="error" 
              title="Login Error"
              className="scratchie-login-error"
            >
              {error}
            </Callout>
          )}
          
          <div className="scratchie-form-field">
            <TextInput
              label="Database"
              value={database}
              onChange={(e) => setDatabase(e.target.value)}
              placeholder="Your Geotab database"
              required
              fullWidth
            />
          </div>
          
          <div className="scratchie-form-field">
            <TextInput
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your Geotab username"
              required
              fullWidth
            />
          </div>
          
          <div className="scratchie-form-field">
            <TextInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your Geotab password"
              required
              fullWidth
            />
          </div>
          
          <div className="scratchie-form-actions">
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              disabled={isLoading}
              fullWidth
            >
              <Icon name="login" />
              Log In with Geotab
            </Button>
          </div>
        </form>
      </Card>
      
      <style jsx>{`
        .scratchie-login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 2rem;
          background-color: #f5f7fa;
        }
        
        .scratchie-login-card {
          width: 100%;
          max-width: 450px;
        }
        
        .scratchie-login-error {
          margin-bottom: 1.5rem;
        }
        
        .scratchie-form-field {
          margin-bottom: 1.5rem;
        }
        
        .scratchie-form-actions {
          margin-top: 2rem;
        }
      `}</style>
    </div>
  );
};

export default GeotabLogin; 