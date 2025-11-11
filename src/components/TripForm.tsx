import React, { useState, useEffect, useRef } from 'react';
import { searchAddress } from '../services/autocompleteService';

export interface TripData {
  startLocation: string;
  endLocation: string;
  flightCost?: number;
  accommodationCost?: number;
  roundTrip: boolean;
  tripType: 'road' | 'flight';
  departureDate: string;
  returnDate?: string;
  departureTime?: string;
  returnTime?: string;
  passengers: number;
  vehicleMpg?: number;
  fuelType?: string;
  budget?: number;
  interests: string[];
  dietaryRestrictions: string[];
}

interface TripFormProps {
  onSubmit: (data: TripData) => void;
}

const TripForm: React.FC<TripFormProps> = ({ onSubmit }) => {
  const [form, setForm] = useState<TripData>({
    startLocation: '',
    endLocation: '',
    roundTrip: false,
    tripType: 'road',
    departureDate: '',
    passengers: 1,
    interests: [],
    dietaryRestrictions: []
  });

  const [startLocationSuggestions, setStartLocationSuggestions] = useState<string[]>([]);
  const [endLocationSuggestions, setEndLocationSuggestions] = useState<string[]>([]);
  const debounceTimeoutRef = useRef<number | null>(null);

  const handleChange = <K extends keyof TripData>(key: K, value: TripData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleLocationChange = (
    key: 'startLocation' | 'endLocation',
    value: string,
    setSuggestions: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    handleChange(key, value);
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(async () => {
      if (value.length > 2) {
        const suggestions = await searchAddress(value);
        setSuggestions(suggestions);
      } else {
        setSuggestions([]);
      }
    }, 300);
  };

  const handleSuggestionClick = (
    key: 'startLocation' | 'endLocation',
    suggestion: string,
    setSuggestions: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    handleChange(key, suggestion);
    setSuggestions([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="trip-form" onSubmit={handleSubmit}>
      <div style={{ position: 'relative' }}>
        <label>Start Location:</label>
        <input
          type="text"
          value={form.startLocation}
          onChange={e => handleLocationChange('startLocation', e.target.value, setStartLocationSuggestions)}
          required
        />
        {startLocationSuggestions.length > 0 && (
          <ul className="suggestions-list">
            {startLocationSuggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleSuggestionClick('startLocation', suggestion, setStartLocationSuggestions)}>
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div style={{ position: 'relative' }}>
        <label>End Location:</label>
        <input
          type="text"
          value={form.endLocation}
          onChange={e => handleLocationChange('endLocation', e.target.value, setEndLocationSuggestions)}
          required
        />
        {endLocationSuggestions.length > 0 && (
          <ul className="suggestions-list">
            {endLocationSuggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleSuggestionClick('endLocation', suggestion, setEndLocationSuggestions)}>
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <label>Trip Type:</label>
        <select
          value={form.tripType}
          onChange={e => handleChange('tripType', e.target.value as TripData['tripType'])}
        >
          <option value="road">Road Trip</option>
          <option value="flight">Flight</option>
        </select>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={form.roundTrip}
            onChange={e => handleChange('roundTrip', e.target.checked)}
          /> Return Trip
        </label>
      </div>
      <div>
        <label>Departure Date:</label>
        <input
          type="date"
          value={form.departureDate}
          onChange={e => handleChange('departureDate', e.target.value)}
          required
        />
        <input
          type="time"
          value={form.departureTime || ''}
          onChange={e => handleChange('departureTime', e.target.value)}
        />
      </div>
      {form.roundTrip && (
        <div>
          <label>Return Date:</label>
          <input
            type="date"
            value={form.returnDate || ''}
            onChange={e => handleChange('returnDate', e.target.value)}
          />
          <input
            type="time"
            value={form.returnTime || ''}
            onChange={e => handleChange('returnTime', e.target.value)}
          />
        </div>
      )}
      <div>
        <label>Passengers:</label>
        <input
          type="number"
          min={1}
          value={form.passengers}
          onChange={e => handleChange('passengers', Number(e.target.value))}
        />
      </div>
      {form.tripType === 'road' && (
        <div>
          <label>Vehicle MPG:</label>
          <input
            type="number"
            value={form.vehicleMpg || ''}
            onChange={e => handleChange('vehicleMpg', Number(e.target.value))}
          />
          <label>Fuel Type:</label>
          <input
            type="text"
            value={form.fuelType || ''}
            onChange={e => handleChange('fuelType', e.target.value)}
          />
        </div>
      )}
      {form.tripType === 'flight' && (
        <div>
          <label>Estimated Flight Cost (USD):</label>
          <input
            type="number"
            min={0}
            step={0.01}
            value={form.flightCost || ''}
            onChange={e => handleChange('flightCost', Number(e.target.value))}
          />
        </div>
      )}
      {form.roundTrip && (
        <div>
          <label>Estimated Accommodation Cost (USD):</label>
          <input
            type="number"
            min={0}
            step={0.01}
            value={form.accommodationCost || ''}
            onChange={e => handleChange('accommodationCost', Number(e.target.value))}
          />
        </div>
      )}
      <div>
        <label>Budget (USD):</label>
        <input
          type="number"
          value={form.budget || ''}
          onChange={e => handleChange('budget', Number(e.target.value))}
        />
      </div>
      <div>
        <label>Interests (comma separated):</label>
        <input
          type="text"
          value={form.interests.join(',')}
          onChange={e => handleChange('interests', e.target.value.split(',').map(s => s.trim()))}
        />
      </div>
      <div>
        <label>Dietary Restrictions (comma separated):</label>
        <input
          type="text"
          value={form.dietaryRestrictions.join(',')}
          onChange={e => handleChange('dietaryRestrictions', e.target.value.split(',').map(s => s.trim()))}
        />
      </div>
      <button type="submit">Plan Trip</button>
    </form>
  );
};

export default TripForm;
