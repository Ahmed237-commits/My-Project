'use client';

import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import Link from 'next/link';
import SocialLinks from './Links';
import {
  FaHome, FaCalculator, FaDumbbell, FaEnvelope,
  FaChartLine, FaSignInAlt, FaLeaf, FaArrowRight,
  FaHeartbeat,
} from 'react-icons/fa';

interface FooterProps {
  session: any;
}

const FooterContent = ({ session }: FooterProps) => {
  const formRef  = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    const formData  = new FormData(e.currentTarget);
    const userEmail = formData.get('user_email') as string;

    try {
      await emailjs.sendForm(
        'service_eooljyp',
        'template_123456',
        formRef.current!,
        'template_0fzf69j'
      );
      setStatus('success');
      formRef.current?.reset();
    } catch (error) {
      console.error('Failed to send email:', error);
      setStatus('error');
    }
  };

  const quickLinks = [
    { name: 'Home',      href: '/',        icon: <FaHome aria-hidden="true" /> },
    { name: 'BMI',       href: '/bmi',     icon: <FaCalculator aria-hidden="true" /> },
    { name: 'Workouts',  href: '/workout', icon: <FaDumbbell aria-hidden="true" /> },
    { name: 'Contact',   href: '/contact', icon: <FaEnvelope aria-hidden="true" /> },
    {
      name: session ? 'Dashboard' : 'Sign In',
      href: session ? '/dashBoard' : '/signIn',
      icon: session ? <FaChartLine aria-hidden="true" /> : <FaSignInAlt aria-hidden="true" />,
    },
  ];

  return (
    <>
      <style>{`
        /* ── Footer uses the same CSS vars set by Header ── */
        .footer-root {
          background: var(--clr-primary, #4a3b2f);
          color:      var(--clr-accent-soft, #f5e6d8);
          position:   relative;
          overflow:   hidden;
        }

        /* ── Decorative top wave ── */
        .footer-wave {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: linear-gradient(
            90deg,
            var(--clr-accent-soft, #f5e6d8) 0%,
            var(--clr-accent, #c8956c)       40%,
            var(--clr-accent-soft, #f5e6d8) 100%
          );
        }

        /* ── Background pattern ── */
        .footer-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(
            circle at 80% 20%,
            rgba(200,149,108,.08) 0%,
            transparent 50%
          ), radial-gradient(
            circle at 10% 80%,
            rgba(200,149,108,.06) 0%,
            transparent 45%
          );
          pointer-events: none;
        }

        /* ── Column headings ── */
        .footer-heading {
          font-size:      1.1rem;
          font-weight:    normal;
          letter-spacing: .08em;
          text-transform: uppercase;
          color:          var(--clr-accent, #c8956c);
          margin-bottom:  1.25rem;
          display:        flex;
          align-items:    center;
          gap:            .5rem;
        }
        .footer-heading::after {
          content:    '';
          flex:       1;
          height:     1px;
          background: rgba(200,149,108,.3);
        }

        /* ── Quick links ── */
        .footer-link {
          display:         flex;
          align-items:     center;
          gap:             .6rem;
          padding:         .5rem .75rem;
          border-radius:   .6rem;
          color:           rgba(245,230,216,.75);
          font-size:       .975rem;
          font-weight:     normal;
          text-decoration: none;
          transition:      color 200ms, background 200ms, transform 200ms;
        }
        .footer-link:hover,
        .footer-link:focus-visible {
          color:       var(--clr-accent-soft, #f5e6d8);
          background:  rgba(200,149,108,.15);
          transform:   translateX(4px);
        }
        .footer-link:focus-visible {
          outline:        2px solid var(--clr-accent, #c8956c);
          outline-offset: 2px;
        }

        /* ── Subscribe input ── */
        .subscribe-input {
          width:         100%;
          padding:       .75rem 1rem;
          border-radius: .75rem;
          border:        1.5px solid rgba(200,149,108,.35);
          background:    rgba(255,255,255,.07);
          color:         var(--clr-accent-soft, #f5e6d8);
          font-size:     .975rem;
          font-weight:   normal;
          transition:    border-color 200ms, background 200ms;
          outline:       none;
        }
        .subscribe-input::placeholder { color: rgba(245,230,216,.45); }
        .subscribe-input:focus {
          border-color: var(--clr-accent, #c8956c);
          background:   rgba(255,255,255,.11);
        }

        /* ── Subscribe button ── */
        .subscribe-btn {
          display:       flex;
          align-items:   center;
          justify-content: center;
          gap:           .5rem;
          width:         100%;
          padding:       .8rem 1.25rem;
          border-radius: .75rem;
          border:        none;
          cursor:        pointer;
          background:    var(--clr-accent, #c8956c);
          color:         #fff;
          font-size:     .975rem;
          font-weight:   normal;
          transition:    background 200ms, transform 200ms, box-shadow 200ms;
          box-shadow:    0 4px 12px rgba(200,149,108,.35);
        }
        .subscribe-btn:hover:not(:disabled) {
          background:  var(--clr-accent-hov, #b5794e);
          transform:   translateY(-1px);
          box-shadow:  0 6px 16px rgba(200,149,108,.45);
        }
        .subscribe-btn:active:not(:disabled) { transform: translateY(0); }
        .subscribe-btn:disabled { opacity: .65; cursor: not-allowed; }
        .subscribe-btn:focus-visible {
          outline:        2px solid var(--clr-accent-soft, #f5e6d8);
          outline-offset: 3px;
        }

        /* ── Status messages ── */
        .status-msg {
          font-size:    .875rem;
          font-weight:  normal;
          padding:      .5rem .75rem;
          border-radius: .5rem;
          margin-top:   .5rem;
        }
        .status-success {
          background: rgba(134,197,118,.15);
          color:      #a8edaa;
          border:     1px solid rgba(134,197,118,.3);
        }
        .status-error {
          background: rgba(239,100,100,.12);
          color:      #ffaaaa;
          border:     1px solid rgba(239,100,100,.25);
        }

        /* ── Divider ── */
        .footer-divider {
          border:     none;
          border-top: 1px solid rgba(200,149,108,.2);
          margin:     2.5rem 0 1.5rem;
        }

        /* ── Bottom bar ── */
        .footer-bottom {
          display:         flex;
          flex-wrap:       wrap;
          justify-content: space-between;
          align-items:     center;
          gap:             .75rem;
          font-size:       .875rem;
          color:           rgba(245,230,216,.55);
          font-weight:     normal;
        }
        .footer-bottom a {
          color:           rgba(245,230,216,.7);
          text-decoration: none;
          transition:      color 200ms;
        }
        .footer-bottom a:hover { color: var(--clr-accent-soft, #f5e6d8); }

        /* ── About description ── */
        .footer-about-text {
          font-size:   .975rem;
          line-height: 1.7;
          color:       rgba(245,230,216,.7);
          font-weight: normal;
        }

        /* ── Logo mark in footer ── */
        .footer-logo-mark {
          display:      inline-flex;
          align-items:  center;
          gap:          .5rem;
          font-size:    1.25rem;
          font-weight:  normal;
          color:        var(--clr-accent-soft, #f5e6d8);
          margin-bottom: .75rem;
        }
        .footer-logo-mark svg {
          color: var(--clr-accent, #c8956c);
          font-size: 1.5rem;
        }
      `}</style>

      <footer className="footer-root" role="contentinfo" aria-label="Site footer">
        {/* Top accent line */}
        <div className="footer-wave" aria-hidden="true" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pt-16 pb-8">

          {/* ════ MAIN GRID ════ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

            {/* ── Col 1: About ── */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="footer-logo-mark" aria-label="HealthZone">
                <FaHeartbeat aria-hidden="true" />
                <span>HealthZone</span>
              </div>
              <p className="footer-about-text">
                We guide you toward a healthier lifestyle — from balanced nutrition and
                simple workouts to mental wellness and better daily habits.
              </p>
              {/* Social links slot */}
              <div className="mt-5">
                <SocialLinks />
              </div>
            </div>

            {/* ── Col 2: Quick Links ── */}
            <nav aria-label="Footer navigation">
              <h2 className="footer-heading">
                <FaLeaf aria-hidden="true" className="text-sm" />
                Quick Links
              </h2>
              <ul className="space-y-1" role="list">
                {quickLinks.map((link) => (
                  <li key={link.href} role="listitem">
                    <Link href={link.href} className="footer-link">
                      {link.icon}
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* ── Col 3: Health Tools ── */}
            <nav aria-label="Health tools navigation">
              <h2 className="footer-heading">
                <FaHeartbeat aria-hidden="true" className="text-sm" />
                Health Tools
              </h2>
              <ul className="space-y-1" role="list">
                {[
                  { name: 'Calories Tracker',    href: '/caloriestracker'    },
                  { name: 'Calories Calculator', href: '/caloriescalculator' },
                  { name: 'Sleep Calculator',    href: '/sleepcalculator'    },
                  { name: 'Steps Calculator',    href: '/stepscalculator'    },
                ].map((item) => (
                  <li key={item.href} role="listitem">
                    <Link href={item.href} className="footer-link">
                      <FaArrowRight aria-hidden="true" className="text-xs opacity-60" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* ── Col 4: Newsletter ── */}
            <div>
              <h2 className="footer-heading">
                <FaEnvelope aria-hidden="true" className="text-sm" />
                Newsletter
              </h2>
              <p className="footer-about-text mb-4">
                Get weekly tips on fitness, nutrition, and motivation straight to your inbox.
              </p>

              <form
                ref={formRef}
                onSubmit={handleSubscribe}
                aria-label="Subscribe to newsletter"
                noValidate
              >
                {/* Hidden fields for EmailJS */}
                <input type="hidden" name="name"     value={session?.user?.name || 'Guest'} />
                <input type="hidden" name="to_email" value="aethefifthofjuly@gmail.com" />

                <div className="space-y-3">
                  <div>
                    <label htmlFor="footer-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="footer-email"
                      type="email"
                      name="user_email"
                      placeholder="your@email.com"
                      required
                      disabled={status === 'loading' || status === 'success'}
                      className="subscribe-input"
                      aria-describedby={
                        status === 'success' ? 'sub-success'
                        : status === 'error' ? 'sub-error'
                        : undefined
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    className="subscribe-btn"
                    disabled={status === 'loading' || status === 'success'}
                    aria-busy={status === 'loading'}
                  >
                    {status === 'loading' ? (
                      <>
                        <svg
                          aria-hidden="true"
                          className="animate-spin"
                          width="16" height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                        </svg>
                        Sending…
                      </>
                    ) : status === 'success' ? (
                      '✓ Subscribed!'
                    ) : (
                      <>Subscribe <FaArrowRight aria-hidden="true" className="text-xs" /></>
                    )}
                  </button>

                  {status === 'success' && (
                    <p id="sub-success" className="status-msg status-success" role="status">
                      🎉 You're in! Check your inbox soon.
                    </p>
                  )}
                  {status === 'error' && (
                    <p id="sub-error" className="status-msg status-error" role="alert">
                      Something went wrong. Please try again.
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* ════ BOTTOM BAR ════ */}
          <hr className="footer-divider" aria-hidden="true" />
          <div className="footer-bottom">
            <span>
              &copy; {new Date().getFullYear()} HealthZone. All rights reserved.
            </span>
            <nav aria-label="Legal links" className="flex gap-5">
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Use</Link>
            </nav>
          </div>

        </div>
      </footer>
    </>
  );
};

export default FooterContent;
