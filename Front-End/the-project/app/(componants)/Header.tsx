// // "use client";
// // import Link from "next/link";
// // import { usePathname } from "next/navigation";
// // import Image from "next/image";
// // import image from "@/theEnvironment/1762025728119.png";
// // import { useSession } from "next-auth/react";
// // import SignOut from "./signOut";
// // import { FaList } from "react-icons/fa";
// // import { useState } from "react";
// // import { motion, AnimatePresence } from "framer-motion";
// // import { useTheme } from "../context/ThemeContext";
// // export const links = [
// //   { name: "Home", path: "/", showInHeader: true },
// //   { name: "About", path: "/about", showInHeader: true },
// //   { name: "Contact", path: "/contact", showInHeader: true },
// //   {
// //     name: "Health",
// //     showInHeader: true,
// //     subLinks: [
// //       { name: "BMI Calculator", path: "/bmi" },
// //       { name: "Workout Plan", path: "/workout" },
// //       { name: "Calories Tracker", path: "/caloriestracker" },
// //       { name: "Calories Calculator", path: "/caloriescalculator" },
// //       { name: "Sleep Calculator", path: "/sleepcalculator" },
// //       { name: "Steps Calculator", path: "/stepscalculator" },
// //     ],
// //   },
// //   { name: "DashBoard", path: "/dashBoard", showInHeader: true },
// // ];

// // export default function Header({ title, description }: { title?: string; description?: string }) {
// //   const [showing, setShowing] = useState(false);
// //   const [openDropdown, setOpenDropdown] = useState(false);
// //   const pathname = usePathname();
// //   const { data, status } = useSession();
// //   if (pathname === "/signIn" || pathname === "/signUp" || pathname === "/dashBoard") return null;

// //   const visibleLinks = links
// //     .map((link) => {
// //       if (link.subLinks) {
// //         return {
// //           ...link,
// //           subLinks: link.subLinks.filter((sub) => {
// //             if (!data && (sub.name === "Sleep Calculator" || sub.name === "Steps Calculator")) return false;
// //             return true;
// //           }),
// //         };
// //       }
// //       return link;
// //     })
// //     .filter((link) => {
// //       if (!data && link.name === "DashBoard") return false;
// //       return link.showInHeader;
// //     });
// //   console.log("visible links are" + visibleLinks[0].path)
// //   const allPaths = [
// //     ...links.map(link => link.path).filter((path): path is string => !!path),
// //     ...links
// //       .flatMap(link => link.subLinks ? link.subLinks.map(sub => sub.path) : [])
// //   ];
// //   console.log("the Paths Are" + allPaths)
// //   const { theme } = useTheme();
// //   // hide header if path is not in allowed paths
// //   if (!allPaths.includes(pathname)) {
// //     return null;
// //   }
// //   if (!allPaths.some(p => pathname.startsWith(p))) {
// //     return null;
// //   }
// //   console.log("Path Name" + pathname)
// //   const allowedPaths = new Set(allPaths);

// //   if (!allowedPaths.has(pathname)) {
// //     return null;
// //   }
// //   const userName = data?.user?.name || "";
// //   const firstLetter = userName.charAt(0).toUpperCase();

// //   const hasImage = data?.user?.image;

// //   return (
// //     <div className="w-full h-[250px] relative shadow-md bg-white">
// //       <div className="flex justify-end gap-4 mr-[60px] mt-[20px] items-center relative">
// //         {visibleLinks.map((link, index) => {
// //           const isActive = pathname === link.path;

// //           if (link.subLinks) {
// //             return (
// //               <div
// //                 key={index}
// //                 className="relative hidden lg:block md:block"
// //                 onMouseEnter={() => setOpenDropdown(true)}
// //                 onMouseLeave={() => setOpenDropdown(false)}
// //               >
// //                 <button
// //                   className={`px-3 py-1 rounded-md text-[30px] transition-all duration-300 ${isActive ? "bg-amber-500 text-white" : "text-[#5A4A42] hover:bg-gray-100"
// //                     }`}
// //                 >
// //                   {link.name}
// //                 </button>

