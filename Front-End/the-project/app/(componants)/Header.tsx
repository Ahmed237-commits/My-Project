// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import Image from "next/image";
// import { useSession } from "next-auth/react";
// import { FaList, FaHome, FaUser, FaEnvelope, FaUsers, FaHeartbeat, FaChartLine, FaTimes } from "react-icons/fa";
// import { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useTheme } from "../context/ThemeContext";
// import logoImage from "@/theEnvironment/1762025728119.png";
// import SignOut from "./signOut";
// export const links = [
//   { name: "Home", path: "/", showInHeader: true, icon: <FaHome /> },
//   { name: "About", path: "/about", showInHeader: true, icon: <FaUser /> },
//   { name: "Contact", path: "/contact", showInHeader: true, icon: <FaEnvelope /> },
//   { name: "Community", path: "/community", showInHeader: true, icon: <FaUsers /> },
//   {
//     name: "Health",
//     showInHeader: true,
//     icon: <FaHeartbeat />,
//     subLinks: [
//       { name: "BMI Calculator", path: "/bmi", icon: "📊" },
//       { name: "Workout Plan", path: "/workout", icon: "💪" },
//       { name: "Calories Tracker", path: "/caloriestracker", icon: "🔥" },
//       { name: "Calories Calculator", path: "/caloriescalculator", icon: "🧮" },
//       { name: "Sleep Calculator", path: "/sleepcalculator", icon: "😴" },
//       { name: "Steps Calculator", path: "/stepscalculator", icon: "👣" },
//     ],
//   },
//   { name: "DashBoard", path: "/dashBoard", showInHeader: true, icon: <FaChartLine /> },
// ];

// // ●●● Avatar Component ●●●
// type User = {
//   name?: string | null;
//   image?: string | null;
// };

// export function UserAvatar({ user }: { user: User | null | undefined }) {
//   const first = user?.name?.charAt(0)?.toUpperCase() || "U";

//   return user?.image ? (
//     <div className="relative w-12 h-12 md:w-14 md:h-14">
//       <Image
//         src={user.image}
//         alt="User"
//         fill
//         sizes="(max-width: 768px) 48px, 56px"
//         className="rounded-full object-cover border-2 border-white shadow-md"
//         priority
//         unoptimized={true}
//       />
//     </div>
//   ) : (
//     <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl md:text-2xl font-bold border-2 border-white shadow-md">
//       {first}
//     </div>
//   );
// }

// // ●●● Header Component ●●●
// type HeaderProps = {
//   title: string;
//   description?: string;
// };

// export default function Header({ title, description }: HeaderProps) {
//   const [showMobile, setShowMobile] = useState(false);
//   const [openDropdown, setOpenDropdown] = useState<string | null>(null);
//   const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
//   const pathname = usePathname();
//   const { data, status } = useSession();
//   const { theme } = useTheme();

//   const mobileMenuRef = useRef<HTMLDivElement>(null);
//   const healthDropdownRef = useRef<HTMLDivElement>(null);

//   // Hide header on specific pages
//   const validPaths = links.flatMap(link => 
//     link.subLinks ? link.subLinks.map(sub => sub.path) : link.path || []
//   );
//   // if (["/signIn", "/signUp", "/dashBoard", "/community"].includes(pathname)) return null;
// const HIDE_HEADER_ROUTES = ["/signIn", "/signUp", "/dashBoard", "/community"];

// const shouldHideHeader =
//   HIDE_HEADER_ROUTES.includes(pathname) ||
//   (!validPaths.includes(pathname) && pathname !== "/");
// if (shouldHideHeader) {
//   return null;
// }

//   // إخفاء الهيدر للصفحات غير المعروفة
//   // if (!validPaths.includes(pathname) && pathname !== "/") {
//   //   return null;
//   // }

//   // Filter links based on authentication
//   const visibleLinks = links
//     .map((link) => {
//       if (link.subLinks) {
//         return {
//           ...link,
//           subLinks: link.subLinks.filter((sub) =>
//             !data && ["Sleep Calculator", "Steps Calculator"].includes(sub.name)
//               ? false
//               : true
//           ),
//         };
//       }
//       return link;
//     })
//     .filter((link) => (data ? true : link.name !== "DashBoard"));

