import React, { useState, useEffect } from 'react';
import EventList from './components/EventList';
import events from './mockEvents';
import './App.css';
import axios from 'axios';

function App() {

  const [selectedEvents, setSelectedEvents] = useState(() => {
    const savedEvents = localStorage.getItem('selectedEvents');
    return savedEvents ? JSON.parse(savedEvents) : [];
  });

  const [isUsingVPN, setIsUsingVPN] = useState(null);
  const [clientIp, setClientIp] = useState('');

  useEffect(() => {
    // Fetch the client's IP address
    async function fetchClientIp() {
      try {
        const response = await axios.get('https://api.ipify.org?format=json');
        setClientIp(response?.data?.ip);
      } catch (error) {
        console.error('Error fetching client IP address:', error);
      }
    }

    fetchClientIp();
  }, []);

  useEffect(() => {
    if (clientIp) {
      async function checkVPNStatus() {
        try {
          const response = await axios.get('https://vpn-detection-server.onrender.com/api/vpn-status', {
            headers: {
              'X-Forwarded-For': clientIp,
            },
          });
          setIsUsingVPN(response.data.isUsingVPN);
        } catch (error) {
          console.error('Error fetching VPN status:', error);
        }
      }

      checkVPNStatus();
    }
  }, [clientIp]);

  useEffect(() => {
    localStorage.setItem('selectedEvents', JSON.stringify(selectedEvents));
  }, [selectedEvents]);

  const handleSelectEvent = (event) => {
    if (selectedEvents.length < 3 && !selectedEvents.some(e => e.id === event.id)) {
      setSelectedEvents([...selectedEvents, event]);
    }
  };

  const handleDeselectEvent = (event) => {
    setSelectedEvents(selectedEvents.filter(e => e.id !== event.id));
  };

  if (isUsingVPN === null) {
    return <div>Loading...</div>;
  }

  if (isUsingVPN) {
    return (
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
    );
  } else {
    return <div>Access restricted. Please connect to a VPN.</div>;
  }
}

export default App;
