import { useState, useEffect } from 'react';
import { ItineraryData } from '@/app/types/itinerary';
import { saveItinerary, loadItinerary, clearItinerary } from '@/app/lib/storage';

const initialItinerary: ItineraryData = {
  basicDetails: {
    refCode: '',
    country: '',
    tripType: 'Independent',
    numTravelers: 2,
    startDate: ''
  },
  cities: [],
  days: []
};

export const useItinerary = () => {
  const [itinerary, setItinerary] = useState<ItineraryData>(initialItinerary);

  // Load from storage on mount
  useEffect(() => {
    const saved = loadItinerary();
    if (saved) {
      setItinerary(saved);
    }
  }, []);

  // Save to storage on change
  useEffect(() => {
    saveItinerary(itinerary);
  }, [itinerary]);

  const updateBasicDetails = (details: Partial<ItineraryData['basicDetails']>) => {
    setItinerary(prev => ({
      ...prev,
      basicDetails: { ...prev.basicDetails, ...details }
    }));
  };

  const updateCities = (cities: ItineraryData['cities']) => {
    setItinerary(prev => ({ ...prev, cities }));
  };

  const updateDays = (days: ItineraryData['days']) => {
    setItinerary(prev => ({ ...prev, days }));
  };

  const resetItinerary = () => {
    clearItinerary();
    setItinerary(initialItinerary);
  };

  return {
    itinerary,
    setItinerary,
    updateBasicDetails,
    updateCities,
    updateDays,
    resetItinerary
  };
};