//   // Close mobile menu on route change
//   useEffect(() => {
//     setShowMobile(false);
//     setOpenMobileDropdown(null);
//     setOpenDropdown(null);
//   }, [pathname]);

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       // Close desktop dropdown
//       if (openDropdown && healthDropdownRef.current && 
//           !healthDropdownRef.current.contains(e.target as Node)) {
//         setOpenDropdown(null);
//       }

//       // Close mobile menu
//       if (showMobile && mobileMenuRef.current && 
//           !mobileMenuRef.current.contains(e.target as Node) &&
//           !(e.target as Element).closest('[aria-label="Open mobile menu"]')) {
//         setShowMobile(false);
//         setOpenMobileDropdown(null);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [openDropdown, showMobile]);

//   // Handle sign out
//   const handleSignOut = async () => {
//     try {
//       // Here you should call your actual signOut function
//       console.log("Signing out user:", data?.user?.name);
//       // For example: await signOut({ callbackUrl: '/' });
//       window.location.href = "/";
//     } catch (error) {
//       console.error("Error signing out:", error);
//     }
//   };

//   return (
//     <header className="w-full relative bg-gradient-to-b from-white via-amber-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-[280px] md:min-h-[320px] flex flex-col shadow-lg">

//       {/* === Top Bar: Auth Left, Nav Right === */}
//       <div className="w-full flex justify-between items-center px-4 md:px-6 lg:px-8 py-4 md:py-5 z-30">

//         {/* LEFT: Auth Buttons and User Info */}
//         <div className="flex items-center gap-3 md:gap-4">
//           {status === "unauthenticated" ? (
//             <div className="flex gap-3">
//               <Link 
//                 href="/signIn" 
//                 className="text-base md:text-lg lg:text-xl border-2 border-[#5A4A42] text-[#5A4A42] 
//                 px-4 py-2 rounded-lg hover:bg-[#5A4A42] hover:text-white 
//                 transition-all duration-300 font-medium whitespace-nowrap"
//               >
//                 Sign In
//               </Link>
//               <Link 
//                 href="/signUp" 
//                 className="text-base md:text-lg lg:text-xl bg-[#5A4A42] text-white 
//                 px-4 py-2 rounded-lg hover:bg-[#4a3a32] 
//                 transition-all duration-300 font-medium whitespace-nowrap"
//               >
//                 Sign Up
//               </Link>
//             </div>
//           ) : status === "authenticated" ? (
//            <div className="flex items-center gap-3 md:gap-4">
//                <UserAvatar user={data?.user} />
//                  <div>
//                    <p className="text-lg md:text-xl lg:text-2xl text-amber-500 dark:text-amber-400 font-bold">
//                      Hi, {data?.user?.name?.split(' ')[0]}
//                    </p>
//                    <div className="mt-1 md:mt-2">
//                      <SignOut />
//                    </div>
//                  </div>
//                </div>
//           ) : null}
//         </div>

//         {/* RIGHT: Navigation and Mobile Menu */}
//         <div className="flex items-center gap-3 md:gap-4">
//           {/* Desktop Navigation */}
//           <nav className="hidden lg:flex items-center gap-2">
//             {visibleLinks.map((link) => {
//               const isActive = pathname === link.path;
//               const hasSubLinks = link.subLinks && link.subLinks.length > 0;

//               if (!hasSubLinks) {
//                 return (
//                   <Link
//                     key={link.path}
//                     href={link.path!}
//                     className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 
//                       ${isActive
//                         ? "bg-amber-500 text-white shadow-md"
//                         : "text-[#5A4A42] dark:text-gray-200 hover:bg-amber-100 dark:hover:bg-gray-800"
//                       } font-medium`}
//                   >
//                     <span className="text-base">{link.icon}</span>
//                     <span className="text-base md:text-lg">{link.name}</span>
//                   </Link>
//                 );
//               }

