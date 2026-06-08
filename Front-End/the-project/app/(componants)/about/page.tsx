'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import sal from 'sal.js';
// @ts-ignore: side-effect import of CSS without type declarations
import 'sal.js/dist/sal.css';
import Icon from '@/theEnvironment/1762025728119.png';
import { useTheme } from '@/app/context/ThemeContext';

const aboutInfo = {
  siteName: "Your Health",
  founder: "Ahmed Eissa",
  description:
    "Your Health is a smart, modern platform built to help you take control of your fitness journey — from calculating your BMI, to planning the perfect workout, and tracking your daily calories.",
  mission:
    "Our mission is to make health and fitness simple, practical, and accessible for everyone. Whether you want to lose fat, gain muscle, or just stay active, Your Health is your daily companion.",
  aboutFounder:
    "I'm Ahmed Eissa, the creator and developer of Your Health. As a fitness enthusiast and full stack developer, I built this platform to combine my two passions: technology and health. I believe small, consistent steps lead to big, lasting change.",
  values: [
    {
      icon: "💪",
      title: "Personalized Fitness",
      description:
        "We help you understand your body and create customized workout and nutrition plans that fit your goals."
    },
    {
      icon: "🧠",
      title: "Smart & Data-Driven",
      description:
        "Track your BMI, calories, and progress with intelligent tools that make health measurable and motivating."
    },
    {
      icon: "🌱",
      title: "Sustainable Lifestyle",
      description: 
        "We focus on long-term habits, not short-term diets — because real health starts with balance."
    }
  ],
};

const AboutPage = () => {
  useEffect(() => {
    sal({
      threshold: 0.2,
      once: true,
      root: null
    });
  }, []);

  // جلب حالة الثيم الحالية (إما 'dark' أو 'light')
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`font-sans leading-relaxed transition-colors duration-300 ${isDark ? 'bg-[#121212] text-gray-200' : 'bg-gray-50 text-gray-800'}`}>
      
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-center">
        {/* تغيير التدرج اللوني للخلفية بناءً على الثيم */}
        <div className={`absolute inset-0 z-0 bg-gradient-to-br ${isDark ? 'from-[#2d231a] to-[#121212]' : 'from-[#EFE7DC] to-[#5a4a42ab]'}`}></div>

        <div className="relative z-10 flex flex-col items-center p-4">
          <div className={`w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-4 shadow-lg mb-4 ${isDark ? 'border-gray-800' : 'border-white'}`}>
            <Image
              src={Icon}
              alt="Your Health Logo"
              width={224}
              height={224}
              className="object-contain w-full h-full hover:scale-105 transition-transform"
            />
          </div>
          <h1 className={`text-3xl md:text-5xl font-extrabold mb-2 drop-shadow-md ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Take Control of Your Health — Every Day
          </h1>
          <p className={`text-base md:text-xl max-w-2xl mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Welcome to {aboutInfo.siteName}. Your smart assistant for fitness, nutrition, and a balanced lifestyle.
          </p>
          <Link
            href="/bmi"
            className={`font-bold py-3 px-8 rounded-full shadow-lg transition-all hover:scale-105 ${isDark ? 'bg-[#e0aa80] text-[#121212] hover:bg-[#f0be99]' : 'bg-[#5A4A42] text-white hover:bg-[#4a3b34]'}`}
          >
            Start Your Fitness Journey
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className={`py-16 px-4 md:px-12 transition-colors duration-300 ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`}
        data-sal="slide-up"
        data-sal-delay="150"
        data-sal-duration="500"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-3xl md:text-4xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>About {aboutInfo.siteName}</h2>
          <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{aboutInfo.description}</p>
          <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{aboutInfo.mission}</p>
        </div>
      </section>

      {/* Values / Approach */}
      <section id="values" className={`py-16 px-4 md:px-12 transition-colors duration-300 ${isDark ? 'bg-[#121212]' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto text-center">
          <h2 className={`text-3xl md:text-4xl font-bold mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            What Makes Us Different
          </h2>
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            data-sal="slide-up"
            data-sal-delay="150"
            data-sal-duration="800"
          >
            {aboutInfo.values.map((value, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl shadow-lg border transition-all transform hover:scale-105 hover:shadow-xl ${isDark ? 'bg-[#1e1e1e] border-[#332920]' : 'bg-indigo-50 border-transparent'}`}
              >
                <div className={`text-5xl mb-4 ${isDark ? 'text-[#e0aa80]' : 'text-indigo-600'}`}>{value.icon}</div>
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{value.title}</h3>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section id="founder" className={`py-16 px-4 md:px-12 transition-colors duration-300 ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`} data-sal="zoom-in" data-sal-delay="150">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-3xl md:text-4xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>Meet the Founder</h2>
          <p className={`text-lg mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {aboutInfo.aboutFounder}
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className={`py-16 px-4 md:px-12 text-center transition-colors duration-300 ${isDark ? 'bg-[#2d231a] text-[#f5e6d8]' : 'bg-[#e3dbcf] text-[#5A4A42]'}`}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Building a Healthier You Today
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Explore tools, track your progress, and make every day count toward your goals.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link
              href="/workout"
              className={`font-bold py-3 px-8 rounded-full shadow-lg transition-colors ${isDark ? 'bg-[#e0aa80] text-[#121212] hover:bg-[#f0be99]' : 'bg-[#5A4A42] text-white hover:bg-[#4a3b34]'}`}
            >
              View Workout Plans
            </Link>
            <Link
              href="/Contact"
              className={`border-2 font-bold py-3 px-8 rounded-full transition-all ${isDark ? 'border-[#e0aa80] text-[#e0aa80] hover:bg-[#e0aa80] hover:text-[#121212]' : 'border-[#5A4A42] text-[#5A4A42] hover:bg-[#5A4A42] hover:text-white'}`}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;