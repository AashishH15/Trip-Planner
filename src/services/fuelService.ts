import axios from 'axios';
import { TripData } from '../components/TripForm';
import { geocodeAddress } from './geocodeService';

// average fuel price in USD per gallon (can be made dynamic later)
const AVERAGE_FUEL_PRICE = 3.5;

/**
 * Calculate estimated fuel cost for a road trip.
 * Placeholder stub: integrate with fueleconomy.gov trip API.
 */
export async function calculateFuelCost(trip: TripData): Promise<number> {
  // geocode origin and destination
  const start = await geocodeAddress(trip.startLocation);
  const end = await geocodeAddress(trip.endLocation);

  // fetch driving route distance from OSRM
  const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}`;
  const res = await axios.get(url, { params: { overview: 'false' } });
  const distanceMeters = res.data.routes?.[0]?.distance;
  if (!distanceMeters || !trip.vehicleMpg) return 0;

  // convert meters to miles and calculate gallons
  const distanceMiles = distanceMeters * 0.000621371;
  const gallons = distanceMiles / trip.vehicleMpg;

  // compute cost
  return gallons * AVERAGE_FUEL_PRICE;
}