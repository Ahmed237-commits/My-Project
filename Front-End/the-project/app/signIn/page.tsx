"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { FaGoogle, FaGithub, FaHeartbeat, FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";
import axios from "axios";
import { useState } from "react";

export default function SignInPage() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSignInWithCredentials = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }

    window.location.href = "/";
  } catch (err) {
    setError("Login failed.");
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <style>{`
        .signin-root {
          min-height:     100vh;
          display:        flex;
          flex-direction: column;
          background:     var(--clr-bg, #fdfaf6);
          position:       relative;
          overflow:       hidden;
        }
        .signin-root::before,
        .signin-root::after {
          content:        '';
          position:       absolute;
          border-radius:  50%;
          pointer-events: none;
          filter:         blur(80px);
          opacity:        .18;
        }
        .signin-root::before {
          width: 500px; height: 500px;
          top: -120px; right: -100px;
          background: var(--clr-accent, #c8956c);
        }
        .signin-root::after {
          width: 400px; height: 400px;
          bottom: -100px; left: -80px;
          background: var(--clr-accent, #c8956c);
        }

        .signin-card {
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

        .field-wrap { position: relative; }
        .field-icon {
          position:       absolute;
          left:           1rem;
          top:            50%;
          transform:      translateY(-50%);
          color:          var(--clr-muted, #7a6a5e);
          font-size:      .95rem;
          pointer-events: none;
        }

        .signin-input {
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
        .signin-input::placeholder {
          color:   var(--clr-muted, #7a6a5e);
          opacity: .7;
        }
        .signin-input:focus {
          border-color: var(--clr-accent, #c8956c);
          box-shadow:   0 0 0 3px rgba(200,149,108,.15);
        }

        .signin-label {
          display:       block;
          font-size:     .85rem;
          font-weight:   normal;
          color:         var(--clr-primary, #4a3b2f);
          margin-bottom: .4rem;
        }

        .signin-btn {
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
        .signin-btn:hover:not(:disabled) {
          background: var(--clr-accent-hov, #b5794e);
          transform:  translateY(-1px);
          box-shadow: 0 6px 20px rgba(200,149,108,.4);
        }
        .signin-btn:active:not(:disabled) { transform: translateY(0); }
        .signin-btn:disabled { opacity: .65; cursor: not-allowed; }
        .signin-btn:focus-visible {
          outline:        2.5px solid var(--clr-accent, #c8956c);
          outline-offset: 3px;
        }

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

      <div className="signin-root">
        <main
          className="flex-1 flex items-center justify-center px-5 py-14"
          style={{ position: 'relative', zIndex: 1 }}
        >
          <div className="signin-card">

            {/* ── Logo ── */}
            <div className="text-center mb-7">
              <div className="logo-badge" aria-hidden="true">
                <FaHeartbeat />
              </div>
              <h1
                className="text-3xl font-normal mb-1"
                style={{ color: 'var(--clr-primary, #4a3b2f)' }}
              >
                Welcome Back
              </h1>
              <p style={{ color: 'var(--clr-text-muted, #6b5c50)', fontSize: '.95rem', fontWeight: 'normal' }}>
                Sign in to continue your health journey 🌿
              </p>
            </div>

            {/* ── Form ── */}
            <form onSubmit={handleSignInWithCredentials} noValidate aria-label="Sign in form">
              <div className="space-y-4">

                {/* Email */}
                <div>
                  <label className="signin-label" htmlFor="email">Email Address</label>
                  <div className="field-wrap">
                    <FaEnvelope className="field-icon" aria-hidden="true" />
                    <input
                      id="email"
                      className="signin-input"
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
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="signin-label" style={{ margin: 0 }} htmlFor="password">
                      Password
                    </label>
                    <a
                      href="#"
                      style={{ fontSize: '.82rem', color: 'var(--clr-accent, #c8956c)', fontWeight: 'normal' }}
                      className="hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className="field-wrap">
                    <FaLock className="field-icon" aria-hidden="true" />
                    <input
                      id="password"
                      className="signin-input"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="msg-error" role="alert">{error}</div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  className="signin-btn"
                  disabled={loading}
                  aria-busy={loading}
                >
                  {loading ? (
                    <><div className="spinner" aria-hidden="true" /> Signing in…</>
                  ) : (
                    <>Sign In <FaArrowRight aria-hidden="true" className="text-sm" /></>
                  )}
                </button>
              </div>
            </form>

            {/* ── Divider ── */}
            <div className="divider" aria-hidden="true">Or continue with</div>

            {/* ── Social ── */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => signIn("google", { callbackUrl: "/" })}
                className="social-btn"
                aria-label="Sign in with Google"
                type="button"
              >
                <FaGoogle aria-hidden="true" className="text-lg" />
                <span>Google</span>
              </button>
              <button
                onClick={() => signIn("github", { callbackUrl: "/" })}
                className="social-btn"
                aria-label="Sign in with GitHub"
                type="button"
              >
                <FaGithub aria-hidden="true" className="text-lg" />
                <span>GitHub</span>
              </button>
            </div>

            {/* ── Sign up link ── */}
            <p
              className="mt-6 text-center"
              style={{ fontSize: '.9rem', color: 'var(--clr-text-muted, #6b5c50)', fontWeight: 'normal' }}
            >
              Don't have an account?{" "}
              <Link
                href="/signUp"
                style={{ color: 'var(--clr-accent, #c8956c)', fontWeight: 'normal' }}
                className="hover:underline"
              >
                Join Now
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