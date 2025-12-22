'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';

const PrivacyPage = () => {
    const { theme } = useTheme();

    return (
        <div className={`min-h-screen flex flex-col items-center py-12 px-4 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-[#EFE7DC] text-[#5A4A42]'}`}>
            <div className={`w-full max-w-4xl rounded-2xl shadow-lg p-8 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>

                {/* Header */}
                <div className="mb-8 border-b pb-4 border-gray-200 dark:border-gray-700">
                    <h1 className="text-4xl mb-2">Privacy Policy</h1>
                    <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Last updated: December 5, 2025</p>
                </div>

                {/* Content */}
                <div className="space-y-8">
                    <section>
                        <h2 className="text-2xl mb-4">1. Information We Collect</h2>
                        <p className={`leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            We collect information you provide directly to us, such as when you create an account, update your profile, or use our services. This may include your name, email address, and any other information you choose to provide.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl mb-4">2. How We Use Your Information</h2>
                        <p className={`leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect our company and our users. We also use this information to offer you tailored content – like giving you more relevant search results and ads.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl mb-4">3. Data Security</h2>
                        <p className={`leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            We work hard to protect our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold. We review our information collection, storage, and processing practices, including physical security measures, to guard against unauthorized access to systems.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl mb-4">4. Contact Us</h2>
                        <p className={`leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            If you have any questions about this Privacy Policy, please contact us at privacy@example.com.
                        </p>
                    </section>
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

export default PrivacyPage;
