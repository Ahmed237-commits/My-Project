"use client";
import { useTheme } from "../context/ThemeContext";

export default function Home() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center 
      bg-white text-black dark:bg-gray-900 dark:text-white">

      <h1 className="text-4xl font-bold mb-6">
        {theme === "light" ? "Light Mode" : "Dark Mode"}
      </h1>

      <button
        onClick={toggleTheme}
        className="px-4 py-2 rounded-lg bg-blue-500 text-white dark:bg-yellow-500"
      >
        Toggle Mode
      </button>
    </div>
  );
}
