'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import sal from 'sal.js';
import 'sal.js/dist/sal.css';
import  Icon  from '@/theEnvironment/1762025728119.png';
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

  return (
    <div className="bg-gray-50 text-gray-800 font-sans leading-relaxed">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#EFE7DC] to-[#5a4a42ab] z-0"></div>

        <div className="relative z-10 flex flex-col items-center p-4">
          <div className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4">
            <Image
              src={Icon} // 🔹 ضع هنا شعار موقعك
              alt="Your Health Logo"
              width={224}
              height={224}
              className="object-contain w-full h-full hover:scale-105 transition-transform"
            />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-2 drop-shadow-md">
            Take Control of Your Health — Every Day
          </h1>
          <p className="text-base md:text-xl text-gray-700 max-w-2xl mb-6">
            Welcome to {aboutInfo.siteName}. Your smart assistant for fitness, nutrition, and a balanced lifestyle.
          </p>
          <Link
            href="/bmi"
            className="bg-[#5A4A42] hover:bg-[#4a3b34] text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105"
          >
            Start Your Fitness Journey
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-16 px-4 md:px-12 bg-white"
        data-sal="slide-up"
        data-sal-delay="150"
        data-sal-duration="500"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">About {aboutInfo.siteName}</h2>
          <p className="text-lg text-gray-700 mb-6">{aboutInfo.description}</p>
          <p className="text-lg text-gray-700 mb-6">{aboutInfo.mission}</p>
        </div>
      </section>

      {/* Values / Approach */}
      <section id="values" className="py-16 px-4 md:px-12 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
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
                className="bg-indigo-50 p-6 rounded-xl shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl"
              >
                <div className="text-5xl mb-4 text-indigo-600">{value.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section id="founder" className="py-16 px-4 md:px-12 bg-white" data-sal="zoom-in" data-sal-delay="150">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Meet the Founder</h2>
          <p className="text-lg text-gray-700 mb-4">
            {aboutInfo.aboutFounder}
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 md:px-12 bg-[#e3dbcf] text-[#5A4A42] text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Building a Healthier You Today
          </h2>
          <p className="text-lg mb-8">
            Explore tools, track your progress, and make every day count toward your goals.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link
              href="/workout"
              className="bg-[#5A4A42] text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-[#4a3b34]"
            >
              View Workout Plans
            </Link>
            <Link
              href="/Contact"
              className="border-2 border-[#5A4A42] text-[#5A4A42] font-bold py-3 px-8 rounded-full hover:bg-[#5A4A42] hover:text-white"
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