// //                 <AnimatePresence>
// //                   {openDropdown && (
// //                     <motion.div
// //                       initial={{ opacity: 0, y: -10 }}
// //                       animate={{ opacity: 1, y: 0 }}
// //                       exit={{ opacity: 0, y: -10 }}
// //                       transition={{ duration: 0.2 }}
// //                       className="absolute right-0 mt-2 shadow-lg rounded-lg py-2 w-[220px] z-50 border bg-white border-gray-200"
// //                     >
// //                       {link.subLinks.map((sub, i) => (
// //                         <Link
// //                           key={i}
// //                           href={sub.path}
// //                           className={`block px-4 py-2 text-lg transition ${pathname === sub.path
// //                             ? "text-amber-600 font-medium"
// //                             : "text-gray-700 hover:bg-amber-100"
// //                             }`}
// //                         >
// //                           {sub.name}
// //                         </Link>
// //                       ))}
// //                     </motion.div>
// //                   )}
// //                 </AnimatePresence>
// //               </div>
// //             );
// //           }

// //           return (
// //             <Link
// //               key={index}
// //               href={link.path}
// //               className={`hidden lg:block md:block px-3 py-1 rounded-md text-[30px] transition-all duration-300 ${isActive
// //                 ? "bg-amber-500 text-white"
// //                 : "text-[#5A4A42] hover:bg-gray-100"
// //                 }`}
// //             >
// //               {link.name}
// //             </Link>
// //           );
// //         })}

// //         <div className="block md:hidden relative">
// //           <FaList
// //             className="cursor-pointer hover:scale-105 text-2xl"
// //             onClick={() => setShowing((prev) => !prev)}
// //           />
// //           {showing && (
// //             <div className="absolute right-0 mt-2 rounded-lg h-auto text-[35px] z-50 w-60 shadow-lg p-3 space-y-2 bg-[#efefef] text-black">
// //               {visibleLinks.map((link, index) => (
// //                 <div key={index}>
// //                   {!link.subLinks ? (
// //                     <Link
// //                       href={link.path}
// //                       className={`block py-2 px-3 rounded-md ${pathname === link.path
// //                         ? "bg-amber-500 text-white"
// //                         : "text-[#5A4A42] hover:bg-gray-100"
// //                         }`}
// //                     >
// //                       {link.name}
// //                     </Link>
// //                   ) : (
// //                     <div>
// //                       <button
// //                         onClick={() => setOpenDropdown((p) => !p)}
// //                         className="block w-full text-left py-2 px-3 rounded-md text-[#5A4A42] hover:bg-gray-100"
// //                       >
// //                         {link.name}
// //                       </button>
// //                       {openDropdown && (
// //                         <div className="ml-4 space-y-1">
// //                           {link.subLinks.map((sub, i) => (
// //                             <Link
// //                               key={i}
// //                               href={sub.path}
// //                               className="block py-1 px-3 text-[28px] hover:text-amber-600 text-gray-700"
// //                             >
// //                               {sub.name}
// //                             </Link>
// //                           ))}
// //                         </div>
// //                       )}
// //                     </div>
// //                   )}
// //                 </div>
// //               ))}
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* === الشعار والعنوان === */}
// //       {hasImage ? (
// //         <Image
// //           src={data?.user?.image || ""}
// //           alt="The-Icon"
// //           width={70}
// //           height={70}
// //           className="absolute top-5 left-1/2 -translate-x-1/2 cursor-pointer rounded-full object-cover"
// //         />
// //       ) : (
// //         <>
// //           <div
// //             className="absolute top-5 left-1/2 -translate-x-1/2 cursor-pointer
// //                      w-[70px] h-[70px] rounded-full bg-blue-600 flex items-center justify-center
// //                      text-white text-3xl font-bold"
// //           >
// //             {firstLetter}
// //           </div>
// //           <div className={`font-jomhuria text-center text-6xl leading-[72px] absolute top-20 left-1/2 transform -translate-x-1/2 p-6 rounded-md ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
// //             {title || "Welcome To Our Academy"}
// //           </div>

