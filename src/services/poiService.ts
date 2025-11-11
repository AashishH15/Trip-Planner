import axios from 'axios';

export interface POI {
  name: string;
  coords: [number, number];
}

/**
 * Search for specified POI category along a route bounding box using Overpass API.
 * Category should match OSM tag values, e.g., 'miniature_golf'.
 */
export async function searchPOIs(category: string, routeCoords: [number, number][]): Promise<POI[]> {
  if (!routeCoords.length) return [];
  const maxResults = 5;
  // sample up to 5 points along the route
  const step = Math.max(1, Math.floor(routeCoords.length / maxResults));
  const samples = routeCoords.filter((_, idx) => idx % step === 0).slice(0, maxResults);
  // build Overpass query with around search for each sample
  const clauses: string[] = [];
  samples.forEach(([lat, lon]) => {
    clauses.push(
      `node["leisure"="${category}"](around:5000,${lat},${lon});`,
      `way["leisure"="${category}"](around:5000,${lat},${lon});`,
      `relation["leisure"="${category}"](around:5000,${lat},${lon});`,
      `node["sport"="${category}"](around:5000,${lat},${lon});`,
      `way["sport"="${category}"](around:5000,${lat},${lon});`,
      `relation["sport"="${category}"](around:5000,${lat},${lon});`
    );
  });
  const query = `
    [out:json][timeout:25];
    (
      ${clauses.join('\n      ')}
    );
    out center;`;
  try {
    const res = await axios.post('https://overpass-api.de/api/interpreter', `data=${encodeURIComponent(query)}`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    const elements = res.data.elements || [];
    console.log(`POI search fetched ${elements.length} elements for category ${category}`);
    // dedupe by ﬁrst occurrence of name+coords
    const seen = new Set<string>();
    return elements.map((el: any) => {
      const lat = el.lat ?? el.center?.lat;
      const lon = el.lon ?? el.center?.lon;
      const name = el.tags?.name || category;
      const key = `${name}:${lat.toFixed(5)},${lon.toFixed(5)}`;
      return { name, coords: [lat, lon] };
    }).filter(poi => {
      const key = `${poi.name}:${poi.coords[0].toFixed(5)},${poi.coords[1].toFixed(5)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  } catch (error) {
    console.error('POI search error', error);
    return [];
  }
}