//               return (
//                 <div
//                   key={link.name}
//                   className="relative"
//                   ref={link.name === "Health" ? healthDropdownRef : null}
//                 >
//                   <button
//                     className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer
//                       ${openDropdown === link.name
//                         ? "bg-amber-500 text-white"
//                         : "text-[#5A4A42] dark:text-gray-200 hover:bg-amber-100 dark:hover:bg-gray-800"
//                       } font-medium`}
//                     onClick={() => setOpenDropdown(openDropdown === link.name ? null : link.name)}
//                     onMouseEnter={() => setOpenDropdown(link.name)}
//                   >
//                     <span className="text-base">{link.icon}</span>
//                     <span className="text-base md:text-lg">{link.name}</span>
//                     <span className={`text-xs transition-transform ${openDropdown === link.name ? "rotate-180" : ""}`}>
//                       ▼
//                     </span>
//                   </button>

//                   <AnimatePresence>
//                     {openDropdown === link.name && (
//                       <motion.div
//                         initial={{ opacity: 0, y: -10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -10 }}
//                         className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 
//                           dark:border-gray-700 rounded-xl shadow-2xl py-3 z-50"
//                         onMouseLeave={() => setOpenDropdown(null)}
//                       >
//                         {link.subLinks?.map((sub) => (
//                           <Link
//                             key={sub.path}
//                             href={sub.path}
//                             className={`flex items-center gap-3 px-4 py-2.5 hover:bg-amber-50 dark:hover:bg-gray-700 
//                               transition-colors ${pathname === sub.path
//                                 ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-gray-700"
//                                 : "text-gray-700 dark:text-gray-300"
//                               }`}
//                             onClick={() => setOpenDropdown(null)}
//                           >
//                             <span className="text-base">{sub.icon}</span>
//                             <span className="text-sm">{sub.name}</span>
//                           </Link>
//                         ))}
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>
//               );
//             })}
//           </nav>

//           {/* Mobile Menu Button */}
//           <button
//             onClick={() => setShowMobile(true)}
//             className="lg:hidden p-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
//             aria-label="Open mobile menu"
//           >
//             <FaList className="text-xl" />
//           </button>
//         </div>
//       </div>

//       {/* === Hero Section: Centered Content === */}
//       <div className="flex-grow flex flex-col items-center justify-center text-center px-4 md:px-8 py-6 md:py-8 relative">
//         {/* Logo in Center */}
//         <div className="relative w-20 h-20 md:w-24 md:h-24 mb-4">
//           <Image
//             src={logoImage}
//             alt="Health Life Logo"
//             fill
//             sizes="(max-width: 768px) 80px, 96px"
//             className="rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-xl"
//             priority
//             unoptimized={true}
//           />
//         </div>

//         {/* Title */}
//         <h1 className="font-jomhuria text-4xl md:text-5xl lg:text-6xl text-[#5A4A42] dark:text-white mb-3 md:mb-4">
//           {title || "Welcome To Our Academy"}
//         </h1>

//         {/* Description */}
//         {description && (
//           <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6 md:mb-8">
//             {description}
//           </p>
//         )}

//         {/* Welcome Message for Authenticated Users (Centered) */}
//         {/* {status === "authenticated" && (
//           // <motion.div 
//           //   initial={{ opacity: 0, y: 10 }}
//           //   animate={{ opacity: 1, y: 0 }}
//           //   className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-gray-800 dark:to-gray-700 
//           //   rounded-xl shadow-md max-w-md"
//           // >
//           //   <p className="text-lg font-bold text-amber-700 dark:text-amber-300">
//           //     Welcome back, {data?.user?.name}!
//           //   </p>
//           //   <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
//           //     Continue your health journey with us
//           //   </p>
//           // </motion.div>
//        <div className="flex items-center gap-3 md:gap-4">
//                  <UserAvatar user={data?.user} />
//                 <div>
//                  <p className="text-lg md:text-xl lg:text-2xl text-amber-500 dark:text-amber-400 font-bold">
//                                      Hi, {data?.user?.name?.split(' ')[0]}
//                   </p>                  <div className="mt-1 md:mt-2">
//                      <SignOut />
//                    </div>
//                  </div>
//                </div>
//       )}
//         */}
//       </div>

