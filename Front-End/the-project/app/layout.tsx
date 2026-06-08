import type { Metadata } from "next";
import { Jomhuria, Cairo } from "next/font/google";
// @ts-ignore: side-effect import of CSS without module declarations
import "./globals.css";
import MetaData from "@/app/(componants)/MetaData"; 
import Path from "@/app/(componants)/Path";
import MySessionProvider from "./SessionProvider";
import { Suspense } from "react";
import { BMIProvider } from './context/BMIContext';
import { ThemeProvider } from './context/ThemeContext';
import { HealthProvider } from './context/HealthContext';
import { TrackerProvider } from './context/CaloriesTrackerContext';
import Icon from '@/theEnvironment/1762025728119.png'
const jomhuria = Jomhuria({
  variable: "--font-jomhuria",
  subsets: ["latin"],
  display: "swap",
  weight: ['400'],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["latin"],
  display: "swap",
  weight: "400", // ممتاز إنك مثبت الـ weight هنا تماشياً مع الـ Minimalist design
});

export const metadata: Metadata = {
  title: "Health Life",
  description: "Your health journey starts here",
  icons: {
    icon: Icon.src,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* استدعاء الـ Material Symbols رسميًا هنا عشان الأيقونات تظهر في كل صفحات المنصة بشكل سليم */}
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0" 
        />
      </head>
      <body className={`${jomhuria.variable} ${cairo.variable} antialiased font-normal`}>
        <Suspense fallback={<div className="flex text-4xl items-center justify-center min-h-screen">Loading...</div>}>
          <BMIProvider>
            <MySessionProvider>
              <HealthProvider>
                <TrackerProvider>
                  <ThemeProvider>
                    {/* التعديل هنا: غلفنا الـ Path والـ children والـ MetaData معاً داخل الـ Provider */}
                      <Path />
                      {children}
                      <MetaData />
                    </ThemeProvider>
                  </TrackerProvider>
              </HealthProvider>
            </MySessionProvider>
          </BMIProvider>
        </Suspense>
      </body>
    </html>
  );
}