'use client'; // تفعيل وضع العميل للتعامل مع الـ Form والـ Hooks

import Link from 'next/link';
import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { useState , useEffect } from 'react';
import sal from "sal.js";
import { useTheme } from '../context/ThemeContext';
import emailjs from '@emailjs/browser'; // استيراد مكتبة EmailJS

const socialLinks = [
  { href: "#", icon: FaFacebook, label: "Facebook" },
  { href: "#", icon: FaTwitter, label: "Twitter" },
  { href: "#", icon: FaInstagram, label: "Instagram" },
];

const ContactPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    // عمل Init للـ EmailJS باستخدام الـ Public Key الخاص بك
    emailjs.init("TFMSBH0JY4zVDp6dr");

    sal({
      threshold: .1,
      once: true,
      root: null
    });
  }, []);

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('Sending... ⏳');
    setLoading(true);

    try {
      // تجهيز الـ Parameters بناءً على إعدادات الـ EmailJS
      const templateParams = {
        name: formData.name,
        user_email: formData.email,
        to_email: 'aethefifthofjuly@gmail.com',
        message: formData.message,
        timestamp: new Date().toLocaleString('en-US'),
        title: 'Hello Ahmed Eissa'
      };

      // إرسال الإيميل باستخدام الـ Service ID والـ Template ID
      await emailjs.send('service_eooljyp', 'template_0fzf69j', templateParams);

      setStatus('Your message has been sent successfully! ✅');
      setFormData({ name: '', email: '', message: '' }); // تفريغ الحقول بعد النجاح
    } catch (error) {
      console.error('EmailJS error:', error);
      setStatus('Failed to send. Please try again later. ❌');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* حقن الستايل المخصص للتحكم السلس في ألوان الخلفيات والنصوص بناءً على الـ Dark Mode */}
      <style jsx global>{`
        .contact-root {
          background: ${isDark ? '#1a1512' : '#fdfaf6'};
          color: ${isDark ? '#f0e8df' : '#2d1f14'};
          transition: background 300ms, color 300ms;
          min-height: 100vh;
        }
        .contact-card {
          background: ${isDark ? '#251e19' : '#ffffff'};
          border: 1.5px solid ${isDark ? '#3d332a' : '#ecddd0'};
          box-shadow: ${isDark ? '0 10px 30px rgba(0,0,0,.3)' : '0 10px 30px rgba(74,59,47,.05)'};
          transition: background 300ms, border-color 300ms, box-shadow 300ms;
        }
        .contact-input {
          background: ${isDark ? '#1a1512' : '#fdfaf6'} !important;
          border-color: ${isDark ? '#3d332a' : '#ecddd0'} !important;
          color: ${isDark ? '#fff' : '#000'} !important;
        }
        .contact-input:focus {
          border-color: #c8956c !important;
          border-width: 1.5px;
        }
        .contact-muted {
          color: ${isDark ? '#a0958d' : '#6b5c50'};
        }
        .contact-heading {
          color: ${isDark ? '#e8d5c0' : '#4a3b2f'};
        }
      `}</style>
      <div className="contact-root font-sans leading-relaxed" dir="ltr">
        
        {/* قسم المقدمة (Hero Section) */}
        <section className={`py-20 text-center transition-all duration-300 ${isDark ? 'bg-gradient-to-br from-[#2d241e] to-[#120e0b]' : 'bg-gradient-to-br from-[#e3dbcf] to-[#5A4A42]'} text-white`}>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-md">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90 px-4">
            We Are Happy For all your Responses
          </p>
        </section>

        {/* المحتوى الرئيسي */}
        <main className="container mx-auto px-4 py-16" data-sal='slide-up' data-sal-delay='150' data-sal-duration='800'>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            
            {/* كارت معلومات الاتصال */}
            <div className="contact-card p-8 rounded-2xl">
              <h2 className="text-2xl font-bold contact-heading mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <FaMapMarkerAlt className="text-xl text-[#c8956c] mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-base contact-heading">Location</h3>
                    <p className="text-sm contact-muted">Egypt - Behira - AboHommos</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <FaPhone className="text-xl text-[#c8956c] mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-base contact-heading">Phone Number</h3>
                    <p className="text-sm contact-muted" dir="ltr">+20 1273024592</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <FaEnvelope className="text-xl text-[#c8956c] mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-base contact-heading">Email</h3>
                    <p className="text-sm contact-muted">aethefifhtofjuly@gmail.com</p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="font-bold text-base contact-heading mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  {socialLinks.map((link, index) => (
                    <Link 
                      key={index} 
                      href={link.href} 
                      aria-label={link.label} 
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${                        isDark ? 'bg-[#342a22] text-[#c8956c] hover:bg-[#c8956c] hover:text-white' : 'bg-[#f5e6d8] text-[#5A4A42] hover:bg-[#5A4A42] hover:text-white'
                      }`}                    >
                      <link.icon className="text-xl" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* كارت إرسال الرسائل */}
            <div className="contact-card p-8 rounded-2xl">
              <h2 className="text-2xl font-bold contact-heading mb-6">Send Messages</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium contact-muted mb-1.5">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border rounded-xl contact-input transition-all outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium contact-muted mb-1.5">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border rounded-xl contact-input transition-all outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium contact-muted mb-1.5">Send Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border rounded-xl contact-input transition-all outline-none resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-[#c8956c] hover:bg-[#b07e56] cursor-pointer text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all transform active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Sending...' : 'Sending Messages'}
                </button>

                {status && (
                  <p className={`mt-4 text-center text-sm font-medium ${status.includes('successfully') ? 'text-green-500' : 'text-amber-500'}`}>
                    {status}
                  </p>
                )}
              </form>
            </div>

          </div>
        </main>
      </div>
    </>
  );
};

export default ContactPage;