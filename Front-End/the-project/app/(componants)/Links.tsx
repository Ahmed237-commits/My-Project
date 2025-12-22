'use client'

import React from 'react'
import styles from '@/app/Styles.module.css'
import Link from 'next/link'
import { FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa'

const socialLinks = [
  { href: "https://facebook.com", icon: <FaFacebook size={30} />, alt: "Facebook" },
  { href: "https://x.com", icon: <FaTwitter size={30} />, alt: "X" },
  { href: "https://instagram.com", icon: <FaInstagram size={30} />, alt: "Instagram" }
]

const SocialLinks = () => {
  return (
    <div className={`${styles.footerColumn} text-center`}>
      <h4 className="text-xl font-bold mb-4 text-[#5A4A42]">Follow Us</h4>
      <div className="flex justify-center gap-6">
        {socialLinks.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center transition-transform transform hover:scale-110"
          >
            <div className="w-[60px] h-[60px] flex items-center justify-center rounded-full shadow-lg border-2 border-[#5A4A42] hover:border-[#F59E0B] transition-all duration-300 text-[#5A4A42] hover:text-[#F59E0B]">
              {link.icon}
            </div>
            <p className="mt-2 text-sm text-[#5A4A42]">{link.alt}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default SocialLinks
