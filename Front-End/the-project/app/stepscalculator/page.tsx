"use client";
import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { FaWalking, FaFire, FaRuler, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

export default function StepsCalculator() {
    const { theme } = useTheme();
    const [steps, setSteps] = useState("");
    const [weight, setWeight] = useState(""); // in kg
    const [height, setHeight] = useState(""); // in cm
    const [results, setResults] = useState<{ calories: number; distance: number } | null>(null);

    const calculate = () => {
        const stepsNum = parseFloat(steps);
        const weightNum = parseFloat(weight) || 70;
        const heightNum = parseFloat(height) || 170;

        if (!stepsNum) return;
        const strideLengthCm = heightNum * 0.414;
        const distanceKm = (stepsNum * strideLengthCm) / 100000;

        const timeHours = distanceKm / 5;
        const calories = 3.5 * weightNum * timeHours;

        setResults({
            calories: Math.round(calories),
            distance: parseFloat(distanceKm.toFixed(2)),
        });
    };

    return (
        <div className={`min-h-screen p-8 transition-colors duration-500 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
            <Link href="/dashBoard" className="flex items-center mb-6 text-blue-500 hover:underline">
                <FaArrowLeft className="mr-2" /> Back to Dashboard
            </Link>

            <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl mb-8 flex items-center">
                    <FaWalking className="mr-4 text-green-500" /> Steps Calculator
                </h1>

                <div className={`p-8 rounded-2xl shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block mb-2">Steps Walked</label>
                            <input
                                type="number"
                                value={steps}
                                onChange={(e) => setSteps(e.target.value)}
                                placeholder="e.g. 10000"
                                className={`p-3 rounded-lg w-full border ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-300"}`}
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Weight (kg) <span className="text-xs opacity-60">(Optional)</span></label>
                            <input
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                placeholder="e.g. 70"
                                className={`p-3 rounded-lg w-full border ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-300"}`}
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Height (cm) <span className="text-xs opacity-60">(Optional)</span></label>
                            <input
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                placeholder="e.g. 175"
                                className={`p-3 rounded-lg w-full border ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-300"}`}
                            />
                        </div>
                    </div>

                    <button
                        onClick={calculate}
                        className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg transition-colors mb-8"
                    >
                        Calculate Results
                    </button>

                    {results && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                            <div className={`p-6 rounded-xl flex items-center ${theme === "dark" ? "bg-gray-700" : "bg-orange-50"}`}>
                                <FaFire className="text-4xl text-orange-500 mr-4" />
                                <div>
                                    <div className="text-3xl">{results.calories}</div>
                                    <div className="text-sm opacity-70">Calories Burned</div>
                                </div>
                            </div>
                            <div className={`p-6 rounded-xl flex items-center ${theme === "dark" ? "bg-gray-700" : "bg-blue-50"}`}>
                                <FaRuler className="text-4xl text-blue-500 mr-4" />
                                <div>
                                    <div className="text-3xl">{results.distance} km</div>
                                    <div className="text-sm opacity-70">Distance Walked</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