// //           <div className={`absolute top-40 left-1/2 transform -translate-x-1/2 text-center font-judson ${theme === 'dark' ? 'text-gray-300' : 'text-black'}`}>
// //             <pre>{description}</pre>
// //           </div>
// //         </>
// //       )}

// //       {/* === زرار تسجيل الدخول في مكانه القديم === */}
// //       {
// //         status === "unauthenticated" && (
// //           <div className="absolute left-10 top-5 flex gap-4">
// //             <div className="bg-transparent rounded-md border-[3px] w-24 flex justify-center items-center border-[#5A4A42] hover:bg-[#5A4A42] transition-colors duration-300">
// //               <Link
// //                 href="/signIn"
// //                 className="block text-4xl hover:text-white text-[#5A4A42] px-2"
// //               >
// //                 Sign In
// //               </Link>
// //             </div>
// //             <div className="bg-[#5A4A42] rounded-md border-[3px] border-[#5A4A42] w-24 flex justify-center items-center hover:bg-transparent transition-colors duration-300">
// //               <Link
// //                 href="/signUp"
// //                 className="block text-4xl text-white hover:text-[#5A4A42] px-2"
// //               >
// //                 Sign Up
// //               </Link>
// //             </div>
// //           </div>
// //         )
// //       }

// //       {/* === حالة المستخدم لما يكون مسجل دخول === */}
// //       {
// //         status === "authenticated" && (
// //           // <>
// //           //   <Link href="/Profile">
// //           //     <Image
// //           //       src={data?.user?.image || ""}
// //           //       alt={data?.user?.name || ""}
// //           //       width={70}
// //           //       height={70}
// //           //       className="rounded-full absolute top-5 left-10 cursor-pointer"
// //           //     />
// //           //   </Link>
// //            {hasImage ? (
// //         <Image
// //           src={data?.user?.image || ""}
// //           alt="The-Icon"
// //           width={70}
// //           height={70}
// //           className="absolute top-5 left-1/2 -translate-x-1/2 cursor-pointer rounded-full object-cover"
// //         />
// //       ) : (
// //         <>
// //           <div
// //             className="absolute top-5 left-1/2 -translate-x-1/2 cursor-pointer
// //                      w-[70px] h-[70px] rounded-full bg-blue-600 flex items-center justify-center
// //                      text-white text-3xl font-bold"
// //           >
// //             {firstLetter}
// //           </div>
// //           <div className={`font-jomhuria text-center text-6xl leading-[72px] absolute top-20 left-1/2 transform -translate-x-1/2 p-6 rounded-md ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
// //             {title || "Welcome To Our Academy"}
// //           </div>

// //           <div className={`absolute top-40 left-1/2 transform -translate-x-1/2 text-center font-judson ${theme === 'dark' ? 'text-gray-300' : 'text-black'}`}>
// //             <pre>{description}</pre>
// //           </div>
// //         </>
// //       )}

