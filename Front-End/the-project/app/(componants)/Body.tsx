"use client";
import React, { useEffect } from "react";
import styles from "@/app/Styles.module.css";
import {
  FaHeartbeat,
  FaAppleAlt,
  FaRunning,
  FaCalculator,
  FaBed,
  FaWalking,
  FaChartLine,
  FaArrowRight,
} from "react-icons/fa";

import Link from "next/link";
import sal from "sal.js";
// @ts-ignore: allow side-effect CSS import without type declarations
import "sal.js/dist/sal.css";
import { useSession } from "next-auth/react";
import { useTheme } from "../context/ThemeContext";

const Body = () => {
  useEffect(() => {
    sal({
      threshold: 0.1,
      once: true,
      root: null,
    });
  }, []);

  const { data, status } = useSession();
  const { theme } = useTheme();

  return (
    <section className="px-5 py-20 text-center text-4xl bg-[#fdfaf6] text-[#5c4b42]">
      <h2 className="text-4xl md:text-6xl mb-6 text-[#5c4b42]">
        Live a Healthier Life 🌿
      </h2>
      <p
        className={`${styles.description} max-w-3xl mx-auto mb-12 text-lg font-normal`}
      >
        Take control of your health — eat better, move more, sleep deeper, and
        build habits that help you feel your best every single day.
      </p>

      {/* Navigation Cards */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <Link href="/bmi" className="block h-full">
          <div
            className={`p-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white'}`}
            data-sal="slide-up"
            data-sal-delay="100"
            data-sal-duration="800"
          >
            <FaCalculator className="text-6xl mb-4 text-[#5c4b42]" />
            <h3 className="text-2xl font-bold mb-2">BMI Calculator</h3>
            <p className="opacity-80">Check your Body Mass Index instantly.</p>
          </div>
        </Link>

        <Link href="/workout" className="block h-full">
          <div
            className={`p-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white'}`}
            data-sal="slide-up"
            data-sal-delay="150"
            data-sal-duration="800"
          >
            <FaRunning className="text-6xl mb-4 text-[#5c4b42]" />
            <h3 className="text-2xl font-bold mb-2">Workout Plan</h3>
            <p className="opacity-80">Customized exercises for your goals.</p>
          </div>
        </Link>

        <Link href="/caloriestracker" className="block h-full">
          <div
            className={`p-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white'}`}
            data-sal="slide-up"
            data-sal-delay="200"
            data-sal-duration="800"
          >
            <FaAppleAlt className="text-6xl mb-4 text-[#5c4b42]" />
            <h3 className="text-2xl font-bold mb-2">Calories Tracker</h3>
            <p className="opacity-80">Log your meals and track nutrition.</p>
          </div>
        </Link>

        <Link href="/caloriescalculator" className="block h-full">
          <div
            className={`p-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white'}`}
            data-sal="slide-up"
            data-sal-delay="250"
            data-sal-duration="800"
          >
            <FaChartLine className="text-6xl mb-4 text-[#5c4b42]" />
            <h3 className="text-2xl font-bold mb-2">Calories Calculator</h3>
            <p className="opacity-80">Calculate daily caloric needs.</p>
          </div>
        </Link>

        <Link href="/sleepcalculator" className="block h-full">
          <div
            className={`p-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white'}`}
            data-sal="slide-up"
            data-sal-delay="300"
            data-sal-duration="800"
          >
            <FaBed className="text-6xl mb-4 text-[#5c4b42]" />
            <h3 className="text-2xl font-bold mb-2">Sleep Calculator</h3>
            <p className="opacity-80">Optimize your sleep cycles.</p>
          </div>
        </Link>

        <Link href="/stepscalculator" className="block h-full">
          <div
            className={`p-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white'}`}
            data-sal="slide-up"
            data-sal-delay="350"
            data-sal-duration="800"
          >
            <FaWalking className="text-6xl mb-4 text-[#5c4b42]" />
            <h3 className="text-2xl font-bold mb-2">Steps Calculator</h3>
            <p className="opacity-80">Track your daily movement.</p>
          </div>
        </Link>

        <Link href="/dashBoard" className="block h-full md:col-span-3">
          <div
            className={`p-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white'}`}
            data-sal="slide-up"
            data-sal-delay="400"
            data-sal-duration="800"
          >
            <FaHeartbeat className="text-6xl mb-4 text-[#5c4b42]" />
            <h3 className="text-2xl font-bold mb-2">My Dashboard</h3>
            <p className="opacity-80">View all your health stats in one place.</p>
          </div>
        </Link>
      </div>

      {/* إحصائيات */}
      <div
        className="mt-16 grid md:grid-cols-3 gap-6"
        data-sal="slide-up"
        data-sal-delay="200"
        data-sal-duration="800"
      >
        <div className="p-6 rounded-lg shadow-lg bg-white">
          <h4 className="text-4xl text-[#5c4b42]">90%</h4>
          <p>Improved daily energy levels</p>
        </div>
        <div className="p-6 rounded-lg shadow-lg bg-white">
          <h4 className="text-4xl text-[#5c4b42]">10k+</h4>
          <p>Active healthy members</p>
        </div>
        <div className="p-6 rounded-lg shadow-lg bg-white">
          <h4 className="text-4xl text-[#5c4b42]">30+</h4>
          <p>Professional wellness experts</p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12">
        <Link
          href={status === "authenticated" ? "" : "/signIn"}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg shadow-lg transition duration-300 bg-[#5c4b42] text-white hover:bg-[#463930]"
        >
          Start Your Health Journey <FaArrowRight />
        </Link>
      </div>
    </section >
  );
};

export default Body;
