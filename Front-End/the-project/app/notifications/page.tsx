'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useBMI } from '../context/BMIContext';
import Link from 'next/link';

const Page = () => {
  const { bmi } = useBMI();
  const [notifications, setNotifications] = useState<string[]>([]);

  // Add BMI Notification whenever BMI exists
  useEffect(() => {
    if (bmi) {
      const message = `Your current BMI is ${bmi}`;

      setNotifications((prev) => {
        // Prevent duplicate notifications
        if (!prev.includes(message)) {
          return [...prev, message];
        }
        return prev;
      });
    }
  }, [bmi]);

  return (
    <>
      <div className="flex justify-center items-center h-full w-full">
        <h1 className="text-4xl font-light">Notifications</h1>
      </div>

      <div className="mt-6 w-full flex flex-col items-center">
        {notifications.length > 0 ? (
          notifications.map((notif, index) => (
            <div
              key={index}
              className="mt-3 p-4 border rounded-lg w-1/2 bg-gray-100 shadow"
            >
              <p className="text-lg">{notif}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 mt-4">No notifications yet.</p>
        )}

        <Link
          href="/dashBoard"
          className="mt-6 text-[#5A4A42] font-medium text-[26px] text-center hover:text-white hover:bg-[#5A4A42] hover:rounded-lg hover:py-2 hover:px-4 hover:shadow-lg hover:transition hover:duration-300 w-[200px] h-[50px] flex items-center justify-center"
        >
          Return To DashBoard
        </Link>
      </div>
    </>
  );
};

export default Page;