// //       {/* === زرار تسجيل الدخول في مكانه القديم === */}
// //       {
// //         status === "unauthenticated" && (
// //           <div className="absolute left-10 top-5 flex gap-4">
// //             <div className="bg-transparent rounded-md border-[3px] w-24 flex justify-center items-center border-[#5A4A42] hover:bg-[#5A4A42] transition-colors duration-300">
// //               <Link
// //                 href="/signIn"
// //                 className="block text-4xl hover:text-white text-[#5A4A42] px-2"
// //               >
// //                 Sign In
// //               </Link>
// //             </div>
// //             <div className="bg-[#5A4A42] rounded-md border-[3px] border-[#5A4A42] w-24 flex justify-center items-center hover:bg-transparent transition-colors duration-300">
// //               <Link
// //                 href="/signUp"
// //                 className="block text-4xl text-white hover:text-[#5A4A42] px-2"
// //               >
// //                 Sign Up
// //               </Link>
// //             </div>
// //           </div>
// //         )
// //       }
// //            <div className="text-4xl text-[#F59E0B] absolute top-24 left-10">
// //               Hi, {data?.user?.name}
// //             </div>
// //             <div className="absolute top-40 left-10">
// //               <SignOut />
// //             </div>
// //           </>
// //         )
// //       }
// //     </div >
// //   );
// // }
// "use client";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import Image from "next/image";
// import { useSession } from "next-auth/react";
// import SignOut from "./signOut";
// import { FaList } from "react-icons/fa";
// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useTheme } from "../context/ThemeContext";
// // ●●● Componen.;t: User Avatar ●●●
// export const links = [
//   { name: "Home", path: "/", showInHeader: true },
//   { name: "About", path: "/about", showInHeader: true },
//   { name: "Contact", path: "/contact", showInHeader: true },
//   {
//     name: "Health",
//     showInHeader: true,
//     subLinks: [
//       { name: "BMI Calculator", path: "/bmi" },
//       { name: "Workout Plan", path: "/workout" },
//       { name: "Calories Tracker", path: "/caloriestracker" },
//       { name: "Calories Calculator", path: "/caloriescalculator" },
//       { name: "Sleep Calculator", path: "/sleepcalculator" },
//       { name: "Steps Calculator", path: "/stepscalculator" },
//     ],
//   },
//   { name: "DashBoard", path: "/dashBoard", showInHeader: true },
// ];
// function UserAvatar({ user }) {
//   const name = user?.name || "";
//   const firstLetter = name.charAt(0).toUpperCase();
//   const hasImage = user?.image;

//   return hasImage ? (
//     <Image
//       src={user.image}
//       alt="User"
//       width={70}
//       height={70}
//       className="absolute top-5 left-1/2 -translate-x-1/2 cursor-pointer rounded-full object-cover"
//     />
//   ) : (
//     <div
//       className="absolute top-5 left-1/2 -translate-x-1/2 cursor-pointer
//         w-[70px] h-[70px] rounded-full bg-blue-600 flex items-center justify-center
//         text-white text-3xl font-bold"
//     >
//       {firstLetter}
//     </div>
//   );
// }

// // ●●● Header Component ●●●
// export default function Header({ title, description }) {
//   const [showing, setShowing] = useState(false);
//   const [openDropdown, setOpenDropdown] = useState(false);
//   const pathname = usePathname();
//   const { data, status } = useSession();
//   const { theme } = useTheme();

//   if (pathname === "/signIn" || pathname === "/signUp" || pathname === "/dashBoard")
//     return null;

//   // Filter links depending on login
//   const visibleLinks = links
//     .map((link) => {
//       if (link.subLinks) {
//         return {
//           ...link,
//           subLinks: link.subLinks.filter((sub) => {
//             if (!data && (sub.name === "Sleep Calculator" || sub.name === "Steps Calculator"))
//               return false;
//             return true;
//           }),
//         };
//       }
//       return link;
//     })
//     .filter((link) => !( !data && link.name === "DashBoard") && link.showInHeader);

//   // Allowed paths
//   const allPaths = [
//     ...links.map((l) => l.path).filter(Boolean),
//     ...links.flatMap((l) => (l.subLinks ? l.subLinks.map((s) => s.path) : [])),
//   ];

//   if (!allPaths.includes(pathname) && !allPaths.some((p) => pathname.startsWith(p))) {
//     return null;
//   }

//   return (
//     <div className="w-full h-[250px] relative shadow-md bg-white">

//       {/* ●● LINKS ●● */}
//       <div className="flex justify-end gap-4 mr-[60px] mt-[20px] items-center relative">
//         {visibleLinks.map((link, index) => {
//           const isActive = pathname === link.path;

