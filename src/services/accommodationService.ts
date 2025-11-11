import { TripData } from '../components/TripForm';

/**
 * Fetch or calculate accommodation cost for a trip.
 * Placeholder stub: integrate with Booking.com/Airbnb API or nightly budget.
 */
export async function getAccommodationCost(trip: TripData): Promise<number> {
  // If user provided manual estimate, use it
  if (trip.accommodationCost !== undefined) {
    return trip.accommodationCost;
  }
  // TODO: integrate with Booking.com/Airbnb API to fetch actual cost
  console.log('Fetching accommodation cost for trip', trip);
  return 0;
}