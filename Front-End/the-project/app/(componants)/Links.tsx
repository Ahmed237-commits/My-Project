'use client';

import React from 'react';
import { FaInstagram, FaFacebook, FaXTwitter } from 'react-icons/fa6';

const socialLinks = [
  {
    href:  'https://facebook.com',
    icon:  <FaFacebook aria-hidden="true" />,
    label: 'Follow us on Facebook',
    name:  'Facebook',
  },
  {
    href:  'https://x.com',
    icon:  <FaXTwitter aria-hidden="true" />,
    label: 'Follow us on X (formerly Twitter)',
    name:  'X',
  },
  {
    href:  'https://instagram.com',
    icon:  <FaInstagram aria-hidden="true" />,
    label: 'Follow us on Instagram',
    name:  'Instagram',
  },
];

const SocialLinks = () => {
  return (
    <div>
      <style>{`
        .social-btn {
          display:        flex;
          flex-direction: column;
          align-items:    center;
          gap:            .4rem;
          text-decoration: none;
          color:          rgba(245,230,216,.7);
          font-size:      .85rem;
          font-weight:    normal;
          transition:     color 220ms, transform 220ms;
        }
        .social-btn:hover,
        .social-btn:focus-visible {
          color:     var(--clr-accent-soft, #f5e6d8);
          transform: translateY(-3px);
        }
        .social-btn:focus-visible {
          outline:        2px solid var(--clr-accent, #c8956c);
          outline-offset: 4px;
          border-radius:  50%;
        }

        .social-icon-wrap {
          width:           48px;
          height:          48px;
          border-radius:   50%;
          display:         flex;
          align-items:     center;
          justify-content: center;
          font-size:       1.35rem;
          border:          1.5px solid rgba(200,149,108,.4);
          background:      rgba(200,149,108,.08);
          transition:      background 220ms, border-color 220ms, box-shadow 220ms;
        }
        .social-btn:hover  .social-icon-wrap,
        .social-btn:focus-visible .social-icon-wrap {
          background:   rgba(200,149,108,.22);
          border-color: var(--clr-accent, #c8956c);
          box-shadow:   0 4px 14px rgba(200,149,108,.3);
        }
      `}</style>

      <nav aria-label="Social media links">
        <ul className="flex gap-5" role="list">
          {socialLinks.map((link) => (
            <li key={link.href} role="listitem">
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="social-btn"
              >
                <span className="social-icon-wrap">{link.icon}</span>
                <span aria-hidden="true">{link.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default SocialLinks;