//           if (link.subLinks) {
//             return (
//               <div
//                 key={index}
//                 className="relative hidden lg:block md:block"
//                 onMouseEnter={() => setOpenDropdown(true)}
//                 onMouseLeave={() => setOpenDropdown(false)}
//               >
//                 <button
//                   className={`px-3 py-1 rounded-md text-[30px] transition-all duration-300 ${
//                     isActive ? "bg-amber-500 text-white" : "text-[#5A4A42] hover:bg-gray-100"
//                   }`}
//                 >
//                   {link.name}
//                 </button>

//                 {/* Dropdown */}
//                 <AnimatePresence>
//                   {openDropdown && (
//                     <motion.div
//                       initial={{ opacity: 0, y: -10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -10 }}
//                       transition={{ duration: 0.2 }}
//                       className="absolute right-0 mt-2 shadow-lg rounded-lg py-2 w-[220px] z-50 border bg-white border-gray-200"
//                     >
//                       {link.subLinks.map((sub, i) => (
//                         <Link
//                           key={i}
//                           href={sub.path}
//                           className={`block px-4 py-2 text-lg transition ${
//                             pathname === sub.path
//                               ? "text-amber-600 font-medium"
//                               : "text-gray-700 hover:bg-amber-100"
//                           }`}
//                         >
//                           {sub.name}
//                         </Link>
//                       ))}
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             );
//           }

//           return (
//             <Link
//               key={index}
//               href={link.path}
//               className={`hidden lg:block md:block px-3 py-1 rounded-md text-[30px] transition-all duration-300 ${
//                 isActive ? "bg-amber-500 text-white" : "text-[#5A4A42] hover:bg-gray-100"
//               }`}
//             >
//               {link.name}
//             </Link>
//           );
//         })}

//         {/* Mobile Menu */}
//         <div className="block md:hidden relative">
//           <FaList className="cursor-pointer hover:scale-105 text-2xl" onClick={() => setShowing(!showing)} />

//           {showing && (
//             <div className="absolute right-0 mt-2 rounded-lg h-auto text-[35px] z-50 w-60 shadow-lg p-3 space-y-2 bg-[#efefef] text-black">
//               {visibleLinks.map((link, index) => (
//                 <div key={index}>
//                   {!link.subLinks ? (
//                     <Link
//                       href={link.path}
//                       className={`block py-2 px-3 rounded-md ${
//                         pathname === link.path
//                           ? "bg-amber-500 text-white"
//                           : "text-[#5A4A42] hover:bg-gray-100"
//                       }`}
//                     >
//                       {link.name}
//                     </Link>
//                   ) : (
//                     <div>
//                       <button
//                         onClick={() => setOpenDropdown((p) => !p)}
//                         className="block w-full text-left py-2 px-3 rounded-md text-[#5A4A42] hover:bg-gray-100"
//                       >
//                         {link.name}
//                       </button>
//                       {openDropdown && (
//                         <div className="ml-4 space-y-1">
//                           {link.subLinks.map((sub, i) => (
//                             <Link
//                               key={i}
//                               href={sub.path}
//                               className="block py-1 px-3 text-[28px] hover:text-amber-600 text-gray-700"
//                             >
//                               {sub.name}
//                             </Link>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ●● USER AVATAR + TITLE ●● */}
//       <UserAvatar user={data?.user} />

//       <div
//         className={`font-jomhuria text-center text-6xl leading-[72px] absolute top-20 left-1/2 transform -translate-x-1/2 p-6 rounded-md ${
//           theme === "dark" ? "text-white" : "text-black"
//         }`}
//       >
//         {title || "Welcome To Our Academy"}
//       </div>

//       <div
//         className={`absolute top-40 left-1/2 transform -translate-x-1/2 text-center font-judson ${
//           theme === "dark" ? "text-gray-300" : "text-black"
//         }`}
//       >
//         <pre>{description}</pre>
//       </div>

