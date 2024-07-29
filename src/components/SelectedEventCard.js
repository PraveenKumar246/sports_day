// src/components/SelectedEventCard.js
import React from 'react';

const SelectedEventCard = ({ event, onDeselect }) => (
    <div className={`selected-event-card`}>
    <div className="event-card-left">
      <div className="event-initial">{event.event_name.charAt(0)}</div>
    </div>
    <div className="event-card-right">
        <h3>{event.event_name}</h3>
        <p>({event.event_category})</p>
        <p>Start Time: {new Date(event.start_time).toLocaleString()}</p>
        <p>End Time: {new Date(event.end_time).toLocaleString()}</p>
        <button onClick={() => onDeselect(event)}>Remove</button>
    </div>
  </div>
  
);

export default SelectedEventCard;
