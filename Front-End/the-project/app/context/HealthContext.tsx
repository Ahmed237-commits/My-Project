"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useSession } from "next-auth/react";

interface HealthData {
    caloriesToday: number;
    proteinToday: number;
    workoutProgress: number;
}

interface HealthContextType {
    healthData: HealthData;
    refreshHealthData: () => Promise<void>;
}

const initialHealthData: HealthData = {
    caloriesToday: 0,
    proteinToday: 0,
    workoutProgress: 0,
};

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider = ({ children }: { children: ReactNode }) => {
    const { data: session } = useSession();
    const [healthData, setHealthData] = useState<HealthData>(initialHealthData);

    const refreshHealthData = useCallback(async () => {
        if (session?.user?.email) {
            try {
                const res = await fetch(`http://localhost:8000/api/daily-intake/today?email=${session.user.email}`);
                const apiData = await res.json();
                if (apiData && !apiData.error) {
                    setHealthData((prev) => ({
                        ...prev,
                        caloriesToday: apiData.totalCalories,
                        proteinToday: apiData.totalProtein,
                    }));
                }
            } catch (err) {
                console.error("Failed to fetch daily intake:", err);
            }
        }
    }, [session?.user?.email]);

    useEffect(() => {
        refreshHealthData();
    }, [refreshHealthData]);

    return (
        <HealthContext.Provider value={{ healthData, refreshHealthData }}>
            {children}
        </HealthContext.Provider>
    );
};

export const useHealth = () => {
    const context = useContext(HealthContext);
    if (!context) {
        throw new Error("useHealth must be used within a HealthProvider");
    }
    return context;
};
