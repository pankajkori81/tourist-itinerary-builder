"use client";

import React, { createContext, useContext, useState } from 'react';

interface DashboardUIContextType {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (value: boolean) => void;
}

const DashboardUIContext = createContext<DashboardUIContextType | undefined>(undefined);

export function DashboardUIProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);
  const setSidebarCollapsed = (value: boolean) => setIsCollapsed(value);

  return (
    <DashboardUIContext.Provider value={{ isSidebarCollapsed, toggleSidebar, setSidebarCollapsed }}>
      {children}
    </DashboardUIContext.Provider>
  );
}

export function useDashboardUI() {
  const context = useContext(DashboardUIContext);
  if (!context) throw new Error('useDashboardUI must be used within DashboardUIProvider');
  return context;
}