//       {/* === Mobile Navigation Drawer === */}
//       <AnimatePresence>
//         {showMobile && (
//           <>
//             {/* Backdrop */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
//               onClick={() => {
//                 setShowMobile(false);
//                 setOpenMobileDropdown(null);
//               }}
//             />

//             {/* Drawer */}
//             <motion.div
//               ref={mobileMenuRef}
//               initial={{ x: "100%" }}
//               animate={{ x: 0 }}
//               exit={{ x: "100%" }}
//               transition={{ type: "spring", damping: 25, stiffness: 200 }}
//               className="fixed top-0 right-0 h-full w-full max-w-xs bg-white dark:bg-gray-900 
//               shadow-2xl z-50 p-5 overflow-y-auto lg:hidden"
//             >
//               {/* Drawer Header */}
//               <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
//                 <div className="flex items-center gap-3">
//                   <div className="relative w-10 h-10">
//                     <Image
//                       src={logoImage}
//                       alt="Logo"
//                       fill
//                       sizes="40px"
//                       className="rounded-lg"
//                       unoptimized={true}
//                     />
//                   </div>
//                   <h2 className="text-2xl font-bold text-[#5A4A42] dark:text-white">Menu</h2>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setShowMobile(false);
//                     setOpenMobileDropdown(null);
//                   }}
//                   className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
//                   aria-label="Close menu"
//                 >
//                   <FaTimes className="text-xl" />
//                 </button>
//               </div>

//               {/* Mobile Navigation Links */}
//               <div className="space-y-1 mb-8">
//                 {visibleLinks.map((link) => {
//                   const hasSubLinks = link.subLinks && link.subLinks.length > 0;
//                   const isMobileDropdownOpen = openMobileDropdown === link.name;

//                   return (
//                     <div key={link.name || link.path} className="relative">
//                       {!hasSubLinks ? (
//                         <Link
//                           href={link.path!}
//                           className={`flex items-center gap-3 p-4 rounded-lg transition-colors text-lg font-medium
//                             ${pathname === link.path
//                               ? "bg-amber-500 text-white"
//                               : "text-[#5A4A42] dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-gray-800"
//                             }`}
//                           onClick={() => {
//                             setShowMobile(false);
//                             setOpenMobileDropdown(null);
//                           }}
//                         >
//                           <span className="text-xl">{link.icon}</span>
//                           {link.name}
//                         </Link>
//                       ) : (
//                         <>
//                           <button
//                             className="w-full flex items-center justify-between p-4 rounded-lg 
//                             hover:bg-amber-50 dark:hover:bg-gray-800 transition-colors text-lg font-medium"
//                             onClick={() =>
//                               setOpenMobileDropdown(isMobileDropdownOpen ? null : link.name)
//                             }
//                           >
//                             <div className="flex items-center gap-3">
//                               <span className="text-xl">{link.icon}</span>
//                               {link.name}
//                             </div>
//                             <span className={`transition-transform ${isMobileDropdownOpen ? "rotate-180" : ""}`}>
//                               ▼
//                             </span>
//                           </button>

//                           <AnimatePresence>
//                             {isMobileDropdownOpen && (
//                               <motion.div
//                                 initial={{ height: 0 }}
//                                 animate={{ height: "auto" }}
//                                 exit={{ height: 0 }}
//                                 className="overflow-hidden"
//                               >
//                                 <div className="pl-12 pr-4">
//                                   {link.subLinks?.map((sub) => (
//                                     <Link
//                                       key={sub.path}
//                                       href={sub.path}
//                                       className="flex items-center gap-3 py-3 px-4 hover:bg-amber-100 
//                                       dark:hover:bg-gray-700 transition-colors rounded-lg"
//                                       onClick={() => {
//                                         setShowMobile(false);
//                                         setOpenMobileDropdown(null);
//                                       }}
//                                     >
//                                       <span className="text-lg">{sub.icon}</span>
//                                       <span className="text-base">{sub.name}</span>
//                                     </Link>
//                                   ))}
//                                 </div>
//                               </motion.div>
//                             )}
//                           </AnimatePresence>
//                         </>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>

