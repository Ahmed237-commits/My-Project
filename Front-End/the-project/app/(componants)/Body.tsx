"use client";

import React, { useEffect, useRef } from "react";
import {
  FaHeartbeat, FaAppleAlt, FaRunning, FaCalculator,
  FaBed, FaWalking, FaChartLine, FaArrowRight,
} from "react-icons/fa";
import Link from "next/link";
import sal from "sal.js";
// @ts-ignore
import "sal.js/dist/sal.css";
import { useSession } from "next-auth/react";
import { useTheme } from "../context/ThemeContext";

/* ════════════════════════════════════════════
   TYPES
════════════════════════════════════════════ */
interface ToolCard {
  href:        string;
  icon:        React.ReactNode;
  title:       string;
  description: string;
  delay:       number;
  span?:       string;
}

/* ════════════════════════════════════════════
   CARDS CONFIG
════════════════════════════════════════════ */
const TOOL_CARDS: ToolCard[] = [
  {
    href:        "/bmi",
    icon:        <FaCalculator aria-hidden="true" />,
    title:       "BMI Calculator",
    description: "Know your Body Mass Index instantly and understand where you stand.",
    delay:       100,
  },
  {
    href:        "/workout",
    icon:        <FaRunning aria-hidden="true" />,
    title:       "Workout Plan",
    description: "AI-tailored exercises designed around your fitness goals.",
    delay:       150,
  },
  {
    href:        "/caloriestracker",
    icon:        <FaAppleAlt aria-hidden="true" />,
    title:       "Calories Tracker",
    description: "Log your meals and monitor your nutritional intake daily.",
    delay:       200,
  },
  {
    href:        "/caloriescalculator",
    icon:        <FaChartLine aria-hidden="true" />,
    title:       "Calories Calculator",
    description: "Find out exactly how many calories your body needs each day.",
    delay:       250,
  },
  {
    href:        "/sleepcalculator",
    icon:        <FaBed aria-hidden="true" />,
    title:       "Sleep Calculator",
    description: "Align your sleep with natural cycles to wake up refreshed.",
    delay:       300,
  },
  {
    href:        "/stepscalculator",
    icon:        <FaWalking aria-hidden="true" />,
    title:       "Steps Calculator",
    description: "Turn daily movement into measurable, meaningful progress.",
    delay:       350,
  },
];

const STATS = [
  { value: "90%",   label: "of users report improved daily energy levels" },
  { value: "10k+",  label: "active members building healthier habits" },
  { value: "30+",   label: "professional wellness experts on board" },
];

