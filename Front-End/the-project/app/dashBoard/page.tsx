"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useBMI } from '../context/BMIContext';
import { useTheme } from '../context/ThemeContext';
import { useHealth } from '../context/HealthContext';
import { useTracker } from "../context/CaloriesTrackerContext";
import Bell from "../(componants)/bell";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend, ArcElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  FaCalculator, FaSun, FaMoon, FaSearch,
  FaTachometerAlt, FaFireAlt, FaDumbbell, FaClipboardCheck,
  FaUtensils, FaBed, FaWalking, FaArrowLeft, FaHeartbeat,
  FaTimes, FaChevronRight,
} from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import sal from "sal.js";
import { UserAvatar } from "../(componants)/Header";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

const MAIN_LINKS = [
  { path: "/dashBoard",         name: "Dashboard",          icon: <FaTachometerAlt aria-hidden="true" /> },
  { path: "/caloriestracker",   name: "Calories Tracker",   icon: <FaUtensils      aria-hidden="true" /> },
  { path: "/workout",           name: "Workout Plan",       icon: <FaDumbbell      aria-hidden="true" /> },
  { path: "/bmi",               name: "BMI Calculator",     icon: <FaClipboardCheck aria-hidden="true" /> },
  { path: "/sleepcalculator",   name: "Sleep Calculator",   icon: <FaBed           aria-hidden="true" /> },
  { path: "/stepscalculator",   name: "Steps Calculator",   icon: <FaWalking       aria-hidden="true" /> },
  { path: "/caloriescalculator",name: "Calories Calculator",icon: <FaCalculator    aria-hidden="true" /> },
];

