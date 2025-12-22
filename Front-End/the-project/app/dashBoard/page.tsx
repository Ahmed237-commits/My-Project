"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useBMI } from '../context/BMIContext';
import { useTheme } from '../context/ThemeContext';
import { useHealth } from '../context/HealthContext';
import { useTracker } from "../context/CaloriesTrackerContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { FaCalculator, FaSun, FaMoon, FaBell, FaSearch, FaTachometerAlt, FaFireAlt, FaDumbbell, FaClipboardCheck, FaUtensils, FaBed, FaWalking } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import sal from "sal.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const chartOptions = {
  responsive: true,
  animation: {
    duration: 2000,
    easing: 'easeOutBounce' as const,
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

export default function DashBoard() {
  const { data, status } = useSession();
  const { theme, toggleTheme } = useTheme();
  const { healthData } = useHealth();
  const pathname = usePathname();
  const { bmi, setBmi } = useBMI();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { Tracker, setTracker } = useTracker();
  const searchItems = [
    { name: "Dashboard", path: "/dashBoard", type: "link" },
    { name: "Calories Tracker", path: "/caloriestracker", type: "link" },
    { name: "Workout Plan", path: "/workout", type: "link" },
    { name: "BMI Calculator", path: "/bmi", type: "link" },
    { name: "Sleep Calculator", path: "/sleepcalculator", type: "link" },
    { name: "Steps Calculator", path: "/stepscalculator", type: "link" },
    { name: "Profile", path: "/Profile", type: "link" },
    { name: "Notifications", path: "/notifications", type: "link" },
    { name: "Toggle Theme", action: "toggleTheme", type: "action" },
    { name: `Your BMI: ${bmi || "Not Calculated"}`, path: "/bmi", type: "link" },
    { name: `Calories Today: ${healthData?.caloriesToday || 0} kcal`, path: "/caloriestracker", type: "link" },
  ];

  const filteredItems = searchItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchClick = (item: any) => {
    if (item.type === "link") {
      router.push(item.path);
    } else if (item.type === "action") {
      if (item.action === "toggleTheme") {
        toggleTheme();
      }
    }
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const [chartData, setChartData] = useState({
    labels: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Calories Per Day",
        data: [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 1,
      },
    ],
  });
  // Bmi 
  const bmiFetching = (async () => {
    const Fetching = fetch("http://localhost:8000/bmi", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const TheData = await (await Fetching).json();
    setBmi(TheData[TheData.length - 1].bmi);
  })
  useEffect(() => {
    bmiFetching();
  }, []);
  const fetchWeeklyData = useCallback(async () => {
    if (data?.user?.email) {
      try {
        const res = await fetch(`http://localhost:8000/api/daily-intake/weekly?email=${data.user.email}`);
        const apiData = await res.json();
        if (apiData.weeklyData) {
          const labels = apiData.weeklyData.map((d: any) => {
            const date = new Date(d.date);
            return date.toLocaleDateString('en-US', { weekday: 'short' });
          });
          const calories = apiData.weeklyData.map((d: any) => d.calories);

          setChartData({
            labels,
            datasets: [
              {
                label: "Calories Per Day",
                data: calories,
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgb(75, 192, 192)",
                borderWidth: 1,
              },
            ],
          });
        }
      } catch (err) {
        console.error("Failed to fetch weekly data:", err);
      }
    }
  }, [data?.user?.email]);

  useEffect(() => {
    sal({
      threshold: 0.1, once: true,
      root: null
    });
    fetchWeeklyData();
    bmiFetching();
  }, [fetchWeeklyData, healthData, bmiFetching]); // Re-fetch when healthData changes (e.g. after adding food)

  const mainLinks = [
    { path: "/dashBoard", name: "Dashboard", icon: <FaTachometerAlt /> },
    { path: "/caloriestracker", name: "Calories Tracker", icon: <FaUtensils /> },
    { path: "/workout", name: "Workout Plan", icon: <FaDumbbell /> },
    { path: "/bmi", name: "BMI", icon: <FaClipboardCheck /> },
    { path: "/sleepcalculator", name: "Sleep Calculator", icon: <FaBed /> },
    { path: "/stepscalculator", name: "Steps Calculator", icon: <FaWalking /> },
      { path: "/caloriescalculator", name: "Calories Calculator", icon: <FaWalking /> },

  ];
  const theSpan = useRef<HTMLSpanElement | null>(null);
  const theMain = useRef(null);
  // Calories Fetching
  const caloriesFetching = (async () => {
    const Fetching = fetch("http://localhost:8000/calories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const TheData = await (await Fetching).json();
    setTracker(TheData[TheData.length - 1].calories);
  })
  useEffect(() => {
    caloriesFetching();
  }, []);
  return (
    <>
      <div ref={theMain}>
        {status === "authenticated" ? (
          <div
            className={`flex text-2xl min-h-screen transition-colors duration-500 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
              }`}
          >
            {/* Sidebar */}
            <aside
              className={`w-64 min-h-screen p-4 flex flex-col shadow-lg transition-all duration-500 ${theme === "dark" ? "bg-gray-800" : "bg-white"
                }`}
            >
              <div className="flex items-center justify-center p-4">
                <h2 className="text-2xl font-bold">Health Life</h2>
              </div>

              <nav className="mt-8 flex flex-col space-y-4">
                {mainLinks.map((l, index) => (
                  <Link
                    key={index}
                    href={l.path}
                    className={`flex items-center space-x-2 p-3 rounded-lg ${pathname === l.path
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-700"
                      }`}
                  >
                    {l.icon}
                    <span>{l.name}</span>
                  </Link>
                ))}
              </nav>
            </aside>

            {/* Main */}
            <main className="flex-1 p-8">
              {/* Header */}
              <header
                className={`flex justify-between items-center pb-6 mb-8 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-300"
                  }`}
              >
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearchOpen(true);
                    }}
                    onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                    className={`pl-10 pr-4 py-2 rounded-full w-72 focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-800"
                      }`}
                  />
                  {isSearchOpen && searchQuery && (
                    <div className={`absolute top-12 left-0 w-72 rounded-lg shadow-lg z-50 overflow-hidden ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                      {filteredItems.length > 0 ? (
                        filteredItems.map((item, index) => (
                          <div
                            key={index}
                            onClick={() => handleSearchClick(item)}
                            className={`px-4 py-3 cursor-pointer transition-colors ${theme === "dark" ? "hover:bg-gray-700 text-white" : "hover:bg-gray-100 text-gray-800"}`}
                          >
                            {item.name}
                          </div>
                        ))
                      ) : (
                        <div className={`px-4 py-3 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                          No results found
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <h1 className="text-6xl">Dashboard</h1>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleTheme}
                    className="p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    {theme === "dark" ? <FaSun /> : <FaMoon />}
                  </button>
                  <button
                    className="relative p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <span
                      ref={theSpan}
                      className={(bmi || 0) > 0 ? "absolute top-1 right-2 inline-flex w-2 h-2 bg-red-600 rounded-full animate-ping" : ""}></span>
                    <Link href="/notifications">
                      <FaBell />
                    </Link>
                  </button>

                  <Link href="/Profile">
                    <Image
                      src={data?.user?.image || ""}
                      alt="User"
                      width={40}
                      height={40}
                      className="rounded-full ring-2 ring-blue-500"
                    />
                  </Link>
                </div>
              </header>

              {/* Welcome */}
              <h2 className="text-3xl mb-6">Welcome, {data?.user?.name} 👋</h2>

              {/* Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Calories */}
                <div
                  className={`p-6 rounded-xl shadow-md ${theme === "dark" ? "bg-gray-800" : "bg-white"
                    }`}
                >
                  <h3 className="text-lg text-gray-500">Calories Today</h3>
                  <div className="flex items-center mt-2">
                    <FaFireAlt className="text-3xl text-orange-500 mr-4" />
                    <span className="text-3xl">{healthData.caloriesToday} kcal</span>
                  </div>
                </div>

                {/* Protein */}
                <div
                  className={`p-6 rounded-xl shadow-md ${theme === "dark" ? "bg-gray-800" : "bg-white"
                    }`}
                >
                  <h3 className="text-lg text-gray-500">Protein Today</h3>
                  <div className="flex items-center mt-2">
                    <FaUtensils className="text-3xl text-green-500 mr-4" />
                    <span className="text-3xl">{healthData.proteinToday} g</span>
                  </div>
                </div>

                {/* BMI */}
                <div
                  className={`p-6 rounded-xl shadow-md ${theme === "dark" ? "bg-gray-800" : "bg-white"
                    }`}
                >
                  <h3 className="text-lg text-gray-500">Your BMI</h3>
                  <div className="flex items-center mt-2">
                    <FaClipboardCheck className="text-3xl text-blue-500 mr-4" />
                    <span className="text-3xl">{bmi || 0}</span>
                  </div>
                </div>

                {/* Workout */}
                <div
                  className={`p-6 rounded-xl shadow-md ${theme === "dark" ? "bg-gray-800" : "bg-white"
                    }`}
                >
                  <h3 className="text-lg text-gray-500">Calories Tracker</h3>
                  <div className="flex items-center mt-2">
                    <FaCalculator className="text-3xl text-purple-500 mr-4" />
                    <span className="text-3xl">{Tracker || 0}</span>
                  </div>
                </div>
              </div>

              {/* Chart Section */}
              <div
                className={`p-6 rounded-xl shadow-md ${theme === "dark" ? "bg-gray-800" : "bg-white"
                  }`}
              >
                <h3 className="text-xl mb-4">Weekly Calories</h3>
                <Bar data={chartData} options={chartOptions} />
              </div>
            </main>
          </div>
        ) : (
          <div className="min-h-screen flex items-center justify-center text-4xl">
            Please sign in to continue.
          </div>
        )}
      </div>
    </>
  );
}
