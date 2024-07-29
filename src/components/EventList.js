// src/components/EventList.js
import React from 'react';
import EventCard from './EventCard';
import SelectedEventCard from './SelectedEventCard';

const EventList = ({ events, selectedEvents, onSelect, onDeselect }) => {
  const checkConflicts = (event) => {
    return selectedEvents.some(selectedEvent => {
      const eventStart = new Date(event.start_time);
      const eventEnd = new Date(event.end_time);
      const selectedEventStart = new Date(selectedEvent.start_time);
      const selectedEventEnd = new Date(selectedEvent.end_time);

      return (eventStart < selectedEventEnd && eventEnd > selectedEventStart);
    });
  };

  return (
    <div className="event-list">
      <div className="available-events">
        <h2>All Events</h2>
        {events.map(event => (
          <EventCard
            key={event.id}
            event={event}
            onSelect={onSelect}
            isSelected={selectedEvents.some(e => e.id === event.id)}
            isDisabled={selectedEvents.length >= 3 || checkConflicts(event)}
          />
        ))}
      </div>
      {selectedEvents?.length ? 
      <div className="selected-events">
        <h2>Selected Events</h2>
        {selectedEvents.map(event => (
          <SelectedEventCard key={event.id} event={event} onDeselect={onDeselect} />
        ))}
      </div>
      : null}
    </div>
  );
};

export default EventList;
