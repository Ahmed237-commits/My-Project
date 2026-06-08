import Link from "next/link";
import { FaArrowLeft, FaShieldAlt, FaDatabase, FaLock } from "react-icons/fa";

const sections = [
  {
    icon: <FaDatabase aria-hidden="true" />,
    title: "1. Information We Collect",
    intro: "At Health Life, we are deeply committed to protecting your personal data. To provide you with highly customised tracking tools and an optimal experience, we collect the following:",
    items: [
      { label: "Account Details", text: "Your name, email address, and profile picture when logging in via our secure authentication systems." },
      { label: "Health & Fitness Metrics", text: "Data you voluntarily provide to use our core utilities, including weight, height, age, activity levels, daily steps, and sleep duration." },
    ],
  },
  {
    icon: <FaShieldAlt aria-hidden="true" />,
    title: "2. How We Use Your Data",
    intro: "Your information is processed strictly to power the computational features of the platform:",
    items: [
      { label: "Core Calculations", text: "To perform precise calculations for the BMI Calculator, Calorie Tracker, and dynamic Workout Plans." },
      { label: "Dashboard Analytics", text: "To generate comprehensive overviews of your health progress on your dedicated dashboard." },
      { label: "No Commercialisation", text: "We hold a strict policy against data commercialisation. We do not sell, trade, or share your personal fitness metrics with third-party advertisers." },
    ],
  },
  {
    icon: <FaLock aria-hidden="true" />,
    title: "3. Data Security & Ownership",
    intro: "We implement industry-standard security measures to safeguard your account. You retain total ownership of your information and can modify your profile data or permanently delete your account and calculation history at any time directly from your dashboard settings.",
    items: [],
  },
];

export default function PrivacyPolicy() {
  return (
    <>
      <style>{`
        .privacy-root {
          min-height: 100vh;
          background: var(--clr-bg, #fdfaf6);
          padding: 4rem 1.5rem 6rem;
        }
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: .5rem;
          font-size: 1rem;
          font-weight: normal;
          color: var(--clr-accent, #c8956c);
          text-decoration: none;
          padding: .5rem 1rem;
          border-radius: .5rem;
          transition: all 200ms;
          margin-bottom: 3rem;
        }
        .back-link:hover {
          background: var(--clr-accent-soft, #f5e6d8);
          transform: translateX(-4px);
        }
        .privacy-badge {
          width: 60px; height: 60px;
          border-radius: 50%;
          background: var(--clr-accent-soft, #f5e6d8);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--clr-accent, #c8956c);
          font-size: 1.6rem;
          margin-bottom: 1.5rem;
        }
        .privacy-card {
          background: var(--clr-surface, #fff);
          border: 1.5px solid var(--clr-border, #ecddd0);
          border-radius: 1.5rem;
          padding: 2.5rem;
          transition: box-shadow 250ms;
        }
        .privacy-card:hover {
          box-shadow: 0 12px 35px rgba(74,59,47,.1);
        }
        .section-icon {
          width: 44px; height: 44px;
          border-radius: .75rem;
          background: var(--clr-accent-soft, #f5e6d8);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--clr-accent, #c8956c);
          font-size: 1.2rem;
          margin-bottom: 1.25rem;
        }
        .privacy-item {
          display: flex;
          gap: 1rem;
          padding: 1.1rem 1.25rem;
          border-radius: .85rem;
          background: var(--clr-bg, #fdfaf6);
          border: 1px solid var(--clr-border, #ecddd0);
        }
        .privacy-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          background: var(--clr-accent, #c8956c);
          flex-shrink: 0;
          margin-top: .5rem;
        }
        .privacy-divider {
          width: 3.5rem;
          height: 4px;
          border-radius: 10px;
          background: var(--clr-accent, #c8956c);
          margin: 1rem 0 2rem;
        }
        .privacy-footer-note {
          border-top: 1px solid var(--clr-border, #ecddd0);
          margin-top: 4rem;
          padding-top: 2rem;
          font-size: 1rem;
          color: var(--clr-muted, #7a6a5e);
          text-align: center;
        }
        .privacy-footer-note a {
          color: var(--clr-accent, #c8956c);
          text-decoration: none;
        }
      `}</style>

      <div className="privacy-root">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="back-link">
            <FaArrowLeft aria-hidden="true" />
            Back to Home
          </Link>

          <div className="mb-12">
            <div className="privacy-badge"><FaShieldAlt /></div>
            <h1 className="text-4xl md:text-5xl font-normal tracking-wide mb-4" style={{ color: "var(--clr-primary)" }}>
              Privacy Policy
            </h1>
            <div className="privacy-divider" />
            <p className="text-lg font-normal" style={{ color: "var(--clr-text-muted)" }}>
              Last updated: June 2026 — Clean, simple, and transparent.
            </p>
          </div>

          <div className="space-y-8">
            {sections.map((sec) => (
              <article key={sec.title} className="privacy-card">
                <div className="section-icon">{sec.icon}</div>
                <h2 className="text-2xl font-normal mb-4" style={{ color: "var(--clr-primary)" }}>{sec.title}</h2>
                <p className="text-lg leading-relaxed font-normal mb-6" style={{ color: "var(--clr-text-muted)" }}>{sec.intro}</p>
                {sec.items.length > 0 && (
                  <ul className="space-y-4">
                    {sec.items.map((item) => (
                      <li key={item.label} className="privacy-item">
                        <div className="privacy-dot" />
                        <p className="text-base md:text-lg leading-relaxed font-normal" style={{ color: "var(--clr-text-muted)" }}>
                          <div style={{ color: "var(--clr-primary)" }}>{item.label}:</div> {item.text}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>

          <div className="privacy-footer-note">
            Questions about your data? <Link href="/contact">Contact us</Link> — we're happy to help.
          </div>
        </div>
      </div>
    </>
  );
}