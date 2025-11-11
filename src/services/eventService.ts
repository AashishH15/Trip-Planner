import { TripData } from '../components/TripForm';
import { parseISO, getMonth } from 'date-fns';

/**
 * Fetch or calculate event suggestions based on trip dates and locations.
 * Currently returns placeholder suggestions based on departure month.
 */
export async function getEventSuggestions(trip: TripData): Promise<string[]> {
  const suggestions: string[] = [];
  try {
    const date = parseISO(trip.departureDate);
    const month = getMonth(date); // 0 = Jan, 11 = Dec
    // seasonal events
    if (month >= 5 && month <= 7) suggestions.push('Summer Music Festival');
    if (month === 11 || month === 0) suggestions.push('Holiday Market');
    // general suggestions
    suggestions.push('Visit the Local Museum', 'Try the Best-rated Cafe');
  } catch {
    // fallback suggestions
    suggestions.push('Visit Main Square', 'Check out local walking tour');
  }
  return suggestions;
}