//               {/* Auth Buttons in Mobile Menu (if not authenticated) */}
//               {status === "unauthenticated" && (
//                 <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
//                   <div className="flex flex-col gap-3">
//                     <Link
//                       href="/signIn"
//                       className="p-4 text-center border-2 border-[#5A4A42] text-[#5A4A42] 
//                       dark:border-amber-500 dark:text-amber-500 rounded-lg hover:bg-amber-50 
//                       dark:hover:bg-gray-800 transition-colors font-medium"
//                       onClick={() => setShowMobile(false)}
//                     >
//                       Sign In
//                     </Link>
//                     <Link
//                       href="/signUp"
//                       className="p-4 text-center bg-[#5A4A42] dark:bg-amber-600 text-white 
//                       rounded-lg hover:bg-[#4a3a32] dark:hover:bg-amber-700 transition-colors font-medium"
//                       onClick={() => setShowMobile(false)}
//                     >
//                       Sign Up
//                     </Link>
//                   </div>
//                 </div>
//               )}
//               {status === "authenticated" && <div className="flex items-center gap-3 md:gap-4">
//                  <UserAvatar user={data?.user} />
//                  <div>
//                    <p className="text-lg md:text-xl lg:text-2xl text-amber-500 dark:text-amber-400 font-bold">
//                      Hi, {data?.user?.name?.split(' ')[0]}
//                    </p>
//                    <div className="mt-1 md:mt-2">
//                      <SignOut />
//                    </div>
//                  </div>
//                </div>}

//               {/* Footer */}
//               <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500">
//                 © {new Date().getFullYear()} Health Life Academy
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </header>
//   );
// }
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { FaList, FaHome, FaUser, FaEnvelope, FaUsers, FaHeartbeat, FaChartLine, FaTimes } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import SignOut from "./signOut";
import logoImage from "@/theEnvironment/1762025728119.png";

export const links = [
  { name: "Home", path: "/", showInHeader: true, icon: <FaHome /> },
  { name: "About", path: "/about", showInHeader: true, icon: <FaUser /> },
  { name: "Contact", path: "/contact", showInHeader: true, icon: <FaEnvelope /> },
  { name: "Community", path: "/community", showInHeader: true, icon: <FaUsers /> },
  {
    name: "Health",
    showInHeader: true,
    icon: <FaHeartbeat />,
    subLinks: [
      { name: "BMI Calculator", path: "/bmi", icon: "📊" },
      { name: "Workout Plan", path: "/workout", icon: "💪" },
      { name: "Calories Tracker", path: "/caloriestracker", icon: "🔥" },
      { name: "Calories Calculator", path: "/caloriescalculator", icon: "🧮" },
      { name: "Sleep Calculator", path: "/sleepcalculator", icon: "😴" },
      { name: "Steps Calculator", path: "/stepscalculator", icon: "👣" },
    ],
  },
  { name: "DashBoard", path: "/dashBoard", showInHeader: true, icon: <FaChartLine /> },
];

type User = { name?: string | null; image?: string | null };

export function UserAvatar({ user }: { user: User | null | undefined }) {
  const first = user?.name?.charAt(0)?.toUpperCase() || "U";
  return user?.image ? (
    <div className="relative w-12 h-12 md:w-14 md:h-14">
      <Image
        src={user.image}
        alt="User"
        fill
        sizes="(max-width: 768px) 48px, 56px"
        className="rounded-full object-cover border-2 border-white shadow-md"
        priority
        unoptimized
      />
    </div>
  ) : (
    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl md:text-2xl font-bold border-2 border-white shadow-md">
      {first}
    </div>
  );
}

