import { TripData } from '../components/TripForm';

/**
 * Fetch or calculate flight cost for a trip.
 * Placeholder stub: integrate with Google Flights API or manual input.
 */
export async function getFlightCost(trip: TripData): Promise<number> {
  // If user provided manual estimate, use it
  if (trip.flightCost !== undefined) {
    return trip.flightCost;
  }
  // TODO: integrate with Google Flights API to fetch actual cost
  console.log('Fetching flight cost for trip', trip);
  return 0;
}