//       {/* ●● If NOT logged in ●● */}
//       {status === "unauthenticated" && (
//         <div className="absolute left-10 top-5 flex gap-4">
//           <div className="bg-transparent rounded-md border-[3px] w-24 flex justify-center items-center border-[#5A4A42] hover:bg-[#5A4A42] transition-colors duration-300">
//             <Link href="/signIn" className="block text-4xl hover:text-white text-[#5A4A42] px-2">
//               Sign In
//             </Link>
//           </div>

//           <div className="bg-[#5A4A42] rounded-md border-[3px] border-[#5A4A42] w-24 flex justify-center items-center hover:bg-transparent transition-colors duration-300">
//             <Link href="/signUp" className="block text-4xl text-white hover:text-[#5A4A42] px-2">
//               Sign Up
//             </Link>
//           </div>
//         </div>
//       )}

//       {/* ●● If logged in ●● */}
//       {status === "authenticated" && (
//         <>
//           <div className="text-4xl text-[#F59E0B] absolute top-24 left-10">Hi, {data?.user?.name}</div>
//           <div className="absolute top-40 left-10">
//             <SignOut />
//           </div>
//         </>
//       )}
//     </div>
//   );
// }
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import SignOut from "./signOut";
import { FaList } from "react-icons/fa";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import image from "@/theEnvironment/1762025728119.png";
export const links = [
  { name: "Home", path: "/", showInHeader: true },
  { name: "About", path: "/about", showInHeader: true },
  { name: "Contact", path: "/contact", showInHeader: true },
  { name: "Community", path: "/community", showInHeader: true },
  {
    name: "Health",
    showInHeader: true,
    subLinks: [
      { name: "BMI Calculator", path: "/bmi" },
      { name: "Workout Plan", path: "/workout" },
      { name: "Calories Tracker", path: "/caloriestracker" },
      { name: "Calories Calculator", path: "/caloriescalculator" },
      { name: "Sleep Calculator", path: "/sleepcalculator" },
      { name: "Steps Calculator", path: "/stepscalculator" },
    ],
  },
  { name: "DashBoard", path: "/dashBoard", showInHeader: true },
];

// ●●● Avatar Component ●●●
function UserAvatar({ user }) {
  const first = user?.name?.charAt(0)?.toUpperCase() || "U";

  return user?.image ? (
    <Image
      src={user.image}
      alt="User"
      width={70}
      height={70}
      className="absolute top-5 left-1/2 -translate-x-1/2 rounded-full object-cover cursor-pointer"
    />
  ) : (
    <div
      className="absolute top-5 left-1/2 -translate-x-1/2 w-[70px] h-[70px]
       rounded-full bg-blue-600 flex items-center justify-center
       text-white text-3xl font-bold cursor-pointer"
    >
      {first}
    </div>
  );
}

