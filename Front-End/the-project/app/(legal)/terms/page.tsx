import Link from "next/link";
import { FaArrowLeft, FaGavel, FaUserShield, FaExclamationTriangle, FaEdit } from "react-icons/fa";

const termSections = [
  {
    icon: <FaExclamationTriangle />,
    title: "Medical Disclaimer",
    content: "All tools and digital health calculators provided on Health Life—including BMI, Calorie, Sleep, and Steps tracking utilities—are built on standard mathematical algorithms. They provide estimations for informational purposes only and must not be interpreted as professional medical advice. Always consult a qualified physician before starting any intense regime.",
    isWarning: true,
  },
  {
    icon: <FaUserShield />,
    title: "1. User Accounts & Accountability",
    content: "When interacting with our dashboards, you are fully responsible for maintaining the confidentiality of your session credentials. Any malicious attempt to exploit the backend architecture or automated endpoints will result in an immediate suspension of your access privileges.",
  },
  {
    icon: <FaGavel />,
    title: "2. Intellectual Property",
    content: "The specialized code structures, minimal UI design patterns, visual logic, and proprietary branding assets integrated into Health Life are protected by intellectual property laws. Reproduction or distribution of these assets without direct authorization is strictly prohibited.",
  },
  {
    icon: <FaEdit />,
    title: "3. Service Amendments",
    content: "We reserve the right to refine or adjust these terms to align with system feature updates. Continued interaction with the platform following these shifts implies complete acceptance of the updated framework.",
  },
];

export default function TermsAndConditions() {
  return (
    <>
      <style>{`
        .terms-root {
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
        .terms-badge {
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
        .terms-card {
          background: var(--clr-surface, #fff);
          border: 1.5px solid var(--clr-border, #ecddd0);
          border-radius: 1.5rem;
          padding: 2.5rem;
          transition: box-shadow 250ms;
        }
        .terms-card.warning-card {
          border-left: 5px solid var(--clr-accent, #c8956c);
        }
        .terms-card:hover {
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
        .terms-divider {
          width: 3.5rem;
          height: 4px;
          border-radius: 10px;
          background: var(--clr-accent, #c8956c);
          margin: 1rem 0 2rem;
        }
        .terms-footer-note {
          border-top: 1px solid var(--clr-border, #ecddd0);
          margin-top: 4rem;
          padding-top: 2rem;
          font-size: 1rem;
          color: var(--clr-muted, #7a6a5e);
          text-align: center;
        }
      `}</style>

      <div className="terms-root">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="back-link">
            <FaArrowLeft aria-hidden="true" />
            Back to Home
          </Link>

          <div className="mb-12">
            <div className="terms-badge"><FaGavel /></div>
            <h1 className="text-4xl md:text-5xl font-normal tracking-wide mb-4" style={{ color: "var(--clr-primary)" }}>
              Terms & Conditions
            </h1>
            <div className="terms-divider" />
            <p className="text-lg font-normal" style={{ color: "var(--clr-text-muted)" }}>
              Last updated: June 2026 — Our mutual agreement for a healthier life.
            </p>
          </div>

          <div className="space-y-8">
            {termSections.map((sec) => (
              <article key={sec.title} className={`terms-card ${sec.isWarning ? 'warning-card' : ''}`}>
                <div className="section-icon">{sec.icon}</div>
                <h2 className="text-2xl font-normal mb-4" style={{ color: "var(--clr-primary)" }}>{sec.title}</h2>
                <p className="text-lg leading-relaxed font-normal" style={{ color: "var(--clr-text-muted)" }}>{sec.content}</p>
              </article>
            ))}
          </div>

          <div className="terms-footer-note">
            By using Health Life, you agree to these terms. Stay safe and healthy.
          </div>
        </div>
      </div>
    </>
  );
}