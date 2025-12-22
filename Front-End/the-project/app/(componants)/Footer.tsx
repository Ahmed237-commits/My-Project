// // app/components/Footer.tsx
// import React from 'react'
// import styles from '@/app/Styles.module.css'
// import Image from 'next/image'
// import Link from 'next/link'
// import SocialLinks from './Links'
// import { FaInstagram , FaTwitter , FaFacebook } from 'react-icons/fa'
// import { getServerSession } from 'next-auth'
// import authOptions from '../lib/nextAuth'

// const Footer = async() => {
//   const session =await getServerSession(authOptions)
//   return (
//     <footer className="bg-[#e3dbcf] text-[#5A4A42] p-10">
//       <div className={styles.footerContainer}>
//         {/* Quick Look */}
//         <div className={styles.footerColumn}>
//           <h4>Quick Look</h4>
//           <p>
//             We help students master English with personalized lessons, real-world
//             practice, and a teacher who cares about results.
//           </p>
//         </div>

//         {/* Useful Links */}
//         <div className={styles.footerColumn}>
//           <h4>Useful Links</h4>
//           <ul>
//             <li><Link href="/">Home</Link></li>
//             <li><Link href="/Lessons">Lessons</Link></li>
//             <li><Link href="/Contact">Contact</Link></li>
//             <li><Link href={ session ? '' : '/signIn'}>Sign In</Link></li>
//           </ul>
//         </div>
// <SocialLinks />

//         {/* Subscribe */}
//         <div className={styles.footerColumn}>
//           <h4>Subscribe</h4>
//           <form>
//             <input
//               type="email"
//               placeholder="Your email address"
//               required
//               className="p-2 mt-1 border border-black rounded w-full"
//             />
//             <button
//               type="submit"
//               className="mt-3 px-4 py-2 bg-[#5A4A42] text-white rounded hover:bg-[#4a3b34] cursor-pointer"
//             >
//               Subscribe
//             </button>
//           </form>
//         </div>
//       </div>

//       <div className={`${styles.footerBottom} text-center mt-6`}>
//         &copy; {new Date().getFullYear()} English Mastery Zone. All rights reserved.
//       </div>
//     </footer>
//   )
// }

// export default Footer

// app/components/Footer.tsx
import React from 'react'
import styles from '@/app/Styles.module.css'
import Image from 'next/image'
import Link from 'next/link'
import SocialLinks from './Links'
import { FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa'
import { getServerSession } from 'next-auth'
import authOptions from '../lib/nextAuth'
import { useTheme } from '../context/ThemeContext'

const Footer = async () => {
  const session = await getServerSession(authOptions)
  // Note: Since this is a server component (async), we can't use useTheme hook directly here if we want it to be responsive.
  // However, the file structure suggests this might be intended as a client component or we need a wrapper.
  // Given the previous patterns, I will convert this to a client component to support dynamic theming.
  // But wait, it uses getServerSession which is server-side. 
  // Strategy: We will make a client wrapper for the content or use a client component for the theme part.
  // Actually, looking at Header.tsx, it is "use client". Let's check if we can make Footer "use client".
  // If we make it "use client", we must use useSession instead of getServerSession.

  return <FooterContent session={session} />
}

const FooterContent = ({ session }: { session: any }) => {
  'use client';

  return (
    <footer className="bg-[#e3dbcf] text-[#5A4A42] p-10">
      <div className={styles.footerContainer}>
        {/* About HealthZone */}
        <div className={styles.footerColumn}>
          <h4>About HealthZone</h4>
          <p>
            We guide you toward a healthier lifestyle — from balanced nutrition and simple workouts
            to mental wellness and better daily habits.
          </p>
        </div>

        {/* Useful Links */}
        <div className={styles.footerColumn}>
          <h4>Quick Links</h4>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/bmi">BMI</Link></li>
            <li><Link href="/workout">Workouts</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href={session ? '' : '/signIn'}>Sign In</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <SocialLinks />

        {/* <div className={styles.footerColumn}>
          <h4>Follow Us</h4>
          <div className="flex gap-4 text-2xl mt-2">
            <Link href="https://facebook.com" target="_blank" aria-label="Facebook">
              <FaFacebook className="hover:text-[#3b5998] transition" />
            </Link>
            <Link href="https://twitter.com" target="_blank" aria-label="Twitter">
              <FaTwitter className="hover:text-[#1DA1F2] transition" />
            </Link>
            <Link href="https://instagram.com" target="_blank" aria-label="Instagram">
              <FaInstagram className="hover:text-[#E1306C] transition" />
            </Link>
          </div>
        </div> */}

        {/* Subscribe */}
        <div className={styles.footerColumn}>
          <h4>Subscribe</h4>
          <p>Get weekly tips on fitness, nutrition, and motivation straight to your inbox.</p>
          <form className="mt-2">
            <input
              type="email"
              placeholder="Your email address"
              required
              className="p-2 mt-1 border border-black rounded w-full"
            />
            <button
              type="submit"
              className="mt-3 px-4 py-2 bg-[#5A4A42] text-white rounded hover:bg-[#4a3b34] cursor-pointer"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className={`${styles.footerBottom} text-center mt-6`}>
        &copy; {new Date().getFullYear()} HealthZone. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
