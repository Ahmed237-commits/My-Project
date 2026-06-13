"use client";

import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { FaBed, FaMoon, FaArrowLeft, FaInfoCircle, FaRegClock } from "react-icons/fa";
import Link from "next/link";

export default function SleepCalculator() {
    const { theme } = useTheme();
    const [wakeTime, setWakeTime] = useState("");
    const [sleepTimes, setSleepTimes] = useState<string[]>([]);
    const [calculatedWakeTimes, setCalculatedWakeTimes] = useState<string[]>([]);

    const calculateSleepTimes = () => {
        if (!wakeTime) return;

        const [hours, minutes] = wakeTime.split(":").map(Number);
        const wakeDate = new Date();
        wakeDate.setHours(hours, minutes, 0);

        // Calculate 6, 5, 4 cycles backwards (90 mins each)
        const cycles = [6, 5, 4];
        const times: string[] = [];

        cycles.forEach(cycle => {
            const sleepDate = new Date(wakeDate.getTime() - (cycle * 90 * 60 * 1000));
            times.push(sleepDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        });

        setSleepTimes(times.reverse()); // Show earliest to latest
        setCalculatedWakeTimes([]);
    };

    const calculateWakeTimes = () => {
        const now = new Date();
        const cycles = [4, 5, 6]; // 6h, 7.5h, 9h
        const times: string[] = [];

        cycles.forEach(cycle => {
            // Includes 14 minutes average to fall asleep
            const wakeDate = new Date(now.getTime() + (cycle * 90 * 60 * 1000) + (14 * 60 * 1000)); 
            times.push(wakeDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        });

        setCalculatedWakeTimes(times);
        setSleepTimes([]);
    };

    return (
        <>
            <style>{`
                .sleep-container {
                    background: var(--clr-bg, #fdfaf6);
                    color: var(--clr-text, #2d1f14);
                }
                .calc-card {
                    background: var(--clr-surface, #fff);
                    border: 1.5px solid var(--clr-border, #ecddd0);
                    border-radius: var(--radius-xl, 1.5rem);
                }
                .input-time {
                    border: 1.5px solid var(--clr-border, #ecddd0);
                    background: var(--clr-surface, #fff);
                    color: var(--clr-text, #2d1f14);
                    transition: border-color 200ms;
                }
                .input-time:focus {
                    outline: none;
                    border-color: var(--clr-accent, #c8956c);
                }
                .action-btn {
                    background: var(--clr-accent, #c8956c);
                    color: #fff;
                    transition: background 200ms, transform 200ms;
                }
                .action-btn:hover {
                    background: var(--clr-accent-hov, #b5794e);
                    transform: translateY(-1px);
                }
                .result-box {
                    border: 1.5px solid var(--clr-border, #ecddd0);
                    border-radius: 1rem;
                    background: var(--clr-bg, #fdfaf6);
                    transition: border-color 250ms;
                }
                .result-box.recommended {
                    border-color: var(--clr-accent, #c8956c);
                    background: var(--clr-accent-soft, #f5e6d8);
                }
                .section-divider {
                    width: 3rem;
                    height: 3px;
                    border-radius: 9px;
                    background: var(--clr-accent, #c8956c);
                    margin: 1rem auto 0;
                }
            `}</style>

            <div className="sleep-container min-h-screen px-6 py-16 font-normal">
                {/* Back Link */}
                <div className="max-w-2xl mx-auto mb-8">
                    <Link 
                        href="/dashBoard" 
                        className="inline-flex items-center text-base transition-colors hover:opacity-80"
                        style={{ color: "var(--clr-accent, #c8956c)" }}
                    >
                        <FaArrowLeft className="mr-2 text-xs" /> Back to Dashboard
                    </Link>
                </div>

                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <p
                            className="text-sm uppercase tracking-widest mb-3 font-normal"
                            style={{ color: "var(--clr-accent, #c8956c)" }}
                        >
                            Optimal Rest Cycles
                        </p>
                        <h1 
                            className="text-4xl md:text-5xl font-normal mb-4 flex items-center justify-center gap-3"
                            style={{ color: "var(--clr-primary, #4a3b2f)" }}
                        >
                            <FaBed className="text-2xl" style={{ color: "var(--clr-accent, #c8956c)" }} /> Sleep Calculator
                        </h1>
                        <div className="section-divider" />
                    </div>

                    {/* Module 1: Wake Up Target */}
                    <div className="calc-card p-8 mb-8 shadow-sm">
                        <h2 className="text-xl font-normal mb-4 flex items-center gap-2" style={{ color: "var(--clr-primary, #4a3b2f)" }}>
                            <FaRegClock style={{ color: "var(--clr-accent, #c8956c)" }} /> I want to wake up at...
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <input
                                type="time"
                                value={wakeTime}
                                onChange={(e) => setWakeTime(e.target.value)}
                                className="input-time p-3 rounded-xl flex-1 text-base font-normal"
                            />
                            <button
                                onClick={calculateSleepTimes}
                                className="action-btn px-6 py-3 rounded-xl text-base font-normal whitespace-nowrap"
                            >
                                Calculate Sleep Times
                            </button>
                        </div>

                        {sleepTimes.length > 0 && (
                            <div className="animate-fade-in">
                                <p className="mb-4 text-base font-normal" style={{ color: "var(--clr-text-muted, #6b5c50)" }}>
                                    To wake up refreshed, try falling asleep at one of these times:
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {sleepTimes.map((time, index) => (
                                        <div 
                                            key={index} 
                                            className={`result-box p-4 text-center ${index === 2 ? "recommended" : ""}`}
                                        >
                                            <div className="text-2xl font-normal" style={{ color: "var(--clr-primary, #4a3b2f)" }}>
                                                {time}
                                            </div>
                                            <div className="text-xs mt-1 font-normal" style={{ color: "var(--clr-text-muted, #6b5c50)" }}>
                                                {index === 2 ? "Recommended (9h)" : index === 1 ? "Good (7.5h)" : "Minimum (6h)"}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Module 2: Sleep Right Now */}
                    <div className="calc-card p-8 mb-8 shadow-sm">
                        <h2 className="text-xl font-normal mb-2" style={{ color: "var(--clr-primary, #4a3b2f)" }}>
                            Going to sleep now?
                        </h2>
                        <p className="mb-6 text-sm font-normal" style={{ color: "var(--clr-text-muted, #6b5c50)" }}>
                            If you head to bed right this second, find the ideal time slots to catch your morning alarm.
                        </p>

                        <button
                            onClick={calculateWakeTimes}
                            className="action-btn w-full py-4 rounded-xl text-base font-normal flex items-center justify-center gap-2"
                        >
                            <FaMoon className="text-sm" /> Calculate Wake Up Times
                        </button>

                        {calculatedWakeTimes.length > 0 && (
                            <div className="animate-fade-in mt-6">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {calculatedWakeTimes.map((time, index) => (
                                        <div 
                                            key={index} 
                                            className={`result-box p-4 text-center ${index === 1 ? "recommended" : ""}`}
                                        >
                                            <div className="text-2xl font-normal" style={{ color: "var(--clr-primary, #4a3b2f)" }}>
                                                {time}
                                            </div>
                                            <div className="text-xs mt-1 font-normal" style={{ color: "var(--clr-text-muted, #6b5c50)" }}>
                                                {index === 2 ? "9 Hours Sleep" : index === 1 ? "7.5 Hours Sleep" : "6 Hours Sleep"}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-4 text-xs font-normal text-center opacity-70" style={{ color: "var(--clr-text-muted, #6b5c50)" }}>
                                    * Calculations include an added 14 minutes to account for natural sleep latency.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Tip Section */}
                    <div 
                        className="p-5 rounded-2xl border flex gap-3 items-start"
                        style={{ background: "var(--clr-accent-soft, #f5e6d8)", borderColor: "var(--clr-border, #ecddd0)" }}
                    >
                        <FaInfoCircle className="mt-0.5 shrink-0" style={{ color: "var(--clr-accent, #c8956c)" }} size={18} />
                        <div>
                            <p className="text-sm font-normal leading-relaxed" style={{ color: "var(--clr-primary, #4a3b2f)" }}>
                                Waking up at the end of a natural 90-minute sleep cycle prevents morning grogginess and sleep inertia. For optimal recovery, clear your screens 30 minutes before resting.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}