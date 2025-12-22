'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';

const ApiKeyPage = () => {
    const { theme } = useTheme();
    const [apiKey, setApiKey] = useState('sk_live_51Mz...92xY');
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText('sk_live_51Mz92xY'); // Mock full key
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleRegenerate = () => {
        // Mock regeneration
        const newKeyPart = Math.random().toString(36).substring(7);
        setApiKey(`sk_live_${newKeyPart}...${Math.random().toString(36).substring(7)}`);
    };

    return (
        <div className={`min-h-screen flex flex-col items-center py-12 px-4 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-[#EFE7DC] text-[#5A4A42]'}`}>
            <div className={`w-full max-w-3xl rounded-2xl shadow-lg p-8 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>

                {/* Header */}
                <div className="mb-8 border-b pb-4 border-gray-200 dark:border-gray-700">
                    <h1 className="text-4xl mb-2">API Key Management</h1>
                    <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Manage your secret API keys for external access.</p>
                </div>

                {/* Content */}
                <div className="space-y-8">

                    {/* Warning Alert */}
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    Your API key gives full access to your account. Never share it with anyone.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Key Display */}
                    <div>
                        <label className={`block text-sm mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Active API Key
                        </label>
                        <div className="flex gap-2">
                            <div className={`flex-grow p-3 rounded-lg font-mono text-sm flex items-center ${theme === 'dark' ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                                {apiKey}
                            </div>
                            <button
                                onClick={handleCopy}
                                className={`px-4 py-2 rounded-lg transition-colors ${isCopied
                                    ? 'bg-green-500 text-white'
                                    : theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                                    }`}
                            >
                                {isCopied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4">
                        <button
                            onClick={handleRegenerate}
                            className="text-red-500 hover:text-red-700 text-sm flex items-center gap-2 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                            Regenerate Key
                        </button>
                        <p className={`mt-2 text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                            Regenerating will invalidate the current key immediately.
                        </p>
                    </div>

                </div>

                {/* Footer Action */}
                <div className="mt-12 flex justify-center">
                    <Link
                        href="/Profile"
                        className={`px-8 py-3 rounded-lg transition-colors duration-300 ${theme === 'dark'
                            ? 'bg-[#5A4A42] text-white hover:bg-white hover:text-[#5A4A42]'
                            : 'bg-[#5A4A42] text-white hover:bg-[#EFE7DC] hover:text-[#5A4A42] border-2 border-transparent hover:border-[#5A4A42]'
                            }`}
                    >
                        Back to Profile
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ApiKeyPage;
