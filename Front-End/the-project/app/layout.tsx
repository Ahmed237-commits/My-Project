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
  weight: "400",
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
      <body className={`${jomhuria.variable} ${cairo.variable} antialiased`}>
        <Suspense fallback={<div className="flex text-4xl items-center justify-center">Loading...</div>}>
          <BMIProvider>
            <MySessionProvider>
              <HealthProvider>
                <TrackerProvider>
                  <ThemeProvider>
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
    </html >
  );
}