export default function Header({ title, description }: { title: string; description?: string }) {
  const [showMobile, setShowMobile] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const { data, status } = useSession();
  const { theme } = useTheme();

  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const healthDropdownRef = useRef<HTMLDivElement>(null);

  // إخفاء الهيدر للصفحات غير المرغوبة
  const HIDE_HEADER_ROUTES = ["/signIn", "/signUp", "/dashBoard", "/community"];
  if (HIDE_HEADER_ROUTES.includes(pathname)) return null;

  const visibleLinks = links
    .map((link) => {
      if (link.subLinks) {
        return {
          ...link,
          subLinks: link.subLinks.filter((sub) =>
            !data && ["Sleep Calculator", "Steps Calculator"].includes(sub.name) ? false : true
          ),
        };
      }
      return link;
    })
    .filter((link) => (data ? true : link.name !== "DashBoard"));

  useEffect(() => {
    setShowMobile(false);
    setOpenMobileDropdown(null);
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (openDropdown && healthDropdownRef.current && !healthDropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
      if (
        showMobile &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node) &&
        !(e.target as Element).closest('[aria-label="Open mobile menu"]')
      ) {
        setShowMobile(false);
        setOpenMobileDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown, showMobile]);

  return (
    <header className="w-full relative bg-gradient-to-b from-white via-amber-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-[280px] md:min-h-[320px] flex flex-col shadow-lg">
      {/* Top Bar */}
      <div className="w-full flex justify-between items-center px-4 md:px-6 lg:px-8 py-4 md:py-5 z-30">
        {/* Auth / Avatar */}
        <div className="flex items-center gap-3 md:gap-4">
          {status === "unauthenticated" ? (
            <div className="flex gap-3">
              <Link
                href="/signIn"
                className="text-base md:text-lg lg:text-xl border-2 border-[#5A4A42] text-[#5A4A42] px-4 py-2 rounded-lg hover:bg-[#5A4A42] hover:text-white transition-all duration-300 font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/signUp"
                className="text-base md:text-lg lg:text-xl bg-[#5A4A42] text-white px-4 py-2 rounded-lg hover:bg-[#4a3a32] transition-all duration-300 font-medium"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3 md:gap-4">
              <UserAvatar user={data?.user} />
              <div>
                <p className="text-lg md:text-xl lg:text-2xl text-amber-500 dark:text-amber-400 font-bold">
                  Hi, {data?.user?.name?.split(" ")[0]}
                </p>
                <div className="mt-1 md:mt-2">
                  <SignOut />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Navigation */}
        <div className="flex items-center gap-3 md:gap-4">
          <nav className="hidden lg:flex items-center gap-2">
            {visibleLinks.map((link) => {
              const isActive = pathname === link.path;
              const hasSubLinks = link.subLinks && link.subLinks.length > 0;

              if (!hasSubLinks) {
                return (
                  <Link
                    key={link.path}
                    href={link.path!}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${isActive
                        ? "bg-amber-500 text-white shadow-md"
                        : "text-[#5A4A42] dark:text-gray-200 hover:bg-amber-100 dark:hover:bg-gray-800"
                      } font-medium`}
                  >
                    <span className="text-base">{link.icon}</span>
                    <span className="text-base md:text-lg">{link.name}</span>
                  </Link>
                );
              }

              return (
                <div key={link.name} className="relative" ref={link.name === "Health" ? healthDropdownRef : null}>
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer ${openDropdown === link.name
                        ? "bg-amber-500 text-white"
                        : "text-[#5A4A42] dark:text-gray-200 hover:bg-amber-100 dark:hover:bg-gray-800"
                      } font-medium`}
                    onClick={() => setOpenDropdown(openDropdown === link.name ? null : link.name)}
                    onMouseEnter={() => setOpenDropdown(link.name)}
                  >
                    <span className="text-base">{link.icon}</span>
                    <span className="text-base md:text-lg">{link.name}</span>
                    <span className={`text-xs transition-transform ${openDropdown === link.name ? "rotate-180" : ""}`}>
                      ▼
                    </span>
                  </button>

                  <AnimatePresence>
                    {openDropdown === link.name && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl py-3 z-50"
                        onMouseLeave={() => setOpenDropdown(null)}
                      >
                        {link.subLinks?.map((sub) => (
                          <Link
                            key={sub.path}
                            href={sub.path}
                            className={`flex items-center gap-3 px-4 py-2.5 hover:bg-amber-50 dark:hover:bg-gray-700 transition-colors ${pathname === sub.path
                                ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-gray-700"
                                : "text-gray-700 dark:text-gray-300"
                              }`}
                            onClick={() => setOpenDropdown(null)}
                          >
                            <span>{sub.icon}</span>
                            <span className="text-sm">{sub.name}</span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* Mobile Button */}
          <button
            onClick={() => setShowMobile(true)}
            className="lg:hidden p-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
            aria-label="Open mobile menu"
          >
            <FaList className="text-xl" />
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex-grow flex flex-col items-center justify-center text-center px-4 md:px-8 py-6 md:py-8 relative">
        <div className="relative w-20 h-20 md:w-24 md:h-24 mb-4">
          <Image
            src={logoImage}
            alt="Health Life Logo"
            fill
            sizes="(max-width: 768px) 80px, 96px"
            className="rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-xl"
            priority
            unoptimized
          />
        </div>
        <h1 className="font-jomhuria text-4xl md:text-5xl lg:text-6xl text-[#5A4A42] dark:text-white mb-3 md:mb-4">
          {title || "Welcome To Our Academy"}
        </h1>
        {description && (
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6 md:mb-8">
            {description}
          </p>
        )}
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {showMobile && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setShowMobile(false)}
            />
            <motion.div
              ref={mobileMenuRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-xs bg-white dark:bg-gray-900 shadow-2xl z-50 p-5 overflow-y-auto lg:hidden"
            >
              {/* Drawer Header */}
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10">
                    <Image src={logoImage} alt="Logo" fill sizes="40px" className="rounded-lg" unoptimized />
                  </div>
                  <h2 className="text-2xl font-bold text-[#5A4A42] dark:text-white">Menu</h2>
                </div>
                <button
                  onClick={() => setShowMobile(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {/* Links */}
              <div className="space-y-1 mb-8">
                {visibleLinks.map((link) => {
                  const hasSubLinks = link.subLinks && link.subLinks.length > 0;
                  const isMobileDropdownOpen = openMobileDropdown === link.name;

                  if (!hasSubLinks) {
                    return (
                      <Link
                        key={link.path}
                        href={link.path!}
                        className={`flex items-center gap-3 p-4 rounded-lg transition-colors text-lg font-medium ${pathname === link.path
                            ? "bg-amber-500 text-white"
                            : "text-[#5A4A42] dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-gray-800"
                          }`}
                        onClick={() => setShowMobile(false)}
                      >
                        <span className="text-xl">{link.icon}</span>
                        {link.name}
                      </Link>
                    );
                  }

                  return (
                    <div key={link.name} className="relative">
                      <button
                        className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-amber-50 dark:hover:bg-gray-800 transition-colors text-lg font-medium"
                        onClick={() =>
                          setOpenMobileDropdown(isMobileDropdownOpen ? null : link.name)
                        }
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{link.icon}</span>
                          {link.name}
                        </div>
                        <span className={`transition-transform ${isMobileDropdownOpen ? "rotate-180" : ""}`}>▼</span>
                      </button>
                      <AnimatePresence>
                        {isMobileDropdownOpen && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            className="overflow-hidden pl-12 pr-4"
                          >
                            {link.subLinks?.map((sub) => (
                              <Link
                                key={sub.path}
                                href={sub.path}
                                className="flex items-center gap-3 py-3 px-4 hover:bg-amber-100 dark:hover:bg-gray-700 transition-colors rounded-lg"
                                onClick={() => setShowMobile(false)}
                              >
                                <span className="text-lg">{sub.icon}</span>
                                <span className="text-base">{sub.name}</span>
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Auth Buttons in Mobile */}
              {status === "unauthenticated" && (
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-3">
                  <Link
                    href="/signIn"
                    className="p-4 text-center border-2 border-[#5A4A42] text-[#5A4A42] rounded-lg hover:bg-amber-50 dark:hover:bg-gray-800 transition-colors font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signUp"
                    className="p-4 text-center bg-[#5A4A42] text-white rounded-lg hover:bg-[#4a3a32] dark:hover:bg-amber-700 transition-colors font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {status === "authenticated" && (
                <div className="flex items-center gap-3 md:gap-4 mt-6">
                  <UserAvatar user={data?.user} />
                  <div>
                    <p className="text-lg md:text-xl lg:text-2xl text-amber-500 dark:text-amber-400 font-bold">
                      Hi, {data?.user?.name?.split(" ")[0]}
                    </p>
                    <div className="mt-1 md:mt-2">
                      <SignOut />
                    </div>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} Health Life Academy
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