/* ══════════════════════════════════════════
  COMPONENT
══════════════════════════════════════════ */
export default function DashBoard() {
  const { data, status }    = useSession();
  const { theme, toggleTheme } = useTheme();
  const { healthData }      = useHealth();
  const pathname            = usePathname();
  const { bmi, setBmi }     = useBMI();
  const router              = useRouter();
  const { Tracker, setTracker } = useTracker();
  const [searchQuery,  setSearchQuery]  = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileSidebar,setMobileSidebar]= useState(false);
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "localhost:8000"
  const isDark = theme === "dark";

  const [chartData, setChartData] = useState({
    labels: ["Sat","Sun","Mon","Tue","Wed","Thu","Fri"],
    datasets: [{
      label: "Calories",
      data:  [0, 0, 0, 0, 0, 0, 0],
      backgroundColor: "rgba(200,149,108,.65)",
      borderColor:     "rgba(200,149,108,1)",
      borderWidth: 2,
      borderRadius: 8,
    }],
  });

  // تحديث ألوان الرسم البياني بناءً على الدارك مود
  const chartOptions = {
    responsive: true,
    animation: { duration: 1800, easing: "easeOutQuart" as const },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? "rgba(45,37,30,.95)" : "rgba(74,59,47,.9)",
        titleColor: isDark ? "#f0e8df" : "#f5e6d8",
        bodyColor:  isDark ? "#e8d5c0" : "#e8d5c0",
        borderColor: "rgba(200,149,108,.3)",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 10,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid:  { color: isDark ? "rgba(200,149,108,.05)" : "rgba(200,149,108,.1)" },
        ticks: { color: isDark ? "#a09085" : "#7a6a5e", font: { size: 12 } },
      },
      x: {
        grid:  { display: false },
        ticks: { color: isDark ? "#a09085" : "#7a6a5e", font: { size: 12 } },
      },
    },
  };

  /* ── search items ── */
  const searchItems = [
    ...MAIN_LINKS.map(l => ({ name: l.name, path: l.path, type: "link" })),
    { name: "Toggle Theme", action: "toggleTheme", type: "action" },
    { name: `Your BMI: ${bmi || "Not Calculated"}`, path: "/bmi", type: "link" },
    { name: `Calories Today: ${healthData?.caloriesToday || 0} kcal`, path: "/caloriestracker", type: "link" },
  ];
  const filteredItems = searchItems.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSearchClick = (item: any) => {
    if (item.type === "link")   router.push(item.path);
    if (item.action === "toggleTheme") toggleTheme();
    setIsSearchOpen(false); setSearchQuery("");
  };

  /* ── data fetching ── */
  const bmiFetching = useCallback(async () => {
    try {
      const res  = await fetch(`${API_BASE_URL}/bmi`);
      const data = await res.json();
      setBmi(data[data.length - 1].bmi);
    } catch {}
  }, [setBmi]);

  const caloriesFetching = useCallback(async () => {
    try {
      const res  = await fetch(`${API_BASE_URL}/calories`);
      const data = await res.json();
      setTracker(data[data.length - 1].calories);
    } catch {}
  }, [setTracker]);

  const fetchWeeklyData = useCallback(async () => {
    if (!data?.user?.email) return;
    try {
      const res     = await fetch(`${API_BASE_URL}/api/daily-intake/weekly?email=${data.user.email}`);;
      const apiData = await res.json();
      if (apiData.weeklyData) {
        setChartData({
          labels: apiData.weeklyData.map((d: any) =>
            new Date(d.date).toLocaleDateString("en-US", { weekday: "short" })
          ),
          datasets: [{
            label: "Calories",
            data:  apiData.weeklyData.map((d: any) => d.calories),
            backgroundColor: isDark ? "rgba(200,149,108,.45)" : "rgba(200,149,108,.65)",
            borderColor:     "rgba(200,149,108,1)",
            borderWidth: 2,
            borderRadius: 8,
          }],
        });
      }
    } catch {}
  }, [data?.user?.email, isDark]);

  useEffect(() => {
    sal({ threshold: 0.1, once: true, root: null });
    bmiFetching();
    caloriesFetching();
    fetchWeeklyData();
  }, [bmiFetching, caloriesFetching, fetchWeeklyData, healthData]);

  /* ── stat cards ── */
  const statCards = [
    { label: "Calories Today",    value: `${healthData?.caloriesToday || 0} kcal`, icon: <FaFireAlt     aria-hidden="true" />, color: isDark ? "#ffa26a" : "#e8824a" },
    { label: "Protein Today",     value: `${healthData?.proteinToday || 0} g`,     icon: <FaUtensils    aria-hidden="true" />, color: isDark ? "#74be8a" : "#5a9e6f" },
    { label: "Your BMI",          value: `${bmi || 0}`,                      icon: <FaClipboardCheck aria-hidden="true" />, color: isDark ? "#7ca3e8" : "#5a83c8" },
    { label: "Calories Tracker",  value: `${Tracker || 0}`,                  icon: <FaCalculator  aria-hidden="true" />, color: isDark ? "#b68ce3" : "#9b6fc8" },
  ];

  /* ══════════════════════════════════════════
    UNAUTHENTICATED
  ══════════════════════════════════════════ */
  if (status !== "authenticated") {
    return (
      <>
        <style>{`
          .dash-unauth {
            min-height: 100vh; display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            background: ${isDark ? '#1a1512' : '#fdfaf6'}; gap: 1.5rem;
            padding: 2rem; transition: background 300ms;
          }
          .dash-unauth-card {
            background: ${isDark ? '#251e19' : '#fff'};
            border: 1.5px solid ${isDark ? '#3d332a' : '#ecddd0'};
            border-radius: 1.5rem; padding: 3rem 2.5rem;
            text-align: center; max-width: 400px; width: 100%;
            box-shadow: ${isDark ? '0 20px 60px rgba(0,0,0,.3)' : '0 20px 60px rgba(74,59,47,.1)'};
          }
          .dash-unauth-badge {
            width: 64px; height: 64px; border-radius: 50%;
            background: ${isDark ? '#342a22' : '#f5e6d8'};
            display: flex; align-items: center; justify-content: center;
            color: #c8956c; font-size: 1.75rem;
            margin: 0 auto 1.25rem;
          }
        `}</style>
        <div className="dash-unauth">
          <div className="dash-unauth-card">
            <div className="dash-unauth-badge" aria-hidden="true"><FaHeartbeat /></div>
            <h1 className="text-2xl font-normal mb-2" style={{ color: isDark ? '#f0e8df' : '#4a3b2f' }}>
              Sign in required
            </h1>
            <p className="text-base font-normal mb-6" style={{ color: isDark ? '#a0958d' : '#6b5c50' }}>
              Please sign in to access your dashboard.
            </p>
            <Link
              href="/signIn"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-normal text-base"
              style={{ background: "#c8956c" }}
            >
              Sign In
            </Link>
            <div className="mt-4">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-sm font-normal"
                style={{ color: "#c8956c" }}
              >
                <FaArrowLeft className="text-xs" aria-hidden="true" /> Back to Home
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ══════════════════════════════════════════
    AUTHENTICATED
  ══════════════════════════════════════════ */
  const firstName = data?.user?.name?.split(" ")[0];

  return (
    <>
      <style>{`
        /* ── layout ── */
        .dash-root {
          display: flex; min-height: 100vh;
          background: ${isDark ? '#1a1512' : '#fdfaf6'};
          color: ${isDark ? '#f0e8df' : '#2d1f14'};
          transition: background 300ms, color 300ms;
        }

        /* ── sidebar ── */
        .dash-sidebar {
          width: 240px; flex-shrink: 0;
          background: ${isDark ? '#251e19' : '#fff'};
          border-right: 1.5px solid ${isDark ? '#3d332a' : '#ecddd0'};
          display: flex; flex-direction: column;
          padding: 1.5rem 1rem;
          position: sticky; top: 0; height: 100vh;
          overflow-y: auto;
          transition: background 300ms, border-color 300ms;
        }
        @media (max-width: 1023px) { .dash-sidebar { display: none; } }

        .dash-sidebar-logo {
          display: flex; align-items: center; gap: .6rem;
          padding: .5rem .75rem; margin-bottom: 2rem;
          color: ${isDark ? '#e8d5c0' : '#4a3b2f'};
          font-size: 1rem; font-weight: normal;
        }
        .dash-sidebar-logo-dot {
          width: 34px; height: 34px; border-radius: 50%;
          background: ${isDark ? '#342a22' : '#f5e6d8'};
          display: flex; align-items: center; justify-content: center;
          color: #c8956c; font-size: 1rem; flex-shrink: 0;
        }

        .dash-nav-link {
          display: flex; align-items: center; gap: .75rem;
          padding: .7rem .85rem; border-radius: .875rem;
          color: ${isDark ? '#a0958d' : '#6b5c50'};
          font-size: .9rem; font-weight: normal;
          text-decoration: none;
          transition: background 180ms, color 180ms;
          margin-bottom: .25rem;
        }
        .dash-nav-link:hover { background: ${isDark ? '#342a22' : '#f5e6d8'}; color: ${isDark ? '#f0e8df' : '#4a3b2f'}; }
        .dash-nav-link.active {
          background: #c8956c; color: #fff;
        }
        .dash-nav-link:focus-visible {
          outline: 2px solid #c8956c; outline-offset: 2px; border-radius: .875rem;
        }

        /* ── main ── */
        .dash-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }

        /* ── topbar ── */
        .dash-topbar {
          position: sticky; top: 0; z-index: 20;
          background: ${isDark ? '#251e19' : '#fff'};
          border-bottom: 1.5px solid ${isDark ? '#3d332a' : '#ecddd0'};
          padding: .85rem 1.5rem;
          display: flex; align-items: center; justify-content: space-between; gap: 1rem;
          transition: background 300ms, border-color 300ms;
        }

        /* ── search ── */
        .search-wrap { position: relative; }
        .search-icon-inner {
          position: absolute; left: .85rem; top: 50%; transform: translateY(-50%);
          color: ${isDark ? '#a09085' : '#7a6a5e'}; font-size: .85rem; pointer-events: none;
        }
        .dash-search {
          padding: .6rem .9rem .6rem 2.3rem; border-radius: .75rem;
          border: 1.5px solid ${isDark ? '#3d332a' : '#ecddd0'};
          background: ${isDark ? '#1a1512' : '#fdfaf6'}; color: ${isDark ? '#f0e8df' : '#2d1f14'};
          font-size: .9rem; font-weight: normal; outline: none; width: 240px;
          transition: border-color 200ms, background 300ms;
        }
        .dash-search:focus { border-color: #c8956c; }
        .dash-search::placeholder { color: ${isDark ? '#a09085' : '#7a6a5e'}; opacity: .7; }
        @media (max-width: 640px) { .dash-search { width: 160px; } }

        .search-dropdown {
          position: absolute; top: calc(100% + .5rem); left: 0;
          width: 260px; border-radius: 1rem; overflow: hidden; z-index: 50;
          background: ${isDark ? '#251e19' : '#fff'};
          border: 1.5px solid ${isDark ? '#3d332a' : '#ecddd0'};
          box-shadow: ${isDark ? '0 16px 40px rgba(0,0,0,.4)' : '0 16px 40px rgba(74,59,47,.14)'};
        }
        .search-item {
          padding: .7rem 1rem; font-size: .875rem; font-weight: normal;
          color: ${isDark ? '#a0958d' : '#6b5c50'}; cursor: pointer;
          transition: background 150ms;
        }
        .search-item:hover { background: ${isDark ? '#342a22' : '#f5e6d8'}; color: ${isDark ? '#f0e8df' : '#4a3b2f'}; }

        /* ── topbar icon btns ── */
        .topbar-btn {
          width: 38px; height: 38px; border-radius: 50%; border: none;
          display: flex; align-items: center; justify-content: center;
          background: ${isDark ? '#1a1512' : '#fdfaf6'}; color: ${isDark ? '#a0958d' : '#6b5c50'};
          cursor: pointer; transition: background 180ms, color 180ms; position: relative;
        }
        .topbar-btn:hover { background: ${isDark ? '#342a22' : '#f5e6d8'}; color: #c8956c; }
        .topbar-btn:focus-visible { outline: 2px solid #c8956c; outline-offset: 2px; border-radius: 50%; }

        /* ── mobile sidebar ── */
        .mob-sidebar-overlay {
          position: fixed; inset: 0; z-index: 40;
          background: rgba(20,12,5,.45); backdrop-filter: blur(3px);
        }
        .mob-sidebar-panel {
          position: fixed; top: 0; left: 0; bottom: 0; z-index: 50;
          width: 260px; padding: 1.5rem 1rem;
          background: ${isDark ? '#251e19' : '#fff'};
          border-right: 1.5px solid ${isDark ? '#3d332a' : '#ecddd0'};
          box-shadow: 0 0 40px rgba(0,0,0,.3);
          display: flex; flex-direction: column; overflow-y: auto;
        }

        /* ── content area ── */
        .dash-content { flex: 1; padding: 2rem 1.5rem; }

        /* ── welcome ── */
        .dash-welcome {
          margin-bottom: 1.75rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid ${isDark ? '#3d332a' : '#ecddd0'};
        }

        /* ── stat cards ── */
        .stat-card {
          background: ${isDark ? '#251e19' : '#fff'};
          border: 1.5px solid ${isDark ? '#3d332a' : '#ecddd0'};
          border-radius: 1.25rem; padding: 1.5rem;
          transition: box-shadow 220ms, border-color 220ms, background 300ms;
        }
        .stat-card:hover { box-shadow: ${isDark ? '0 8px 24px rgba(0,0,0,.3)' : '0 8px 24px rgba(74,59,47,.09)'}; border-color: #c8956c; }

        .stat-icon {
          width: 44px; height: 44px; border-radius: .75rem;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.15rem; margin-bottom: 1rem; flex-shrink: 0;
        }

        /* ── chart card ── */
        .chart-card {
          background: ${isDark ? '#251e19' : '#fff'};
          border: 1.5px solid ${isDark ? '#3d332a' : '#ecddd0'};
          border-radius: 1.25rem; padding: 1.75rem;
          margin-top: 1.5rem;
          transition: background 300ms, border-color 300ms;
        }

        /* ── hamburger (mobile) ── */
        .ham-btn { display: none; }
        @media (max-width: 1023px) { .ham-btn { display: flex; } }
      `}</style>

      <div className="dash-root">

        {/* ════ DESKTOP SIDEBAR ════ */}
        <aside className="dash-sidebar" aria-label="Main navigation">
          <div className="dash-sidebar-logo">
            <div className="dash-sidebar-logo-dot" aria-hidden="true"><FaHeartbeat /></div>
            <span>Health Life</span>
          </div>

          <nav aria-label="Dashboard navigation">
            {MAIN_LINKS.map(l => (
              <Link
                key={l.path}
                href={l.path}
                className={`dash-nav-link ${pathname === l.path ? "active" : ""}`}
                aria-current={pathname === l.path ? "page" : undefined}
              >
                {l.icon}
                {l.name}
              </Link>
            ))}
          </nav>
        </aside>

        {/* ════ MOBILE SIDEBAR ════ */}
        {mobileSidebar && (
          <>
            <div className="mob-sidebar-overlay" onClick={() => setMobileSidebar(false)} aria-hidden="true" />
            <div className="mob-sidebar-panel" role="dialog" aria-modal="true" aria-label="Navigation menu">
              <div className="flex justify-between items-center mb-6">
                <div className="dash-sidebar-logo" style={{ margin: 0, padding: 0 }}>
                  <div className="dash-sidebar-logo-dot" aria-hidden="true"><FaHeartbeat /></div>
                  <span>Health Life</span>
                </div>
                <button
                  onClick={() => setMobileSidebar(false)}
                  className="topbar-btn"
                  aria-label="Close menu"
                >
                  <FaTimes aria-hidden="true" />
                </button>
              </div>
              <nav>
                {MAIN_LINKS.map(l => (
                  <Link
                    key={l.path}
                    href={l.path}
                    className={`dash-nav-link ${pathname === l.path ? "active" : ""}`}
                    aria-current={pathname === l.path ? "page" : undefined}
                    onClick={() => setMobileSidebar(false)}
                  >
                    {l.icon}
                    {l.name}
                    <FaChevronRight className="ml-auto text-xs opacity-40" aria-hidden="true" />
                  </Link>
                ))}
              </nav>
            </div>
          </>
        )}

        {/* ════ MAIN ════ */}
        <div className="dash-main">

          {/* ── Topbar ── */}
          <header className="dash-topbar">
            {/* hamburger */}
            <button
              className="ham-btn topbar-btn"
              onClick={() => setMobileSidebar(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileSidebar}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <rect y="2"  width="18" height="2" rx="1" fill="currentColor"/>
                <rect y="8"  width="18" height="2" rx="1" fill="currentColor"/>
                <rect y="14" width="18" height="2" rx="1" fill="currentColor"/>
              </svg>
            </button>

            {/* search */}
            <div className="search-wrap" role="search">
              <FaSearch className="search-icon-inner" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search…"
                value={searchQuery}
                aria-label="Search dashboard"
                className="dash-search"
                onChange={e => { setSearchQuery(e.target.value); setIsSearchOpen(true); }}
                onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
              />
              {isSearchOpen && searchQuery && (
                <div className="search-dropdown" role="listbox" aria-label="Search results">
                  {filteredItems.length > 0 ? filteredItems.map((item, i) => (
                    <div key={i} className="search-item" role="option" onClick={() => handleSearchClick(item)}>
                      {item.name}
                    </div>
                  )) : (
                    <div className="search-item" style={{ opacity: .6 }}>No results found</div>
                  )}
                </div>
              )}
            </div>

            {/* right icons */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                className="topbar-btn"
                onClick={toggleTheme}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDark ? <FaSun aria-hidden="true" /> : <FaMoon aria-hidden="true" />}
              </button>

              <Bell email={data?.user?.email ?? ""} />

              <Link href="/Profile" aria-label="View profile">
                {data?.user?.image ? (
                  <Image
                    src={data.user.image}
                    alt="Your profile"
                    width={36} height={36}
                    className="rounded-full object-cover"
                    style={{ border: "2px solid #c8956c" }}
                  />
                ) : (
                  <UserAvatar user={data?.user} />
                )}
              </Link>
            </div>
          </header>

          {/* ── Content ── */}
          <div className="dash-content">

            {/* welcome */}
            <div className="dash-welcome">
              <h1
                className="text-2xl font-normal mb-1"
                style={{ color: isDark ? '#e8d5c0' : '#4a3b2f' }}
              >
                Welcome back, {firstName} 👋
              </h1>
              <p className="text-sm font-normal" style={{ color: isDark ? '#a0958d' : '#6b5c50' }}>
                Here's your health overview for today.
              </p>
            </div>

            {/* stat cards */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6"
              data-sal="slide-up" data-sal-delay="100" data-sal-duration="700"
            >
              {statCards.map(card => (
                <div key={card.label} className="stat-card">
                  <div
                    className="stat-icon"
                    style={{ background: `${card.color}18`, color: card.color }}
                    aria-hidden="true"
                  >
                    {card.icon}
                  </div>
                  <p className="text-xs font-normal mb-1" style={{ color: isDark ? '#a0958d' : '#6b5c50' }}>
                    {card.label}
                  </p>
                  <p className="text-2xl font-normal" style={{ color: isDark ? '#e8d5c0' : '#4a3b2f' }}>
                    {card.value}
                  </p>
                </div>
              ))}
            </div>

            {/* chart */}
            <div
              className="chart-card"
              data-sal="slide-up" data-sal-delay="200" data-sal-duration="700"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-normal" style={{ color: isDark ? '#e8d5c0' : '#4a3b2f' }}>
                  Weekly Calories
                </h2>
                <span
                  className="text-xs font-normal px-3 py-1 rounded-full"
                  style={{ background: isDark ? '#342a22' : '#f5e6d8', color: "#c8956c" }}
                >
                  This week
                </span>
              </div>
              <Bar data={chartData} options={chartOptions} aria-label="Weekly calories bar chart" />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}