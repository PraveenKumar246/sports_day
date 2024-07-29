// src/App.js
import React, { useState, useEffect } from 'react';
import EventList from './components/EventList';
import events from './mockEvents';
import './App.css';

const App = () => {
  const [selectedEvents, setSelectedEvents] = useState(() => {
    const savedEvents = localStorage.getItem('selectedEvents');
    return savedEvents ? JSON.parse(savedEvents) : [];
  });

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
};

export default App;
