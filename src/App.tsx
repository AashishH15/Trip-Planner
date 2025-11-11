import React, { useState } from 'react';
import './index.css';
import './App.css';
import TripForm, { TripData } from './components/TripForm';
import MapView from './components/MapView';
import Summary from './components/Summary';
import { calculateFuelCost } from './services/fuelService';
import { getFlightCost } from './services/flightService';
import { getAccommodationCost } from './services/accommodationService';
import { getEventSuggestions } from './services/eventService';
import { geocodeAddress } from './services/geocodeService';
import EventSuggestions from './components/EventSuggestions';
import { getRouteData } from './services/routingService';
import { searchPOIs, POI } from './services/poiService';
import POIList from './components/POIList';

const App: React.FC = () => {
  const [trip, setTrip] = useState<TripData | null>(null);
  const [costDetails, setCostDetails] = useState<{
    flightCost?: number;
    fuelCost?: number;
    accommodationCost?: number;
    otherCosts?: number;
  }>({});
  const [waypoints, setWaypoints] = useState<[number, number][]>([]);
  const [startCoords, setStartCoords] = useState<[number, number] | null>(null);
  const [endCoords, setEndCoords] = useState<[number, number] | null>(null);
  const [events, setEvents] = useState<string[]>([]);
  const [pois, setPois] = useState<POI[]>([]);
  const [routeDuration, setRouteDuration] = useState<number | null>(null);

  const handlePlan = async (data: TripData) => {
    setTrip(data);
    // geocode addresses
    const start = await geocodeAddress(data.startLocation);
    const end = await geocodeAddress(data.endLocation);
    setStartCoords(start);
    setEndCoords(end);
    // fetch route data
    let routeCoords: [number, number][] = [];
    try {
      const routeData = await getRouteData(start, end);
      routeCoords = routeData.coordinates;
      setRouteDuration(routeData.duration);
      setWaypoints(routeCoords);
    } catch (err) {
      console.error('Error fetching route:', err);
      setWaypoints([]);
      setRouteDuration(null);
    }
    // POI search for interests (e.g., mini golf)
    if (data.interests.some(i => /mini\s*-?\s*golf/i.test(i))) {
      const found = await searchPOIs('miniature_golf', routeCoords);
      setPois(found);
    } else {
      setPois([]);
    }
    if (data.tripType === 'road') {
      const fuelCost = await calculateFuelCost(data);
      const accommodationCost = await getAccommodationCost(data);
      setCostDetails({ fuelCost, accommodationCost });
    } else {
      const flightCost = await getFlightCost(data);
      const accommodationCost = await getAccommodationCost(data);
      setCostDetails({ flightCost, accommodationCost });
    }
    // fetch event suggestions
    const suggested = await getEventSuggestions(data);
    setEvents(suggested);
  };

  const handleReset = () => {
    setTrip(null);
    setCostDetails({});
    setWaypoints([]);
    setStartCoords(null);
    setEndCoords(null);
    setEvents([]);
    setPois([]);
    setRouteDuration(null);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Trip Planner</h1>
        {trip && <button onClick={handleReset}>New Trip</button>}
      </header>
      {!trip && <TripForm onSubmit={handlePlan} />}
      {trip && (
        <div className="main-content">
          <div className="map-panel">
            <MapView
              startLocation={startCoords || undefined}
              endLocation={endCoords || undefined}
              waypoints={waypoints}
              pois={pois}
            />
          </div>
          <div className="sidebar">
            <Summary trip={trip} costDetails={costDetails} routeDuration={routeDuration} pois={pois} />
            <EventSuggestions events={events} />
            <POIList pois={pois} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
