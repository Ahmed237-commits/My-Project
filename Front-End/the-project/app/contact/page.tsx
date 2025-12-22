// قم بإنشاء ملف page.tsx داخل مجلد app/contact/
// يمكنك نسخ هذا الكود بالكامل واستخدامه مباشرة في مشروع Next.js

'use client'; // تفعيل وضع العميل للتعامل مع الـ Form

import Link from 'next/link';
import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'; // ستحتاج لتثبيت هذه المكتبة أولاً
import { useState , useEffect } from 'react';

import sal from "sal.js";
import "sal.js/dist/sal.css"

const socialLinks = [
  { href: "#", icon: FaFacebook, label: "Facebook" },
  { href: "#", icon: FaTwitter, label: "Twitter" },
  { href: "#", icon: FaInstagram, label: "Instagram" },
];

const ContactPage = () => {
  useEffect(() => {
      sal({
        threshold: .1,
        once: true,
        root: null
      });
    }, []);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
console.log(formData)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('Sending The Messege');

    try {
      setTimeout(() => {
        setStatus('Sent Your Messege succefully');
        setFormData({ name: '', email: '', message: '' });
      }, 1500);

    } catch (error) {
      setStatus('There Is An Error, Try Again');
    }
  };

  return (
    <div className="bg-gray-50 text-gray-800 font-sans leading-relaxed" dir="rtl">
      {/* قسم المقدمة (Hero Section) */}
      <section className="bg-gradient-to-br from-[#e3dbcf] to-[#5A4A42] text-white py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-md">
Contact Us
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto">
We Are Happy For your All Responses 
        </p>
      </section>

      <main className="container mx-auto px-4 py-16" data-sal='slide-up' data-sal-delay='150' data-sal-duration='800'>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">معلومات الاتصال</h2>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <FaMapMarkerAlt className="text-2xl text-[#5A4A42] flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg">Location</h3>
                  <p className="text-gray-600">
Egypt - Behira -AboHommos
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <FaPhone className="text-2xl text-[#5A4A42] flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg">Phone Number</h3>
                  <p className="text-gray-600">+20 1273024592</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <FaEnvelope className="text-2xl text-[#5A4A42] flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg">Email</h3>
                  <p className="text-gray-600">aethefifhtofjuly@gmail.com</p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="font-bold text-lg mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                {socialLinks.map((link, index) => (
                  <Link key={index} href={link.href} aria-label={link.label} className={link.label === 'Instagram'?  'text-[#5A4A42] hover:text-[#833ab4] transition-colors': `text-[#5A4A42] hover:text-indigo-800 transition-colors`}>
                    <link.icon className="text-3xl" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Send Messeges</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Send Messege</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-[#5A4A42] cursor-pointer text-white font-bold py-3 px-6 rounded-md shadow-lg transition-transform transform hover:scale-105 hover:bg-indigo-700"
              >
Sending Messeges
              </button>
              {status && (
                <p className={`mt-4 text-center ${status.includes('succefully') ? 'text-green-600' : 'text-red-600'}`}>
                  {status}
                </p>
              )}
            </form>
          </div>
        </div>
      </main>
      
      <section className="py-16">
        <div className="container mx-auto px-4">
        </div>
      </section>
    </div>
  );
};

export default ContactPage;