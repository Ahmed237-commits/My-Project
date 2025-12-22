'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BMIContextType {
  bmi: number | null;
  setBmi: (bmi: number | null) => void;
}

const BMIContext = createContext<BMIContextType | undefined>(undefined);

interface BMIProviderProps {
  children: ReactNode;
}

export const BMIProvider = ({ children }: BMIProviderProps) => {
  const [bmi, setBmi] = useState<number | null>(null);

  return (
    <BMIContext.Provider value={{ bmi, setBmi }}>
      {children}
    </BMIContext.Provider>
  );
};

// Custom hook for easy access
export const useBMI = () => {
  const context = useContext(BMIContext);
  if (!context) {
    throw new Error('useBMI must be used within a BMIProvider');
  }
  return context;
};