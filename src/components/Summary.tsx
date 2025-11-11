import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { TripData } from './TripForm';
import { parseISO, differenceInCalendarDays, format } from 'date-fns';
import { POI } from '../services/poiService';

interface SummaryProps {
  trip: TripData;
  costDetails: {
    flightCost?: number;
    fuelCost?: number;
    accommodationCost?: number;
    otherCosts?: number;
  };
  routeDuration?: number; // seconds
  pois?: POI[];
}

const Summary: React.FC<SummaryProps> = ({ trip, costDetails, routeDuration, pois }) => {
  // calculate trip duration in days
  let durationDisplay: string | null = null;
  if (trip.returnDate) {
    const dep = parseISO(trip.departureDate);
    const ret = parseISO(trip.returnDate);
    const days = differenceInCalendarDays(ret, dep) + 1;
    durationDisplay = `${days} day${days > 1 ? 's' : ''}`;
  }

  const handleDownload = async () => {
    // create PDF in landscape to fit map
    const doc = new jsPDF({ orientation: 'landscape' });
    // capture map as image
    const mapElem = document.getElementById('map-canvas');
    if (mapElem) {
      const canvas = await html2canvas(mapElem);
      const imgData = canvas.toDataURL('image/png');
      // add map image at top
      doc.addImage(imgData, 'PNG', 10, 10, 270, 100);
    }
    let y = 120;
    doc.setFontSize(16);
    doc.text('Trip Itinerary', 10, y);
    y += 10;
    // travel time
    if (routeDuration !== undefined) {
      const hrs = Math.floor(routeDuration / 3600);
      const mins = Math.floor((routeDuration % 3600) / 60);
      doc.text(`Travel Time: ${hrs}h ${mins}m`, 10, y);
      y += 10;
    }
    doc.setFontSize(12);
    doc.text(`From: ${trip.startLocation}`, 10, y);
    y += 8;
    doc.text(`To: ${trip.endLocation}`, 10, y);
    y += 8;
    doc.text(`Departure: ${trip.departureDate} ${trip.departureTime || ''}`, 10, y);
    y += 8;
    if (trip.returnDate) {
      doc.text(`Return: ${trip.returnDate} ${trip.returnTime || ''}`, 10, y);
      y += 8;
    }
    doc.text(`Passengers: ${trip.passengers}`, 10, y);
    y += 10;
    // cost details
    Object.entries(costDetails).forEach(([key, value]) => {
      if (value !== undefined) {
        doc.text(`${key}: $${value.toFixed(2)}`, 10, y);
        y += 8;
      }
    });
    // save PDF
    doc.save('itinerary.pdf');
  };

  return (
    <div>
      {/* Estimated travel time */}
      {routeDuration !== undefined && (
        <div>
          <h3>Estimated Travel Time</h3>
          <p>{`${Math.floor(routeDuration/3600)}h ${Math.floor((routeDuration%3600)/60)}m`}</p>
        </div>
      )}
      {durationDisplay && (
        <div>
          <h3>Trip Duration</h3>
          <p>{durationDisplay}</p>
        </div>
      )}
      <h2>Your Itinerary</h2>
      <ul>
        <li>From: {trip.startLocation}</li>
        <li>To: {trip.endLocation}</li>
        <li>Departure: {trip.departureDate} {trip.departureTime}</li>
        {trip.returnDate && <li>Return: {trip.returnDate} {trip.returnTime}</li>}
        <li>Passengers: {trip.passengers}</li>
      </ul>
      {/* placeholder lodging suggestions for multi-day road trips */}
      {trip.tripType === 'road' && durationDisplay && durationDisplay.includes('day') && Number(durationDisplay) > 1 && (
        <div>
          <h3>Lodging Stops</h3>
          <p>Consider booking hotels or campgrounds along your route.</p>
        </div>
      )}
      <h3>Cost Summary</h3>
      <ul>
        {costDetails.flightCost !== undefined && <li>Flight: ${costDetails.flightCost.toFixed(2)}</li>}
        {costDetails.fuelCost !== undefined && <li>Fuel: ${costDetails.fuelCost.toFixed(2)}</li>}
        {costDetails.accommodationCost !== undefined && <li>Accommodation: ${costDetails.accommodationCost.toFixed(2)}</li>}
        {costDetails.otherCosts !== undefined && <li>Other: ${costDetails.otherCosts.toFixed(2)}</li>}
      </ul>
      {trip.budget !== undefined && (
        <div>
          <h3>Budget</h3>
          <p>${trip.budget.toFixed(2)}</p>
        </div>
      )}
      {trip.interests.length > 0 && (
        <div>
          <h3>Interests</h3>
          <ul>
            {trip.interests.map((interest, idx) => (
              <li key={idx}>{interest}</li>
            ))}
          </ul>
        </div>
      )}
      {trip.dietaryRestrictions.length > 0 && (
        <div>
          <h3>Dietary Restrictions</h3>
          <ul>
            {trip.dietaryRestrictions.map((diet, idx) => (
              <li key={idx}>{diet}</li>
            ))}
          </ul>
        </div>
      )}
      {/* POI attractions */}
      {pois && pois.length > 0 && (
        <div>
          <h3>Attractions Along the Route</h3>
          <ul>
            {pois.map((poi, i) => (
              <li key={i}>{poi.name}</li>
            ))}
          </ul>
        </div>
      )}
      <button onClick={handleDownload}>Download PDF</button>
    </div>
  );
};

export default Summary;