/* ════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════ */
const Body = () => {
  const { data, status } = useSession();
  const { theme }        = useTheme();
  const sectionRef       = useRef<HTMLElement>(null);

  useEffect(() => {
    sal({ threshold: 0.1, once: true, root: null });
  }, []);

  const isDark = theme === "dark";

  return (
    <>
      <style>{`
        /* ── Re-use variables set by Header, add section-specific ones ── */
        .body-section {
          background: var(--clr-bg, #fdfaf6);
          color:      var(--clr-text, #2d1f14);
        }

        /* ── Tool card hover ── */
        .tool-card {
          background:    var(--clr-surface, #fff);
          border:        1.5px solid var(--clr-border, #ecddd0);
          border-radius: var(--radius-xl, 1.5rem);
          transition:    transform 280ms cubic-bezier(.4,0,.2,1),
                         box-shadow 280ms cubic-bezier(.4,0,.2,1),
                         border-color 280ms;
          will-change:   transform;
        }
        .tool-card:hover,
        .tool-card:focus-within {
          transform:    translateY(-6px);
          box-shadow:   0 20px 48px rgba(74,59,47,.14);
          border-color: var(--clr-accent, #c8956c);
        }

        /* ── Icon wrapper ── */
        .icon-wrap {
          width:  5rem;
          height: 5rem;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--clr-accent-soft, #f5e6d8);
          color:      var(--clr-accent, #c8956c);
          font-size:  2.25rem;
          flex-shrink: 0;
          transition: background 280ms, color 280ms;
        }
        .tool-card:hover .icon-wrap,
        .tool-card:focus-within .icon-wrap {
          background: var(--clr-accent, #c8956c);
          color:      #fff;
        }

        /* ── Dashboard full-width card ── */
        .dashboard-card {
          background:    linear-gradient(135deg, var(--clr-accent-soft, #f5e6d8) 0%, var(--clr-surface, #fff) 100%);
          border:        1.5px solid var(--clr-border, #ecddd0);
          border-radius: var(--radius-xl, 1.5rem);
          transition:    transform 280ms cubic-bezier(.4,0,.2,1),
                         box-shadow 280ms cubic-bezier(.4,0,.2,1);
        }
        .dashboard-card:hover,
        .dashboard-card:focus-within {
          transform:  translateY(-6px);
          box-shadow: 0 20px 48px rgba(74,59,47,.14);
        }

        /* ── Stats card ── */
        .stat-card {
          background:    var(--clr-surface, #fff);
          border:        1.5px solid var(--clr-border, #ecddd0);
          border-radius: var(--radius-xl, 1.5rem);
          transition:    box-shadow 280ms;
        }
        .stat-card:hover { box-shadow: 0 8px 24px rgba(74,59,47,.1); }

        /* ── CTA button ── */
        .cta-btn {
          display:         inline-flex;
          align-items:     center;
          gap:             .6rem;
          padding:         1rem 2.5rem;
          border-radius:   .875rem;
          background:      var(--clr-accent, #c8956c);
          color:           #fff;
          font-weight:     400;
          font-size:       1.125rem;
          text-decoration: none;
          transition:      background 200ms, transform 200ms, box-shadow 200ms;
          box-shadow:      0 4px 16px rgba(200,149,108,.35);
        }
        .cta-btn:hover {
          background: var(--clr-accent-hov, #b5794e);
          transform:  translateY(-2px);
          box-shadow: 0 8px 24px rgba(200,149,108,.45);
        }
        .cta-btn:focus-visible {
          outline:        2.5px solid var(--clr-accent, #c8956c);
          outline-offset: 3px;
        }
        .cta-btn:active { transform: translateY(0); }

        /* ── Section divider ── */
        .section-divider {
          width: 3rem;
          height: 3px;
          border-radius: 9px;
          background: var(--clr-accent, #c8956c);
          margin: 1rem auto 0;
        }
      `}</style>

      <main id="main-content" tabIndex={-1}>
        <section
          ref={sectionRef}
          className="body-section px-6 py-24"
          aria-labelledby="section-heading"
        >
          {/* ════ HEADLINE ════ */}
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <p
              className="text-sm font-normal uppercase tracking-widest mb-4"
              style={{ color: "var(--clr-accent)" }}
              aria-hidden="true"
            >
              Your wellness, simplified
            </p>
            <h2
              id="section-heading"
              className="text-4xl md:text-5xl lg:text-6xl mb-4 font-normal leading-tight"
              style={{ color: "var(--clr-primary, #4a3b2f)" }}
            >
              Live a Healthier Life 🌿
            </h2>
            <div className="section-divider" aria-hidden="true" />
            <p
              className="mt-6 text-lg md:text-xl font-normal leading-relaxed"
              style={{ color: "var(--clr-text-muted, #6b5c50)" }}
            >
              Take control of your health — eat better, move more, sleep deeper, and
              build habits that help you feel your best every single day.
            </p>
          </div>

          {/* ════ TOOL CARDS GRID ════ */}
          <div
            className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
            role="list"
            aria-label="Health tools"
          >
            {TOOL_CARDS.map((card) => (
              <div
                key={card.href}
                role="listitem"
                data-sal="slide-up"
                data-sal-delay={card.delay}
                data-sal-duration="700"
              >
                <Link
                  href={card.href}
                  className="tool-card flex flex-col p-10 h-full group"
                  aria-label={`${card.title} – ${card.description}`}
                >
                  <div className="icon-wrap mb-5">{card.icon}</div>
                  <h3
                    className="text-2xl font-normal mb-3"
                    style={{ color: "var(--clr-primary, #4a3b2f)" }}
                  >
                    {card.title}
                  </h3>
                  <p
                    className="text-base leading-relaxed flex-1"
                    style={{ color: "var(--clr-text-muted, #6b5c50)" }}
                  >
                    {card.description}
                  </p>
                  <span
                    className="mt-5 text-base font-normal flex items-center gap-1.5 transition-all"
                    style={{ color: "var(--clr-accent, #c8956c)" }}
                    aria-hidden="true"
                  >
                    Explore <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </div>
            ))}

            {/* ── Dashboard full-width card ── */}
            <div
              className="md:col-span-2 lg:col-span-3"
              data-sal="slide-up"
              data-sal-delay={400}
              data-sal-duration="700"
              role="listitem"
            >
              <Link
                href="/dashBoard"
                className="dashboard-card flex flex-col md:flex-row items-center gap-8 p-12"
                aria-label="My Dashboard – View all your health stats in one place"
              >
                <div
                  className="icon-wrap flex-shrink-0"
                  style={{ width: "5rem", height: "5rem", fontSize: "2.25rem", background: "var(--clr-accent)", color: "#fff" }}
                  aria-hidden="true"
                >
                  <FaHeartbeat />
                </div>
                <div className="text-center md:text-left">
                  <h3
                    className="text-3xl font-normal mb-2"
                    style={{ color: "var(--clr-primary, #4a3b2f)" }}
                  >
                    My Dashboard
                  </h3>
                  <p
                    className="text-base"
                    style={{ color: "var(--clr-text-muted, #6b5c50)" }}
                  >
                    View all your health stats, progress charts, and personal records in one place.
                  </p>
                </div>
                <span
                  className="md:ml-auto flex-shrink-0 text-sm font-normal flex items-center gap-1.5"
                  style={{ color: "var(--clr-accent, #c8956c)" }}
                  aria-hidden="true"
                >
                  Open <FaArrowRight />
                </span>
              </Link>
            </div>
          </div>

          {/* ════ STATS ════ */}
          <div
            className="max-w-5xl mx-auto mt-20 grid md:grid-cols-3 gap-6"
            aria-label="Platform statistics"
            data-sal="slide-up"
            data-sal-delay="150"
            data-sal-duration="800"
          >
            {STATS.map((stat) => (
              <div key={stat.value} className="stat-card p-10 text-center">
                <p
                  className="text-5xl font-bold mb-3"
                  style={{ color: "var(--clr-accent, #c8956c)" }}
                  aria-label={`${stat.value} – ${stat.label}`}
                >
                  <span aria-hidden="true">{stat.value}</span>
                </p>
                <p
                  className="text-base font-normal leading-relaxed"
                  style={{ color: "var(--clr-text-muted, #6b5c50)" }}
                  aria-hidden="true"
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* ════ CTA ════ */}
          <div className="mt-20 text-center">
            <Link
              href={status === "authenticated" ? "/dashBoard" : "/signIn"}
              className="cta-btn"
            >
              {status === "authenticated" ? "Go to Dashboard" : "Start Your Health Journey"}
              <FaArrowRight aria-hidden="true" />
            </Link>
            {status === "unauthenticated" && (
              <p
                className="mt-4 text-sm"
                style={{ color: "var(--clr-text-muted, #6b5c50)" }}
              >
                Free to join. No credit card needed.
              </p>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default Body;
