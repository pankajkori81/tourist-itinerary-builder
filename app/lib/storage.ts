import { ItineraryData } from '@/app/types/itinerary';

const STORAGE_KEY = 'tourism-itinerary';

export const saveItinerary = (data: ItineraryData): void => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving itinerary:', error);
  }
};

export const loadItinerary = (): ItineraryData | null => {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Error loading itinerary:', error);
    return null;
  }
};

export const clearItinerary = (): void => {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing itinerary:', error);
  }
};