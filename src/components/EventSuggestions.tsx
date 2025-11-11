import React from 'react';

interface EventSuggestionsProps {
  events: string[];
}

const EventSuggestions: React.FC<EventSuggestionsProps> = ({ events }) => (
  <div>
    <h3>Suggested Events & Attractions</h3>
    <ul>
      {events.map((event, idx) => (
        <li key={idx}>{event}</li>
      ))}
    </ul>
  </div>
);

export default EventSuggestions;