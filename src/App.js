import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventList from './components/EventList';
import events from './mockEvents';
import './App.css';

function App() {
  const [selectedEvents, setSelectedEvents] = useState(() => {
    const savedEvents = localStorage.getItem('selectedEvents');
    return savedEvents ? JSON.parse(savedEvents) : [];
  });

  const [isUsingVPN, setIsUsingVPN] = useState(null);
  const [isProtonVPN, setIsProtonVPN] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : null);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
    
    setIsLoading(true)
    try {
      const response = await axios.post('https://vpn-detection-server.onrender.com/api/login', { username, password });
      localStorage.setItem('token', JSON.stringify(response.data.token));
      setToken(response.data.token);
      checkVPNStatus(response.data.token);
    } catch (error) {
      setError(error?.response?.data?.error || "")
    }
    finally{
      setIsLoading(false)
    }
  };

  useEffect(() => {
    if (token) checkVPNStatus(token);
  }, [token]);

  const checkVPNStatus = async (token) => {
    try {
      const response = await axios.get('https://vpn-detection-server.onrender.com/api/vpn-status', {
        headers: {
          'x-access-token': token,
          'X-Forwarded-For': await getClientIp(),
        },
      });
      const { isUsingVPN, isProtonVPN, username } = response.data;
      setIsUsingVPN(isUsingVPN);
      setIsProtonVPN(isProtonVPN);
      
    } catch (error) {
      console.error('Error fetching VPN status:', error);
    }
  };

  const getClientIp = async () => {
    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      return response.data.ip;
    } catch (error) {
      console.error('Error fetching client IP address:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsUsingVPN(null);
    setIsProtonVPN(null);
  };

  useEffect(() => {
    localStorage.setItem('selectedEvents', JSON.stringify(selectedEvents));
  }, [selectedEvents]);

  const handleSelectEvent = (event) => {
    if (selectedEvents.length < 3 && !selectedEvents.some((e) => e.id === event.id)) {
      setSelectedEvents([...selectedEvents, event]);
    }
  };

  const handleDeselectEvent = (event) => {
    setSelectedEvents(selectedEvents.filter((e) => e.id !== event.id));
  };

  return (
    <div>
      {!token ? (
        <div className="login-container">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => {setError(''); setUsername(e.target.value)}}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {setError(''); setPassword(e.target.value)}}
          />
          {error && <div className="error-message">{error}</div>}
          <button onClick={handleLogin} disabled={isLoading}>{isLoading ? '...' : 'Login'}</button>
        </div>
      ) : (
        <div>
          {isUsingVPN === null || isProtonVPN === null ? (
            <div>Loading...</div>
          ) : token && isUsingVPN && isProtonVPN ? (
            <> <div className='content-header'>
              <span>Welcome, authorized ProtonVPN user!</span>
              <button onClick={handleLogout}>Logout</button>
              </div>
              <div className="App">
                <header>
                  <h1>Sports Day</h1>
                </header>
                <main>
                  <EventList
                    events={events}
                    selectedEvents={selectedEvents}
                    onSelect={handleSelectEvent}
                    onDeselect={handleDeselectEvent}
                  />
                </main>
              </div>
            </>
          ) : (
            <div>Access restricted. You are not authorized to access this website.</div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
