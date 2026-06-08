"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { FaGoogle, FaGithub, FaHeartbeat, FaUser, FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";
import axios from "axios";
import { useState } from "react";

export default function SignUpPage() {
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState(false);
  const [loading,  setLoading]  = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/api/auth/register", {
        name, email, password,
      });

      if (res.status === 201 || res.data?.success) {
        setSuccess(true);
        setTimeout(() => { window.location.href = "/signIn"; }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        /* ── reuse site-wide tokens ── */
        .signup-root {
          min-height:      100vh;
          display:         flex;
          flex-direction:  column;
          background:      var(--clr-bg, #fdfaf6);
          position:        relative;
          overflow:        hidden;
        }

        /* soft blobs */
        .signup-root::before,
        .signup-root::after {
          content:         '';
          position:        absolute;
          border-radius:   50%;
          pointer-events:  none;
          filter:          blur(80px);
          opacity:         .18;
        }
        .signup-root::before {
          width:      500px; height: 500px;
          top:        -120px; left: -100px;
          background: var(--clr-accent, #c8956c);
        }
        .signup-root::after {
          width:      400px; height: 400px;
          bottom:     -100px; right: -80px;
          background: var(--clr-accent, #c8956c);
        }

        /* ── card ── */
        .signup-card {
          background:    var(--clr-surface, #fff);
          border:        1.5px solid var(--clr-border, #ecddd0);
          border-radius: 1.5rem;
          box-shadow:    0 20px 60px rgba(74,59,47,.12);
          padding:       2.5rem;
          width:         100%;
          max-width:     440px;
          position:      relative;
          z-index:       1;
        }

        /* ── logo badge ── */
        .logo-badge {
          width:           56px; height: 56px;
          border-radius:   50%;
          background:      var(--clr-accent-soft, #f5e6d8);
          display:         flex;
          align-items:     center;
          justify-content: center;
          color:           var(--clr-accent, #c8956c);
          font-size:       1.6rem;
          margin:          0 auto 1rem;
        }

        /* ── inputs ── */
        .field-wrap {
          position: relative;
        }
        .field-icon {
          position:  absolute;
          left:      1rem;
          top:       50%;
          transform: translateY(-50%);
          color:     var(--clr-muted, #7a6a5e);
          font-size: .95rem;
          pointer-events: none;
        }
        .signup-input {
          width:         100%;
          padding:       .8rem 1rem .8rem 2.75rem;
          border-radius: .875rem;
          border:        1.5px solid var(--clr-border, #ecddd0);
          background:    var(--clr-bg, #fdfaf6);
          color:         var(--clr-text, #2d1f14);
          font-size:     1rem;
          font-weight:   normal;
          outline:       none;
          transition:    border-color 200ms, box-shadow 200ms;
          box-sizing:    border-box;
        }
        .signup-input::placeholder {
          color: var(--clr-muted, #7a6a5e);
          opacity: .7;
        }
        .signup-input:focus {
          border-color: var(--clr-accent, #c8956c);
          box-shadow:   0 0 0 3px rgba(200,149,108,.15);
        }
        .signup-input:focus-visible {
          outline: none;
        }

        /* ── label ── */
        .signup-label {
          display:       block;
          font-size:     .85rem;
          font-weight:   normal;
          color:         var(--clr-primary, #4a3b2f);
          margin-bottom: .4rem;
        }

        /* ── primary button ── */
        .signup-btn {
          width:           100%;
          padding:         .9rem;
          border-radius:   .875rem;
          border:          none;
          background:      var(--clr-accent, #c8956c);
          color:           #fff;
          font-size:       1rem;
          font-weight:     normal;
          cursor:          pointer;
          display:         flex;
          align-items:     center;
          justify-content: center;
          gap:             .5rem;
          transition:      background 200ms, transform 200ms, box-shadow 200ms;
          box-shadow:      0 4px 14px rgba(200,149,108,.35);
        }
        .signup-btn:hover:not(:disabled) {
          background: var(--clr-accent-hov, #b5794e);
          transform:  translateY(-1px);
          box-shadow: 0 6px 20px rgba(200,149,108,.4);
        }
        .signup-btn:active:not(:disabled) { transform: translateY(0); }
        .signup-btn:disabled { opacity: .65; cursor: not-allowed; }
        .signup-btn:focus-visible {
          outline:        2.5px solid var(--clr-accent, #c8956c);
          outline-offset: 3px;
        }

        /* ── social buttons ── */
        .social-btn {
          display:         flex;
          align-items:     center;
          justify-content: center;
          gap:             .5rem;
          padding:         .75rem;
          border-radius:   .875rem;
          border:          1.5px solid var(--clr-border, #ecddd0);
          background:      transparent;
          color:           var(--clr-primary, #4a3b2f);
          font-size:       .95rem;
          font-weight:     normal;
          cursor:          pointer;
          transition:      background 200ms, border-color 200ms, transform 200ms;
          width:           100%;
        }
        .social-btn:hover {
          background:   var(--clr-accent-soft, #f5e6d8);
          border-color: var(--clr-accent, #c8956c);
          transform:    translateY(-1px);
        }
        .social-btn:focus-visible {
          outline:        2.5px solid var(--clr-accent, #c8956c);
          outline-offset: 3px;
          border-radius:  .875rem;
        }

        /* ── divider ── */
        .divider {
          display:     flex;
          align-items: center;
          gap:         .75rem;
          color:       var(--clr-muted, #7a6a5e);
          font-size:   .85rem;
          font-weight: normal;
          margin:      1.5rem 0;
        }
        .divider::before,
        .divider::after {
          content:    '';
          flex:       1;
          height:     1px;
          background: var(--clr-border, #ecddd0);
        }

        /* ── success / error ── */
        .msg-success {
          background:    rgba(134,197,118,.12);
          border:        1px solid rgba(134,197,118,.35);
          color:         #3a7a30;
          border-radius: .75rem;
          padding:       .75rem 1rem;
          font-size:     .9rem;
          font-weight:   normal;
          text-align:    center;
        }
        .msg-error {
          background:    rgba(239,68,68,.08);
          border:        1px solid rgba(239,68,68,.25);
          color:         #b91c1c;
          border-radius: .75rem;
          padding:       .75rem 1rem;
          font-size:     .9rem;
          font-weight:   normal;
          text-align:    center;
        }

        /* ── spinner ── */
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width:  18px; height: 18px;
          border: 2.5px solid rgba(255,255,255,.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin .7s linear infinite;
          flex-shrink: 0;
        }
      `}</style>

      <div className="signup-root">
        <main
          className="flex-1 flex items-center justify-center px-5 py-14"
          style={{ position: 'relative', zIndex: 1 }}
        >
          <div className="signup-card">

            {/* ── Logo ── */}
            <div className="text-center mb-7">
              <div className="logo-badge" aria-hidden="true">
                <FaHeartbeat />
              </div>
              <h1
                className="text-3xl font-normal mb-1"
                style={{ color: 'var(--clr-primary, #4a3b2f)' }}
              >
                Create Account
              </h1>
              <p style={{ color: 'var(--clr-text-muted, #6b5c50)', fontSize: '.95rem', fontWeight: 'normal' }}>
                Join HealthZone and start your journey 🌿
              </p>
            </div>

            {/* ── Success state ── */}
            {success ? (
              <div className="msg-success" role="status">
                🎉 Account created! Redirecting to sign in…
              </div>
            ) : (
              <form onSubmit={handleSignUp} noValidate aria-label="Sign up form">
                <div className="space-y-4">

                  {/* Name */}
                  <div>
                    <label className="signup-label" htmlFor="name">Full Name</label>
                    <div className="field-wrap">
                      <FaUser className="field-icon" aria-hidden="true" />
                      <input
                        id="name"
                        className="signup-input"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        autoComplete="name"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="signup-label" htmlFor="email">Email Address</label>
                    <div className="field-wrap">
                      <FaEnvelope className="field-icon" aria-hidden="true" />
                      <input
                        id="email"
                        className="signup-input"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="signup-label" htmlFor="password">Password</label>
                    <div className="field-wrap">
                      <FaLock className="field-icon" aria-hidden="true" />
                      <input
                        id="password"
                        className="signup-input"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                        minLength={8}
                      />
                    </div>
                    <p
                      className="mt-1"
                      style={{ fontSize: '.8rem', color: 'var(--clr-muted, #7a6a5e)', fontWeight: 'normal' }}
                    >
                      Minimum 8 characters
                    </p>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="msg-error" role="alert">{error}</div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    className="signup-btn"
                    disabled={loading}
                    aria-busy={loading}
                  >
                    {loading ? (
                      <><div className="spinner" aria-hidden="true" /> Creating account…</>
                    ) : (
                      <>Register <FaArrowRight aria-hidden="true" className="text-sm" /></>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* ── Divider ── */}
            <div className="divider" aria-hidden="true">Or sign up with</div>

            {/* ── Social buttons ── */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => signIn("google", { callbackUrl: "/" })}
                className="social-btn"
                aria-label="Sign up with Google"
                type="button"
              >
                <FaGoogle aria-hidden="true" className="text-lg" />
                <span>Google</span>
              </button>
              <button
                onClick={() => signIn("github", { callbackUrl: "/" })}
                className="social-btn"
                aria-label="Sign up with GitHub"
                type="button"
              >
                <FaGithub aria-hidden="true" className="text-lg" />
                <span>GitHub</span>
              </button>
            </div>

            {/* ── Sign in link ── */}
            <p
              className="mt-6 text-center"
              style={{ fontSize: '.9rem', color: 'var(--clr-text-muted, #6b5c50)', fontWeight: 'normal' }}
            >
              Already have an account?{" "}
              <Link
                href="/signIn"
                style={{ color: 'var(--clr-accent, #c8956c)', fontWeight: 'normal' }}
                className="hover:underline"
              >
                Sign In
              </Link>
            </p>

          </div>
        </main>

        {/* ── Mini footer ── */}
        <footer
          className="text-center py-5 px-6"
          style={{
            borderTop:  '1px solid var(--clr-border, #ecddd0)',
            background: 'var(--clr-surface, #fff)',
            color:      'var(--clr-muted, #7a6a5e)',
            fontSize:   '.85rem',
            fontWeight: 'normal',
            position:   'relative',
            zIndex:     1,
          }}
        >
          © {new Date().getFullYear()} HealthZone. All rights reserved.
        </footer>
      </div>
    </>
  );
}