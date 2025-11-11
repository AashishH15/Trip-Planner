import axios from 'axios';

export interface RouteData {
  coordinates: [number, number][];
  duration: number; // in seconds
}

/**
 * Retrieve route coordinates and duration between two points using OSRM.
 */
export async function getRouteData(
  start: [number, number],
  end: [number, number]
): Promise<RouteData> {
  const [lat1, lon1] = start;
  const [lat2, lon2] = end;
  const url = `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}`;
  const res = await axios.get(url, {
    params: { overview: 'full', geometries: 'geojson' }
  });
  const route = res.data.routes?.[0];
  if (!route) throw new Error('No route found');

  const coordinates: [number, number][] = route.geometry.coordinates.map(([lon, lat]: [number, number]) => [lat, lon]);
  const duration: number = route.duration; // in seconds

  return { coordinates, duration };
}