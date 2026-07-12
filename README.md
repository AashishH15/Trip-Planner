# Trip Planner

React + TypeScript road-trip planner with interactive maps, route costing, POI search, and event suggestions.

## Features

- Plan **road** or **flight** trips between two locations
- Geocode addresses via OpenStreetMap Nominatim
- Driving routes via OSRM with duration estimates
- Fuel, accommodation, and flight cost estimates
- Leaflet map with route overlay
- POI search along the route (e.g. miniature golf)
- Local event suggestions for the destination
- Export trip summary to PDF

## Requirements

- Node.js 18+
- npm

No API keys required for the default setup (uses free OSM / OSRM public endpoints).

## Run locally

```bash
git clone https://github.com/AashishH15/Trip-Planner.git
cd Trip-Planner
npm install
npm run dev
```

Open the printed URL (default http://localhost:5173).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Typecheck + production build |
| `npm run lint` | ESLint |
| `npm run preview` | Preview production build |

## Project structure

```
src/
  components/   # TripForm, MapView, Summary, POIList, EventSuggestions
  services/     # geocode, routing, fuel, flights, accommodation, POI, events
```

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Geocoding fails | Check spelling; Nominatim rate-limits heavy use |
| No route found | Verify start/end are drivable locations; OSRM may fail on invalid coords |
| Blank map | Ensure `npm install` completed; check browser console for Leaflet errors |
| Flight/accommodation costs look stubbed | `flightService.ts` and `accommodationService.ts` use placeholder estimates until external APIs are integrated |

## Author

**Aashish Harishchandre** — [Portfolio](https://aashishharishchandre.netlify.app/)
