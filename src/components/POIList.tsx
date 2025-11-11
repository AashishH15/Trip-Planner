import React from 'react';
import { POI } from '../services/poiService';

interface POIListProps {
  pois: POI[];
}

const POIList: React.FC<POIListProps> = ({ pois }) => {
  if (!pois || pois.length === 0) return null;
  return (
    <div>
      <h3>Points of Interest</h3>
      <ul>
        {pois.map((poi, idx) => (
          <li key={idx}>{poi.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default POIList;