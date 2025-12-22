"use client";
import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { FaBed, FaSun, FaMoon, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

export default function SleepCalculator() {
    const { theme } = useTheme();
    const [wakeTime, setWakeTime] = useState("");
    const [sleepTime, setSleepTime] = useState<string[]>([]);
    const [calculatedWakeTimes, setCalculatedWakeTimes] = useState<string[]>([]);

    const calculateSleepTimes = () => {
        if (!wakeTime) return;

        const [hours, minutes] = wakeTime.split(":").map(Number);
        const wakeDate = new Date();
        wakeDate.setHours(hours, minutes, 0);

        // Calculate 6, 5, 4, 3 cycles backwards (90 mins each)
        // 6 cycles = 9 hours
        // 5 cycles = 7.5 hours
        // 4 cycles = 6 hours
        const cycles = [6, 5, 4];
        const times: string[] = [];

        cycles.forEach(cycle => {
            const sleepDate = new Date(wakeDate.getTime() - (cycle * 90 * 60 * 1000));
            times.push(sleepDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        });

        setSleepTime(times.reverse()); // Show earliest to latest
        setCalculatedWakeTimes([]);
    };

    const calculateWakeTimes = () => {
        const now = new Date();
        const cycles = [4, 5, 6]; // 6h, 7.5h, 9h
        const times: string[] = [];

        cycles.forEach(cycle => {
            const wakeDate = new Date(now.getTime() + (cycle * 90 * 60 * 1000) + (14 * 60 * 1000)); // +14 mins to fall asleep
            times.push(wakeDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        });

        setCalculatedWakeTimes(times);
        setSleepTime([]);
    };

    return (
        <div className={`min-h-screen p-8 transition-colors duration-500 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
            <Link href="/dashBoard" className="flex items-center mb-6 text-blue-500 hover:underline">
                <FaArrowLeft className="mr-2" /> Back to Dashboard
            </Link>

            <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl  mb-8 flex items-center">
                    <FaBed className="mr-4 text-purple-500" /> Sleep Calculator
                </h1>

                <div className={`p-8 rounded-2xl shadow-lg mb-8 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                    <h2 className="text-2xl  mb-4">I want to wake up at...</h2>
                    <div className="flex gap-4 mb-6">
                        <input
                            type="time"
                            value={wakeTime}
                            onChange={(e) => setWakeTime(e.target.value)}
                            className={`p-3 rounded-lg w-full border ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-300"}`}
                        />
                        <button
                            onClick={calculateSleepTimes}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
                        >
                            Calculate
                        </button>
                    </div>

                    {sleepTime.length > 0 && (
                        <div className="animate-fade-in">
                            <p className="mb-4 text-lg">You should try to fall asleep at one of these times:</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {sleepTime.map((time, index) => (
                                    <div key={index} className={`p-4 rounded-xl text-center border-2 ${index === 2 ? "border-green-500 bg-green-500/10" : "border-purple-500/30"}`}>
                                        <div className="text-2xl">{time}</div>
                                        <div className="text-sm opacity-70">{index === 2 ? "Recommended (9h)" : index === 1 ? "Good (7.5h)" : "Minimum (6h)"}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className={`p-8 rounded-2xl shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                    <h2 className="text-2xl mb-4">I am going to sleep now</h2>
                    <p className="mb-6 opacity-80">If you head to bed right now, you should wake up at...</p>

                    <button
                        onClick={calculateWakeTimes}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg  transition-colors mb-6 flex items-center justify-center"
                    >
                        <FaMoon className="mr-2" /> Calculate Wake Up Time
                    </button>

                    {calculatedWakeTimes.length > 0 && (
                        <div className="animate-fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {calculatedWakeTimes.map((time, index) => (
                                    <div key={index} className={`p-4 rounded-xl text-center border-2 ${index === 1 ? "border-green-500 bg-green-500/10" : "border-blue-500/30"}`}>
                                        <div className="text-2xl">{time}</div>
                                        <div className="text-sm opacity-70">{index === 2 ? "9 hours" : index === 1 ? "7.5 hours" : "6 hours"}</div>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-4 text-sm opacity-60 text-center">* Includes 14 minutes to fall asleep</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
