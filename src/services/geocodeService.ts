import axios from 'axios';

/**
 * Geocode an address to latitude and longitude using OSM Nominatim.
 */
export async function geocodeAddress(address: string): Promise<[number, number]> {
  const res = await axios.get('https://nominatim.openstreetmap.org/search', {
    params: { q: address, format: 'json', limit: 1 }
  });
  const data = res.data;
  if (Array.isArray(data) && data.length > 0) {
    const { lat, lon } = data[0];
    return [parseFloat(lat), parseFloat(lon)];
  }
  throw new Error(`Unable to geocode address: ${address}`);
}