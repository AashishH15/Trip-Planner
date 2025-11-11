import axios from 'axios';

/**
 * Search for address suggestions using OSM Nominatim.
 * Returns an array of display names.
 */
export async function searchAddress(query: string): Promise<string[]> {
  if (!query) return [];
  const res = await axios.get('https://nominatim.openstreetmap.org/search', {
    params: { q: query, format: 'json', limit: 5 }
  });
  const data = res.data;
  if (Array.isArray(data)) {
    return data.map((item: any) => item.display_name);
  }
  return [];
}