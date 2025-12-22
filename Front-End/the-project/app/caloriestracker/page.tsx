"use client";

import { useState } from "react";
import { useTheme } from '../context/ThemeContext';
import { useTracker } from '../context/CaloriesTrackerContext';

export default function CaloriesTracker() {
  const { theme } = useTheme();
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activity, setActivity] = useState("1.2");
const {Tracker , setTracker} = useTracker();
  const calculateCalories = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);
    const act = parseFloat(activity);

    if (!w || !h || !a) return;

    let bmr = 0;

    if (gender === "male") {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    const dailyCalories = Math.round(bmr * act);
    setTracker(dailyCalories);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#fdf7f1]'}`}>
      <div className={`w-full max-w-lg p-8 backdrop-blur-lg rounded-3xl shadow-[0_8px_25px_rgba(0,0,0,0.07)] border ${theme === 'dark' ? 'bg-gray-800/70 border-gray-700' : 'bg-white/70 border-[#e8dfd7]'}`}>

        <h1 className={`text-4xl text-center mb-7 ${theme === 'dark' ? 'text-white' : 'text-[#4a3d35]'}`}>
          Calories Tracker
        </h1>

        <div className="space-y-5">

          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className={`w-full border rounded-2xl p-3 focus:ring-2 focus:ring-[#8a6e63] outline-none transition shadow-sm ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-[#d6c8be]'}`}
          />

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className={`w-full border rounded-2xl p-3 focus:ring-2 focus:ring-[#8a6e63] outline-none transition shadow-sm ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-[#d6c8be]'}`}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <input
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className={`w-full border rounded-2xl p-3 focus:ring-2 focus:ring-[#8a6e63] outline-none transition shadow-sm ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-[#d6c8be]'}`}
          />

          <input
            type="number"
            placeholder="Height (cm)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className={`w-full border rounded-2xl p-3 focus:ring-2 focus:ring-[#8a6e63] outline-none transition shadow-sm ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-[#d6c8be]'}`}
          />

          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className={`w-full border rounded-2xl p-3 focus:ring-2 focus:ring-[#8a6e63] outline-none transition shadow-sm ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-[#d6c8be]'}`}
          >
            <option value="1.2">Sedentary</option>
            <option value="1.375">Lightly active</option>
            <option value="1.55">Moderately active</option>
            <option value="1.725">Very active</option>
            <option value="1.9">Extra active</option>
          </select>

          <button
            onClick={calculateCalories}
            className={`w-full p-3 rounded-2xl text-[26px] shadow-md transition ${theme === 'dark' ? 'bg-green-700 hover:bg-green-600 text-white' : 'bg-[#6a9c5f] text-white hover:bg-[#5a8a50]'}`}
          >
            Calculate
          </button>
        </div>

        {Tracker !== null && (
          <div className={`mt-7 p-6 rounded-3xl text-center shadow-inner border ${theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-[#effcf2] border-[#d2ead8]'}`}>
            <p className={`text-xl font-medium ${theme === 'dark' ? 'text-green-400' : 'text-[#3c6e47]'}`}>
              Your daily calorie needs:
            </p>
            <p className={`text-4xl mt-2 ${theme === 'dark' ? 'text-white' : 'text-[#2f5c3b]'}`}>
              {Tracker} kcal
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
