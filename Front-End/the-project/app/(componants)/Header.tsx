"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  FaList, FaHome, FaUser, FaEnvelope, FaUsers,
  FaHeartbeat, FaChartLine, FaTimes, FaChevronDown
} from "react-icons/fa";
import { useState, useEffect, useRef, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import SignOut from "./signOut";
import logoImage from "@/theEnvironment/1762025728119.png";

export const links = [
  { name: "Home",      path: "/",          showInHeader: true, icon: <FaHome aria-hidden="true" /> },
  { name: "About",     path: "/about",     showInHeader: true, icon: <FaUser aria-hidden="true" /> },
  { name: "Contact",   path: "/contact",   showInHeader: true, icon: <FaEnvelope aria-hidden="true" /> },
  { name: "Community", path: "/community", showInHeader: true, icon: <FaUsers aria-hidden="true" /> },
  {
    name: "Health",
    showInHeader: true,
    icon: <FaHeartbeat aria-hidden="true" />,
    subLinks: [
      { name: "BMI Calculator",      path: "/bmi",               icon: "📊" },
      { name: "Workout Plan",        path: "/workout",            icon: "💪" },
      { name: "Calories Tracker",    path: "/caloriestracker",    icon: "🔥" },
      { name: "Calories Calculator", path: "/caloriescalculator", icon: "🧮" },
      { name: "Sleep Calculator",    path: "/sleepcalculator",    icon: "😴" },
      { name: "Steps Calculator",    path: "/stepscalculator",    icon: "👣" },
    ],
  },
  { name: "Dashboard", path: "/dashBoard", showInHeader: true, icon: <FaChartLine aria-hidden="true" /> },
];

type User = { name?: string | null; image?: string | null };

export function UserAvatar({ user }: { user: User | null | undefined }) {
  const first = user?.name?.charAt(0)?.toUpperCase() ?? "U";
  return user?.image ? (
    <Link href="/Profile" className="relative w-12 h-12 flex-shrink-0 transition-transform hover:scale-105 focus-visible:scale-105">
      <div className="relative w-12 h-12 flex-shrink-0" aria-hidden="true">
        <Image
          src={user.image}
          alt=""
          fill
        sizes="48px"
        className="rounded-full object-cover ring-2 ring-[--clr-accent] ring-offset-2"
        priority
        unoptimized
      />
    </div>
  </Link>
  ) : (
    <div
      aria-hidden="true"
      className="w-12 h-12 flex-shrink-0 rounded-full bg-[--clr-accent-soft] flex items-center justify-center text-[--clr-primary] text-xl font-normal ring-2 ring-[--clr-accent] ring-offset-2"
    >
      {first}
    </div>
  );
}

export default function Header({ title, description }: { title: string; description?: string }) {
  const [showMobile, setShowMobile]           = useState(false);
  const [openDropdown, setOpenDropdown]       = useState<string | null>(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const pathname    = usePathname();
  const { data, status } = useSession();
  const { theme }   = useTheme();
  const dropdownId  = useId();

  const mobileMenuRef      = useRef<HTMLDivElement>(null);
  const healthDropdownRef  = useRef<HTMLDivElement>(null);
  const mobileToggleRef    = useRef<HTMLButtonElement>(null);

  /* ── Close everything on route change ── */
  useEffect(() => {
    setShowMobile(false);
    setOpenMobileDropdown(null);
    setOpenDropdown(null);
  }, [pathname]);

  /* ── Close on outside click ── */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (openDropdown && healthDropdownRef.current && !healthDropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
      if (
        showMobile &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node) &&
        !mobileToggleRef.current?.contains(e.target as Node)
      ) {
        setShowMobile(false);
        setOpenMobileDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown, showMobile]);

  /* ── Trap focus inside mobile menu ── */
  useEffect(() => {
    if (!showMobile) return;
    const el = mobileMenuRef.current;
    if (!el) return;
    const focusable = el.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    const trap  = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
        else            { if (document.activeElement === last)  { e.preventDefault(); first.focus(); } }
      }
      if (e.key === "Escape") { setShowMobile(false); mobileToggleRef.current?.focus(); }
    };
    document.addEventListener("keydown", trap);
    first?.focus();
    return () => document.removeEventListener("keydown", trap);
  }, [showMobile]);

  /* ── Close desktop dropdown on Escape ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenDropdown(null); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  /* ── Prevent body scroll when mobile menu open ── */
  useEffect(() => {
    document.body.style.overflow = showMobile ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showMobile]);

  const HIDE_HEADER_ROUTES = ["/signIn", "/signUp", "/dashBoard", "/terms", "/privacy" , '/notifications', '/settings' , '/profile'];
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
    .filter((link) => (data ? true : link.name !== "Dashboard"));

  const firstName = data?.user?.name?.split(" ")[0];

  return (
    <>
      {/* ══════════════════════════════════════════
          CSS CUSTOM PROPERTIES – single source of truth
      ══════════════════════════════════════════ */}
      <style>{`
        :root {
          --clr-bg:          #fdfaf6;
          --clr-surface:     #ffffff;
          --clr-primary:     #4a3b2f;
          --clr-primary-hov: #362a20;
          --clr-accent:      #c8956c;
          --clr-accent-soft: #f5e6d8;
          --clr-accent-hov:  #b5794e;
          --clr-muted:       #7a6a5e;
          --clr-border:      #ecddd0;
          --clr-text:        #2d1f14;
          --clr-text-muted:  #6b5c50;
          --radius-lg:       1rem;
          --radius-xl:       1.5rem;
          --shadow-sm:       0 1px 3px rgba(74,59,47,.08), 0 1px 2px rgba(74,59,47,.06);
          --shadow-md:       0 4px 16px rgba(74,59,47,.12);
          --shadow-xl:       0 20px 48px rgba(74,59,47,.18);
          --transition:      220ms cubic-bezier(.4,0,.2,1);
        }
        .dark {
          --clr-bg:          #1a1512;
          --clr-surface:     #241e19;
          --clr-primary:     #e8d5c0;
          --clr-primary-hov: #f5e8d8;
          --clr-accent:      #c8956c;
          --clr-accent-soft: #3a2a1e;
          --clr-accent-hov:  #d9a87c;
          --clr-muted:       #a89585;
          --clr-border:      #3a2e25;
          --clr-text:        #f0e8df;
          --clr-text-muted:  #b09080;
        }

        /* ── Focus ring ── */
        :focus-visible {
          outline: 2.5px solid var(--clr-accent);
          outline-offset: 3px;
          border-radius: 6px;
        }

        /* ── Skip to content ── */
        .skip-link {
          position: absolute;
          top: -100%;
          left: 1rem;
          z-index: 9999;
          padding: .5rem 1.25rem;
          border-radius: 0 0 var(--radius-lg) var(--radius-lg);
          background: var(--clr-accent);
          color: #fff;
          font-weight: 600;
          font-size: 1rem;
          transition: top .2s;
        }
        .skip-link:focus { top: 0; }

        /* ── Subtle noise texture on hero ── */
        .hero-noise::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.03'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: .5;
        }
      `}</style>

      {/* ── Skip to main content (a11y) ── */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <header
        className="w-full relative"
        style={{ background: "var(--clr-bg)" }}
        role="banner"
      >
        {/* ════ TOP NAV BAR ════ */}
        <div className="w-full max-w-7xl mx-auto flex justify-between items-center px-6 md:px-10 py-4 z-30">

          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              aria-label="Health Life – go to homepage"
              className="relative w-14 h-14 md:w-16 md:h-16 flex-shrink-0 transition-transform hover:scale-105 focus-visible:scale-105"
            >
              <Image
                src={logoImage}
                alt="Health Life logo"
                fill
                className="rounded-full object-cover"
                style={{ boxShadow: "var(--shadow-sm)", border: "2px solid var(--clr-border)" }}
                priority
                unoptimized
              />
            </Link>

            {/* ── Desktop navigation ── */}
            <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1">
              {visibleLinks.map((link) => {
                const isActive   = pathname === link.path;
                const hasSubs    = Boolean(link.subLinks?.length);
                const isOpen     = openDropdown === link.name;
                const menuId     = `${dropdownId}-${link.name}`;

                if (!hasSubs) {
                  return (
                    <Link
                      key={link.path}
                      href={link.path!}
                      aria-current={isActive ? "page" : undefined}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl text-lg font-normal transition-all"
                      style={{
                        color:      isActive ? "var(--clr-accent)"  : "var(--clr-text-muted)",
                        background: isActive ? "var(--clr-accent-soft)" : "transparent",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = "var(--clr-accent-soft)")}
                      onMouseLeave={e => (e.currentTarget.style.background = isActive ? "var(--clr-accent-soft)" : "transparent")}
                    >
                      <span aria-hidden="true">{link.icon}</span>
                      {link.name}
                    </Link>
                  );
                }

                return (
                  <div
                    key={link.name}
                    className="relative"
                    ref={link.name === "Health" ? healthDropdownRef : null}
                  >
                    <button
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      aria-controls={menuId}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl text-lg font-normal transition-all cursor-pointer"
                      style={{
                        color:      isOpen ? "var(--clr-accent)"  : "var(--clr-text-muted)",
                        background: isOpen ? "var(--clr-accent-soft)" : "transparent",
                      }}
                      onClick={() => setOpenDropdown(isOpen ? null : link.name)}
                      onMouseEnter={() => setOpenDropdown(link.name)}
                    >
                      <span aria-hidden="true">{link.icon}</span>
                      {link.name}
                      <FaChevronDown
                        aria-hidden="true"
                        className="text-xs transition-transform duration-200"
                        style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                      />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.ul
                          id={menuId}
                          role="menu"
                          aria-label={`${link.name} submenu`}
                          initial={{ opacity: 0, y: -8, scale: .97 }}
                          animate={{ opacity: 1, y: 0,  scale: 1 }}
                          exit={{   opacity: 0, y: -8, scale: .97 }}
                          transition={{ duration: .18 }}
                          className="absolute left-0 mt-2 w-64 rounded-2xl py-2 z-50 overflow-hidden"
                          style={{
                            background: "var(--clr-surface)",
                            border:     "1px solid var(--clr-border)",
                            boxShadow:  "var(--shadow-xl)",
                          }}
                          onMouseLeave={() => setOpenDropdown(null)}
                        >
                          {link.subLinks?.map((sub) => {
                            const subActive = pathname === sub.path;
                            return (
                              <li key={sub.path} role="none">
                                <Link
                                  href={sub.path}
                                  role="menuitem"
                                  aria-current={subActive ? "page" : undefined}
                                  className="flex items-center gap-3 px-6 py-4 text-base font-normal transition-colors"
                                  style={{
                                    color:      subActive ? "var(--clr-accent)" : "var(--clr-text-muted)",
                                    background: subActive ? "var(--clr-accent-soft)" : "transparent",
                                  }}
                                  onMouseEnter={e => (e.currentTarget.style.background = "var(--clr-accent-soft)")}
                                  onMouseLeave={e => (e.currentTarget.style.background = subActive ? "var(--clr-accent-soft)" : "transparent")}
                                  onClick={() => setOpenDropdown(null)}
                                >
                                  <span aria-hidden="true" className="text-xl">{sub.icon}</span>
                                  {sub.name}
                                </Link>
                              </li>
                            );
                          })}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Right: Auth + Mobile toggle */}
          <div className="flex items-center gap-4">
            {status === "unauthenticated" ? (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/signIn"
                  className="text-base font-normal px-7 py-3.5 rounded-xl transition-all"
                  style={{ color: "var(--clr-primary)", border: "1.5px solid var(--clr-border)" }}
                >
                  Sign In
                </Link>
                <Link
                  href="/signUp"
                  className="text-base font-normal px-7 py-3.5 rounded-xl transition-all text-white"
                  style={{ background: "var(--clr-accent)" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--clr-accent-hov)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "var(--clr-accent)")}
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-normal" style={{ color: "var(--clr-accent)" }}>
                    Hi, {firstName}
                  </p>
                  <SignOut />
                </div>
                <UserAvatar user={data?.user} />
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              ref={mobileToggleRef}
              onClick={() => setShowMobile(true)}
              className="lg:hidden p-4 rounded-xl transition-colors text-white"
              style={{ background: "var(--clr-accent)" }}
              aria-label="Open navigation menu"
              aria-expanded={showMobile}
              aria-controls="mobile-menu"
            >
              <FaList className="text-xl" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* ════ HERO SECTION ════ */}
        <div
          className="hero-noise flex flex-col items-center justify-center text-center px-6 md:px-10 py-16 md:py-20 relative"
          aria-labelledby="hero-heading"
        >
          {/* Decorative gradient blob */}
          <div
            aria-hidden="true"
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ background: "radial-gradient(ellipse, var(--clr-accent) 0%, transparent 70%)" }}
          />

          <h1
            id="hero-heading"
            className="font-jomhuria text-3xl md:text-4xl lg:text-6xl mb-4 font-normal tracking-wide relative z-10"
            style={{ color: "var(--clr-primary)" }}
          >
            {title || "Welcome To Your Healthy Life"}
          </h1>

          {description && (
            <p
              className="text-xl md:text-2xl max-w-3xl mx-auto mb-6 font-normal leading-relaxed relative z-10"
              style={{ color: "var(--clr-text-muted)" }}
            >
              {description}
            </p>
          )}
        </div>

        {/* ════ MOBILE SIDEBAR ════ */}
        <AnimatePresence>
          {showMobile && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 lg:hidden"
                style={{ background: "rgba(20,12,5,.55)", backdropFilter: "blur(4px)" }}
                onClick={() => setShowMobile(false)}
                aria-hidden="true"
              />

              {/* Drawer */}
              <motion.div
                id="mobile-menu"
                ref={mobileMenuRef}
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 220 }}
                className="fixed top-0 right-0 h-full w-full max-w-sm z-50 p-6 overflow-y-auto lg:hidden flex flex-col"
                style={{ background: "var(--clr-surface)", boxShadow: "var(--shadow-xl)" }}
              >
                {/* Drawer header */}
                <div className="flex justify-between items-center mb-8 pb-4" style={{ borderBottom: "1px solid var(--clr-border)" }}>
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10">
                      <Image src={logoImage} alt="" fill sizes="40px" className="rounded-xl" unoptimized />
                    </div>
                    <span className="text-xl font-normal" style={{ color: "var(--clr-primary)" }}>Menu</span>
                  </div>
                  <button
                    onClick={() => { setShowMobile(false); mobileToggleRef.current?.focus(); }}
                    className="p-2.5 rounded-xl transition-colors"
                    style={{ color: "var(--clr-muted)" }}
                    aria-label="Close navigation menu"
                  >
                    <FaTimes className="text-xl" aria-hidden="true" />
                  </button>
                </div>

                {/* Nav links */}
                <nav aria-label="Mobile navigation" className="flex-1 space-y-1">
                  {visibleLinks.map((link) => {
                    const hasSubs   = Boolean(link.subLinks?.length);
                    const isDropOpen = openMobileDropdown === link.name;

                    if (!hasSubs) {
                      return (
                        <Link
                          key={link.path}
                          href={link.path!}
                          aria-current={pathname === link.path ? "page" : undefined}
                          className="flex items-center gap-3 px-5 py-4 rounded-xl text-base font-normal transition-colors"
                          style={{
                            color:      pathname === link.path ? "var(--clr-accent)" : "var(--clr-text-muted)",
                            background: pathname === link.path ? "var(--clr-accent-soft)" : "transparent",
                          }}
                          onClick={() => setShowMobile(false)}
                        >
                          <span aria-hidden="true" className="text-lg">{link.icon}</span>
                          {link.name}
                        </Link>
                      );
                    }

                    return (
                      <div key={link.name}>
                        <button
                          aria-expanded={isDropOpen}
                          className="w-full flex items-center justify-between px-5 py-4 rounded-xl text-base font-normal transition-colors"
                          style={{ color: "var(--clr-text-muted)" }}
                          onClick={() => setOpenMobileDropdown(isDropOpen ? null : link.name)}
                        >
                          <span className="flex items-center gap-3">
                            <span aria-hidden="true" className="text-lg">{link.icon}</span>
                            {link.name}
                          </span>
                          <FaChevronDown
                            aria-hidden="true"
                            className="text-xs transition-transform duration-200"
                            style={{ transform: isDropOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                          />
                        </button>

                        <AnimatePresence>
                          {isDropOpen && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{   height: 0, opacity: 0 }}
                              transition={{ duration: .2 }}
                              className="overflow-hidden ml-4 mt-1 space-y-1"
                            >
                              {link.subLinks?.map((sub) => (
                                <li key={sub.path}>
                                  <Link
                                    href={sub.path}
                                    aria-current={pathname === sub.path ? "page" : undefined}
                                    className="flex items-center gap-3 px-5 py-3.5 rounded-xl text-base font-normal transition-colors"
                                    style={{ color: "var(--clr-text-muted)" }}
                                    onClick={() => setShowMobile(false)}
                                  >
                                    <span aria-hidden="true" className="text-lg">{sub.icon}</span>
                                    {sub.name}
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </nav>

                {/* Auth section */}
                <div className="mt-auto pt-6" style={{ borderTop: "1px solid var(--clr-border)" }}>
                  {status === "unauthenticated" && (
                    <div className="flex flex-col gap-3">
                      <Link
                        href="/signIn"
                        className="p-4 text-center text-base font-normal rounded-xl transition-colors"
                        style={{ border: "1.5px solid var(--clr-border)", color: "var(--clr-primary)" }}
                        onClick={() => setShowMobile(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/signUp"
                        className="p-4 text-center text-base font-normal rounded-xl text-white transition-colors"
                        style={{ background: "var(--clr-accent)" }}
                        onClick={() => setShowMobile(false)}
                      >
                        Get Started
                      </Link>
                    </div>
                  )}

                  {status === "authenticated" && (
                    <div className="flex items-center gap-3">
                      <Link href="/profile">
                        <UserAvatar user={data?.user} />
                      </Link>
                      <div>
                        <p className="text-sm font-normal" style={{ color: "var(--clr-accent)" }}>
                          Hi, {firstName}
                        </p>
                        <div className="mt-1"><SignOut /></div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