// ●●● Header Component ●●●
export default function Header({ title, description }) {
  const [showMobile, setShowMobile] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const pathname = usePathname();
  const { data, status } = useSession();
  const { theme } = useTheme();

  // hide header on specific pages
  if (["/signIn", "/signUp", "/dashBoard", "/community"].includes(pathname)) return null;

  // filter links
  const visibleLinks = links
    .map((link) => {
      if (link.subLinks) {
        return {
          ...link,
          subLinks: link.subLinks.filter((sub) =>
            !data && ["Sleep Calculator", "Steps Calculator"].includes(sub.name)
              ? false
              : true
          ),
        };
      }
      return link;
    })
    .filter((link) => (data ? true : link.name !== "DashBoard"));

  return (
    <header className="w-full h-[250px] relative shadow-md bg-white">
      {/* === Navbar (top) === */}
      <div className="flex justify-end gap-4 mr-[60px] mt-[20px] items-center">
        {/* Desktop Navigation */}
        {visibleLinks.map((link, i) => {
          const isActive = pathname === link.path;

          if (!link.subLinks) {
            return (
              <Link
                key={i}
                href={link.path}
                className={`hidden lg:block md:block px-3 py-1 rounded-md text-[30px]
                  transition-all duration-300 ${
                    isActive
                      ? "bg-amber-500 text-white"
                      : "text-[#5A4A42] hover:bg-gray-100"
                  }`}
              >
                {link.name}
              </Link>
            );
          }

          return (
            <div
              key={i}
              className="relative hidden lg:block md:block"
              onMouseEnter={() => setOpenDropdown(true)}
              onMouseLeave={() => setOpenDropdown(false)}
            >
              <button
                className={`px-3 py-1 rounded-md text-[30px] transition-all duration-300 ${
                  isActive
                    ? "bg-amber-500 text-white"
                    : "text-[#5A4A42] hover:bg-gray-100"
                }`}
              >
                {link.name}
              </button>

              <AnimatePresence>
                {openDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-[220px] bg-white border rounded-lg shadow-lg py-2 z-50"
                  >
                    {link.subLinks.map((sub, j) => (
                      <Link
                        key={j}
                        href={sub.path}
                        className={`block px-4 py-2 text-lg transition ${
                          pathname === sub.path
                            ? "text-amber-600 font-medium"
                            : "text-gray-700 hover:bg-amber-100"
                        }`}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {/* Mobile Icon */}
        <div className="block md:hidden relative">
          <FaList
            className="cursor-pointer hover:scale-105 text-2xl"
            onClick={() => setShowMobile((p) => !p)}
          />

          {showMobile && (
            <div className="absolute right-0 mt-2 w-60 bg-[#efefef] shadow-lg p-3 text-[35px] rounded-lg z-50">
              {visibleLinks.map((link, i) => (
                <div key={i}>
                  {!link.subLinks ? (
                    <Link
                      href={link.path}
                      className={`block py-2 px-3 rounded-md ${
                        pathname === link.path
                          ? "bg-amber-500 text-white"
                          : "text-[#5A4A42] hover:bg-gray-100"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <>
                      <button
                        className="block w-full py-2 px-3 text-left rounded-md text-[#5A4A42] hover:bg-gray-100"
                        onClick={() => setOpenDropdown((p) => !p)}
                      >
                        {link.name}
                      </button>

                      {openDropdown && (
                        <div className="ml-4 space-y-1">
                          {link.subLinks.map((sub, j) => (
                            <Link
                              key={j}
                              href={sub.path}
                              className="block py-1 px-3 text-[28px] text-gray-700 hover:text-amber-600"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* <UserAvatar user={data?.user} /> */}
      <div
        className={`font-jomhuria text-center text-6xl leading-[72px]
        absolute top-20 left-1/2 -translate-x-1/2 p-6 rounded-md ${
          theme === "dark" ? "text-white" : "text-black"
        }`}
      >
        {title || "Welcome To Our Academy"}
      </div>
<Image src={image} alt="Avatar" width={70} height={70} className="absolute top-5 right-160"/>

      <div
        className={`absolute top-40 left-1/2 -translate-x-1/2 text-center font-judson ${
          theme === "dark" ? "text-gray-300" : "text-black"
        }`}
      >
        <pre>{description}</pre>
      </div>

      {/* === Auth Buttons === */}
      {status === "unauthenticated" && (
        <div className="absolute left-10 top-5 flex gap-4">
          <div className="border-[3px] border-[#5A4A42] rounded-md w-24 flex justify-center items-center hover:bg-[#5A4A42] transition">
            <Link
              href="/signIn"
              className="text-4xl text-[#5A4A42] hover:text-white"
            >
              Sign In
            </Link>
          </div>

          <div className="border-[3px] border-[#5A4A42] bg-[#5A4A42] rounded-md w-24 flex justify-center items-center hover:bg-transparent transition">
            <Link
              href="/signUp"
              className="text-4xl text-white hover:text-[#5A4A42]"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}

      {status === "authenticated" && (
        <>
          <div className="text-4xl text-[#F59E0B] absolute top-24 left-10">
            Hi, {data?.user?.name}
          </div>
<UserAvatar user={data?.user} />
          <div className="absolute top-40 left-10">
            <SignOut />
          </div>
        </>
      )}
    </header>
  );
}
