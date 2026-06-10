"use client";

import React, { useState, useEffect } from "react";
import { FaWalking, FaFire, FaRuler, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import sal from "sal.js";
// @ts-ignore
import "sal.js/dist/sal.css";
import { useTheme } from "../context/ThemeContext";

export default function StepsCalculator() {
  const { theme } = useTheme();
  const [steps, setSteps] = useState<string>("");
  const [weight, setWeight] = useState<string>(""); // in kg
  const [height, setHeight] = useState<string>(""); // in cm
  const [results, setResults] = useState<{ calories: number; distance: number } | null>(null);

  useEffect(() => {
    sal({ threshold: 0.1, once: true, root: null });
  }, []);

  const calculate = () => {
    const stepsNum = parseFloat(steps);
    const weightNum = parseFloat(weight) || 70;
    const heightNum = parseFloat(height) || 170;

    if (!stepsNum || stepsNum <= 0) {
      setResults(null);
      return;
    }

    const strideLengthCm = heightNum * 0.414;
    const distanceKm = (stepsNum * strideLengthCm) / 100000;
    const timeHours = distanceKm / 5;
    const calories = 3.5 * weightNum * timeHours;

    setResults({
      calories: Math.round(calories),
      distance: parseFloat(distanceKm.toFixed(2)),
    });
  };

  // حساب تلقائي وتحديث حيّ للنتائج عند إدخال البيانات
  useEffect(() => {
    calculate();
  }, [steps, weight, height]);

  return (
    <>
      <style>{`
        .calculator-section {
          background: var(--clr-bg, #fdfaf6);
          color:      var(--clr-text, #2d1f14);
        }

        .calc-container {
          background:    var(--clr-surface, #fff);
          border:        1.5px solid var(--clr-border, #ecddd0);
          border-radius: var(--radius-xl, 1.5rem);
        }

        .back-link {
          color: var(--clr-accent, #c8956c);
          transition: color 200ms;
        }
        .back-link:hover {
          color: var(--clr-accent-hov, #b5794e);
        }

        .icon-wrap-calc {
          width:  4rem;
          height: 4rem;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--clr-accent-soft, #f5e6d8);
          color:      var(--clr-accent, #c8956c);
          font-size:  1.75rem;
        }

        .input-field {
          width: 100%;
          padding: 1rem;
          border-radius: 0.75rem;
          border: 1.5px solid var(--clr-border, #ecddd0);
          background: var(--clr-bg, #fdfaf6);
          color: var(--clr-text, #2d1f14);
          outline: none;
          transition: border-color 200ms, box-shadow 200ms;
        }
        .input-field:focus {
          border-color: var(--clr-accent, #c8956c);
          box-shadow: 0 0 0 3px var(--clr-accent-soft, #f5e6d8);
        }

        .result-card {
          background: var(--clr-bg, #fdfaf6);
          border: 1.5px solid var(--clr-border, #ecddd0);
          border-radius: 1rem;
          transition: transform 250ms, box-shadow 250ms;
        }
        .result-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(74,59,47,.08);
          border-color: var(--clr-accent, #c8956c);
        }

        .section-divider {
          width: 3rem;
          height: 3px;
          border-radius: 9px;
          background: var(--clr-accent, #c8956c);
        }
      `}</style>

      <main id="main-content" tabIndex={-1}>
        <section className="calculator-section px-6 py-24 min-h-screen">
          <div className="max-w-3xl mx-auto">
            
            {/* ════ BACK LINK ════ */}
            <Link href="/dashBoard" className="back-link inline-flex items-center mb-8 font-medium gap-2">
              <FaArrowLeft /> Back to Dashboard
            </Link>

            {/* ════ HEADLINE ════ */}
            <div className="mb-12" data-sal="slide-up" data-sal-duration="600">
              <div className="flex items-center gap-4 mb-4">
                <div className="icon-wrap-calc">
                  <FaWalking />
                </div>
                <h1 className="text-4xl font-normal tracking-tight" style={{ color: "var(--clr-primary, #4a3b2f)" }}>
                  Steps Calculator
                </h1>
              </div>
              <div className="section-divider mb-4" />
              <p style={{ color: "var(--clr-text-muted, #6b5c50)" }} className="text-lg">
                Convert your daily steps into burned calories and distance instantly.
              </p>
            </div>

            {/* ════ CALCULATOR CARD ════ */}
            <div 
              className="calc-container p-8 md:p-10 shadow-sm"
              data-sal="slide-up" 
              data-sal-delay="100"
              data-sal-duration="700"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Steps Input */}
                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm font-medium" style={{ color: "var(--clr-primary, #4a3b2f)" }}>
                    Steps Walked <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={steps}
                    onChange={(e) => setSteps(e.target.value)}
                    placeholder="e.g. 10000"
                    className="input-field text-lg font-medium"
                  />
                </div>

                {/* Weight Input */}
                <div>
                  <label className="block mb-2 text-sm font-medium" style={{ color: "var(--clr-primary, #4a3b2f)" }}>
                    Weight (kg) <span className="text-xs opacity-60">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Default: 70"
                    className="input-field"
                  />
                </div>

                {/* Height Input */}
                <div>
                  <label className="block mb-2 text-sm font-medium" style={{ color: "var(--clr-primary, #4a3b2f)" }}>
                    Height (cm) <span className="text-xs opacity-60">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="Default: 170"
                    className="input-field"
                  />
                </div>
              </div>

              {/* ════ RESULTS AREA ════ */}
              {results && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t" style={{ borderColor: "var(--clr-border, #ecddd0)" }}>
                  
                  {/* Calories Burned Card */}
                  <div className="result-card p-6 flex items-center gap-4">
                    <div className="icon-wrap-calc" style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444" }}>
                      <FaFire />
                    </div>
                    <div>
                      <div className="text-3xl font-bold tracking-tight" style={{ color: "var(--clr-primary, #4a3b2f)" }}>
                        {results.calories}
                      </div>
                      <div className="text-sm font-normal opacity-70 mt-0.5">Calories Burned</div>
                    </div>
                  </div>

                  {/* Distance Walked Card */}
                  <div className="result-card p-6 flex items-center gap-4">
                    <div className="icon-wrap-calc" style={{ background: "rgba(59, 130, 246, 0.1)", color: "#3b82f6" }}>
                      <FaRuler />
                    </div>
                    <div>
                      <div className="text-3xl font-bold tracking-tight" style={{ color: "var(--clr-primary, #4a3b2f)" }}>
                        {results.distance} <span className="text-lg font-normal">km</span>
                      </div>
                      <div className="text-sm font-normal opacity-70 mt-0.5">Distance Walked</div>
                    </div>
                  </div>

                </div>
              )}
            </div>

          </div>
        </section>
      </main>
    </>
  );
}