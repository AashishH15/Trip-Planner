import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { POI } from '../services/poiService';
import { LatLngExpression } from 'leaflet';

interface MapViewProps {
  startLocation?: [number, number];
  endLocation?: [number, number];
  waypoints?: [number, number][];
  pois?: POI[];
}

const MapView: React.FC<MapViewProps> = ({ startLocation, endLocation, waypoints, pois }) => {
  const center = startLocation || [0, 0];
  const route = waypoints || [];

  // Component to fit map to route bounds
  const FitBounds: React.FC<{ bounds: LatLngExpression[] }> = ({ bounds }) => {
    const map = useMap();
    React.useEffect(() => {
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }, [map, bounds]);
    return null;
  };

  return (
    <MapContainer id="map-canvas" center={center} zoom={6} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {startLocation && (
        <Marker position={startLocation}>
          <Popup>Start</Popup>
        </Marker>
      )}
      {endLocation && (
        <Marker position={endLocation}>
          <Popup>End</Popup>
        </Marker>
      )}
      {route.length > 1 && (
        <>
          <Polyline positions={[startLocation!, ...route, endLocation!]} color="blue" weight={5} />
          <FitBounds bounds={[startLocation!, ...route, endLocation!]} />
        </>
      )}
      {pois && pois.map((poi, idx) => (
        <Marker key={idx} position={poi.coords}>
          <Popup>{poi.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;