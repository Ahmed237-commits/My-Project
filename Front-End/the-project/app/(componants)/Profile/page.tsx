'use client';
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from 'next-auth/react';
import { useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
const ProfilePage = () => {
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const theRefOfTheInput = useRef<HTMLInputElement>(null);
  const [role, setRole] = React.useState("");
  const [bio, setBio] = React.useState("");
  const user = {
    name: session?.user?.name || "Ahmed Hassan",
    email: session?.user?.email || "ahmed@example.com",
    role: role || "Student",
    bio: bio || "You Dont have a bio yet. Please edit your profile to add one.",
    avatar: session?.user?.image || "/student-avatar.jpg",
    id: session?.user?.id || "1"
  };

  return (
    <div className={`min-h-screen flex flex-col items-center py-12 px-4 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#EFE7DC]'}`}>
      {/* Profile Card */}
      <div className={`rounded-2xl shadow-lg p-8 w-full max-w-2xl text-center transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden shadow-md">
            <Image
              src={user.avatar}
              alt={user.name}
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* User Info */}
        {/* User Info */}
        <h1 className={`text-3xl mb-2 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-[#5A4A42]'}`}>{user.name}</h1>
        <p className={`mb-4 transition-colors duration-300 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{user.email}</p>
        <span className="inline-block bg-[#F59E0B]  text-white px-4 py-1 rounded-full text-2xl mb-4">
          {user.role}
        </span>

        <p className={`transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Id:{user.id}</p>
        {/* Bio */}
        {/* Bio */}
        <input
          ref={theRefOfTheInput}
          type="text"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className={`border rounded-md p-2 mb-4 outline-none border-none w-full transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'}`}
          placeholder="Write Your Bio Here..."
        />
        {/* <button onClick={() => setBio(bio)} className="mb-4 bg-[#5A4A42] cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-[#eee] hover:text-[#5A4A42] text-2xl transition-colors" onClickCapture={() => {theRefOfTheInput.current?.disabled}}>Save Bio</button> */}
        <p className={`mb-6 transition-colors duration-300 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{user.bio}</p>

        {/* Settings Section */}
        <div className="w-full mb-6 text-left">
          <h2 className={`text-xl mb-4 border-b pb-2 transition-colors duration-300 ${theme === 'dark' ? 'text-white border-gray-700' : 'text-[#5A4A42] border-gray-200'}`}>Settings</h2>

          {/* Theme Toggle */}
          <div className={`flex items-center justify-between mb-4 p-3 rounded-lg transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-800 text-yellow-400' : 'bg-yellow-100 text-yellow-600'}`}>
                {theme === 'dark' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                  </svg>
                )}
              </div>
              <div>
                <p className={`transition-colors duration-300 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Appearance</p>
                <p className={`text-sm transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#5A4A42] focus:ring-offset-2 ${theme === 'dark' ? 'bg-[#5A4A42]' : 'bg-gray-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Notifications Placeholder */}
          <div className={`flex items-center justify-between mb-4 p-3 rounded-lg opacity-70 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
              </div>
              <div>
                <p className={`transition-colors duration-300 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Notifications</p>
                <p className={`text-sm transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Manage your alerts</p>
              </div>
            </div>
            <span className={`text-xs px-2 py-1 rounded transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-500'}`}>Coming Soon</span>
          </div>

          {/* API Key Link */}
          <Link href="/api-key">
            <div className={`flex items-center justify-between mb-4 p-3 rounded-lg transition-colors duration-300 cursor-pointer hover:opacity-80 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                  </svg>
                </div>
                <div>
                  <p className={`font-medium transition-colors duration-300 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>API Key</p>
                  <p className={`text-sm transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Manage your access keys</p>
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </Link>

          {/* Privacy Link */}
          <Link href="/privacy">
            <div className={`flex items-center justify-between p-3 rounded-lg transition-colors duration-300 cursor-pointer hover:opacity-80 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-100 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <div>
                  <p className={`transition-colors duration-300 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Privacy</p>
                  <p className={`text-sm transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Password & Security</p>
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </Link>
        </div>
        {/* Actions */}
        <div className="flex justify-center gap-4">
          {/* <Link
            href="/edit-profile"
            className="bg-[#5A4A42] border-2 text-white px-6 py-2 rounded-lg hover:bg-[#eee] hover:border-[#5A4A42]  hover:border-2 hover:text-[#5A4A42] text-2xl transition-colors"
          >
            Edit Profile
          </Link> */}
          <Link
            href="/dashBoard"
            className={`border-2 text-center text-lg px-6 py-2 rounded-lg transition-colors duration-300 ${theme === 'dark' ? 'border-white text-white hover:bg-white hover:text-gray-900' : 'border-[#5A4A42] text-[#5A4A42] hover:bg-[#5A4A42] hover:text-white'}`}
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
