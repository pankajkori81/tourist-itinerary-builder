



"use client";

import React, { useEffect } from 'react';
import { useDashboardUI } from '@/app/context/DashboardUIContext';
import { ItineraryProvider } from '@/app/context/ItineraryContext';
import { SRMProvider } from '@/app/context/SRMContext'; // 1. Import SRMProvider
import ItineraryBuilderWrapper from '@/components/itinerary/ItineraryBuilderWrapper';

export default function ItineraryLayout({ children }: { children: React.ReactNode }) {
  const { setSidebarCollapsed } = useDashboardUI();

  // Force Global Sidebar to collapse when entering Itinerary Builder
  useEffect(() => {
    setSidebarCollapsed(true);
    return () => setSidebarCollapsed(false);
  }, [setSidebarCollapsed]);

  return (
    // 2. Wrap everything with SRMProvider so ActivityForm can access the database
    <SRMProvider>
      <ItineraryProvider>
        <ItineraryBuilderWrapper>
          {children}
        </ItineraryBuilderWrapper>
      </ItineraryProvider>
    </SRMProvider>
  );
}