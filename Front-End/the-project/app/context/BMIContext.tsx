"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// 1️⃣ تعريف نوع البيانات اللي هنتشاركها
interface BMIContextType {
  weight: number;
  height: number;
  bmi: number;
  setWeight: (w: number) => void;
  setHeight: (h: number) => void;
  setBmi: (b: number) => void;
  calculateBMI: () => void;
}

// 2️⃣ إنشاء Context
const BMIContext = createContext<BMIContextType | undefined>(undefined);

// 3️⃣ إنشاء Provider
interface BMIProviderProps {
  children: ReactNode;
}

export const BMIProvider = ({ children }: BMIProviderProps) => {
  const [weight, setWeight] = useState<number>(70); // الوزن بالكيلو
  const [height, setHeight] = useState<number>(1.7); // الطول بالمتر
  const [bmi, setBmi] = useState<number>(0);

  const calculateBMI = () => {
    if (height > 0) {
      const result = weight / (height * height);
      setBmi(parseFloat(result.toFixed(2)));
    }
  };

  return (
    <BMIContext.Provider
      value={{
        weight,
        height,
        bmi,
        setWeight,
        setHeight,
        setBmi,
        calculateBMI,
      }}
    >
      {children}
    </BMIContext.Provider>
  );
};

// 4️⃣ Hook جاهز للاستخدام في أي Component
export const useBMI = () => {
  const context = useContext(BMIContext);
  if (!context) {
    throw new Error("useBMI must be used within a BMIProvider");
  }
  return context;
};
