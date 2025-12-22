"use client";
import React, { useEffect, useState, useMemo } from 'react';
import sal from 'sal.js'; // @ts-ignore
import 'sal.js/dist/sal.css';
import { RadialBarChart, RadialBar, Legend, Tooltip } from 'recharts';
import { useSession } from 'next-auth/react';
import { useBMI } from '../context/BMIContext';
import { useTheme } from '../context/ThemeContext';

export default function HealthyLifeBMIPage() {
  const [weight, setWeight] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const { bmi, setBmi } = useBMI();
  const { data: sessionData } = useSession();
  const { theme } = useTheme();

  useEffect(() => {
    sal({ threshold: 0.2, once: true, root: null });
  }, [bmi]);

  const calculateBMI = () => {
    const w = Number(weight);
    const h = Number(height);
    if (!w || !h) return;
    const meters = h / 100;
    const result = w / (meters * meters);
    setBmi(parseFloat(result.toFixed(1)));
  };

  const getCategory = (value: number | null) => {
    if (value === null || value === undefined) return '';
    if (value < 18.5) return 'Underweight';
    if (value < 24.9) return 'Healthy';
    if (value < 29.9) return 'Overweight';
    return 'Obese';
  };

  const accentColor =
    bmi && bmi < 18.5
      ? 'text-yellow-600'
      : bmi && bmi < 24.9
        ? 'text-emerald-600'
        : bmi && bmi < 29.9
          ? 'text-orange-500'
          : 'text-red-600';

  const data = [
    {
      name: getCategory(bmi) || 'BMI',
      uv: bmi || 0,
      // color will not be inline; keep palette consistent in Tailwind
    },
  ];
  // Bmi Adding to DataBase
  const response = async () => {
    const response = await fetch('http://localhost:8000/save/bmi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: sessionData?.user?.email,
        weight: weight,
        height: height,
        bmi: bmi,
      }),
    });
    const apiData = await response.json();
    console.log(apiData)
  };
  useEffect(() => {
    response();
  }, [bmi])
  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-gray-200' : 'bg-[#efe7dc] text-[#2b2b2b]'}`}>
      {/* HERO */}
      <header className="relative overflow-hidden">
        <div className={`absolute inset-0 -z-10 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-[#efe7dc] via-[#f6efe6] to-[#e9dccc]'}`}></div>
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div
            className={`backdrop-blur-md rounded-3xl shadow-2xl p-10 md:p-16 text-center border ${theme === 'dark' ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-white/60'}`}
            data-sal="zoom-in"
            data-sal-duration="700"
          >
            <h1 className={`text-4xl md:text-5xl font-extrabold mb-3 ${theme === 'dark' ? 'text-white' : 'text-[#5A4A42]'}`}>Healthy Life — BMI Calculator</h1>
            <p className={`text-lg md:text-xl max-w-3xl mx-auto mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-[#4A3B34]'}`}>
              Quick, elegant and friendly BMI check — know your category and track progress with the Healthy Life look and feel.
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={calculateBMI}
                onKeyDown={(e) => e.key === 'Enter' && calculateBMI()}
                className={`inline-flex items-center gap-3 font-semibold py-3 px-6 rounded-full shadow-lg transform transition hover:-translate-y-0.5 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-[#5A4A42] hover:bg-[#463a34] text-white'}`}
              >
                Calculate Now
              </button>
              <button
                onClick={() => {
                  setWeight('');
                  setHeight('');
                  setBmi(null);
                }}
                className={`inline-flex items-center gap-2 border py-3 px-5 rounded-full font-medium shadow-sm ${theme === 'dark' ? 'border-gray-500 text-gray-300 hover:bg-gray-700' : 'border-[#5A4A42] text-[#5A4A42] bg-white/60 hover:bg-white'}`}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CALCULATOR */}
      <main className="max-w-6xl mx-auto px-6 -mt-10 mb-24">
        <section
          className={`rounded-3xl shadow-xl p-8 md:p-12 border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-white/60'}`}
          data-sal="slide-up"
          data-sal-duration="600"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* left - inputs & results */}
            <div>
              <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-[#5A4A42]'}`}>Enter your details</h2>
              <p className={`text-sm mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-[#4A3B34]'}`}>Use kilograms (kg) and centimeters (cm) for most accurate result.</p>

              <div className="space-y-4">
                <label className="block">
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-[#4A3B34]'}`}>Weight (kg)</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    placeholder="e.g. 70"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className={`mt-2 block w-full rounded-xl border p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d9c7b9] ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'}`}
                  />
                </label>

                <label className="block">
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-[#4A3B34]'}`}>Height (cm)</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    placeholder="e.g. 170"
                    value={height}
                    onChange={(e) => setHeight(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className={`mt-2 block w-full rounded-xl border p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d9c7b9] ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'}`}
                  />
                </label>

                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={calculateBMI}
                    className={`font-semibold py-2 px-6 rounded-xl shadow transition ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-[#5A4A42] hover:bg-[#463a34] text-white'}`}
                  >
                    Calculate
                  </button>

                  <button
                    onClick={() => {
                      setWeight('');
                      setHeight('');
                    }}
                    className={`border py-2 px-5 rounded-xl font-medium shadow-sm ${theme === 'dark' ? 'border-gray-500 text-gray-300 hover:bg-gray-700' : 'border-[#5A4A42] text-[#5A4A42] bg-white'}`}
                  >
                    Clear
                  </button>
                </div>

                {bmi !== null && (
                  <div className={`mt-6 p-4 rounded-2xl border shadow-inner ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-[#f8f6f3] border-[#efe6dd]'}`}>
                    <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-[#5A4A42]'}`}>Hello {sessionData?.user?.name || 'Friend'}</h3>
                    <div className="mt-2 flex items-end gap-4">
                      <div>
                        <span className={`text-3xl font-extrabold ${theme === 'dark' ? 'text-white' : ''}`}>{bmi}</span>
                        <p className={`mt-1 text-sm font-medium ${accentColor}`}>{getCategory(bmi)}</p>
                      </div>
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-[#4A3B34]'}`}>This is a simple indicator — combine it with body composition and professional advice.</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* right - chart */}
            <div className="flex justify-center">
              <div className={`rounded-2xl p-6 w-full max-w-xs shadow-md border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-[#fffaf7] border-[#efe6dd]'}`} data-sal="zoom-in" data-sal-duration="600">
                <h4 className={`text-center font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-[#5A4A42]'}`}>BMI Visual</h4>
                <RadialBarChart width={260} height={260} innerRadius="70%" outerRadius="100%" data={data} startAngle={180} endAngle={0}>
                  <RadialBar background dataKey="uv" cornerRadius={12} fill={bmi && bmi < 18.5 ? '#facc15' : bmi && bmi < 24.9 ? '#22c55e' : bmi && bmi < 29.9 ? '#fb923c' : '#ef4444'} />
                  <Legend iconSize={8} layout="vertical" verticalAlign="middle" align="right" />
                  <Tooltip />
                </RadialBarChart>

                <div className={`mt-4 text-center text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-[#4A3B34]'}`}>
                  <div className="mb-2">Ranges:</div>
                  <div className="grid grid-cols-2 gap-2 text-left px-6">
                    <div>Below 18.5 — Underweight</div>
                    <div>18.5–24.9 — Healthy</div>
                    <div>25–29.9 — Overweight</div>
                    <div>30+ — Obese</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INFO / EXPLANATION */}
        <section className={`mt-10 p-8 rounded-3xl border shadow-md ${theme === 'dark' ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-white/60'}`} data-sal="slide-up" data-sal-duration="600">
          <div className="md:flex md:items-center md:justify-between gap-6">
            <div>
              <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-[#5A4A42]'}`}>What does BMI mean?</h3>
              <p className={`mt-2 max-w-2xl ${theme === 'dark' ? 'text-gray-300' : 'text-[#4A3B34]'}`}>Body Mass Index (BMI) is a screening tool that uses height and weight to estimate body fat for most people. It does not measure body composition directly — consider muscle mass, bone density, and other factors when interpreting your result.</p>
            </div>

            <div className="mt-6 md:mt-0">
              <table className={`min-w-[320px] border rounded-xl overflow-hidden text-left ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <thead className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-[#5A4A42] text-white'}`}>
                  <tr>
                    <th className="px-6 py-3">BMI Range</th>
                    <th className="px-6 py-3">Category</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={`border-t ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white'}`}>
                    <td className="px-6 py-3">Below 18.5</td>
                    <td className="px-6 py-3">Underweight</td>
                  </tr>
                  <tr className={`border-t ${theme === 'dark' ? 'bg-gray-700/50 border-gray-700 text-gray-300' : 'bg-[#f9f7f4]'}`}>
                    <td className="px-6 py-3">18.5 - 24.9</td>
                    <td className="px-6 py-3">Healthy</td>
                  </tr>
                  <tr className={`border-t ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white'}`}>
                    <td className="px-6 py-3">25 - 29.9</td>
                    <td className="px-6 py-3">Overweight</td>
                  </tr>
                  <tr className={`border-t ${theme === 'dark' ? 'bg-gray-700/50 border-gray-700 text-gray-300' : 'bg-[#f9f7f4]'}`}>
                    <td className="px-6 py-3">30 and above</td>
                    <td className="px-6 py-3">Obese</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={`mt-10 rounded-3xl p-8 border shadow-inner text-center ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-[#e3dbcf] border-[#dfd1c0] text-[#4A3B34]'}`} data-sal="zoom-in" data-sal-duration="600">
          <h4 className="text-2xl font-bold mb-2">Track your progress with Healthy Life</h4>
          <p className="max-w-xl mx-auto">Combine your BMI checks with regular workouts, proper nutrition plans and track changes over time for the best results.</p>
        </section>
      </main>

      <footer className={`py-8 text-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-[#5A4A42]'}`}>© Healthy Life</footer>
    </div>
  );
}
