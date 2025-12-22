'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TrackerContextType {
  Tracker: number | null;
  setTracker: (Tracker: number | null) => void;
}

const TrackingContext = createContext<TrackerContextType | undefined>(undefined);

interface TrackerProviderProps {
  children: ReactNode;
}

export const TrackerProvider = ({ children }: TrackerProviderProps) => {
  const [Tracker, setTracker] = useState<number | null>(null);

  return (
    <TrackingContext.Provider value={{ Tracker, setTracker }}>
      {children}
    </TrackingContext.Provider>
  );
};

// Custom hook for easy access
export const useTracker = () => {
  const context = useContext(TrackingContext);
  if (!context) {   
    throw new Error('useTracker must be used within a TrackerProvider');
  }
  return context;
};
