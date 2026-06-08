'use client';

// 1. تم إضافة useEffect هنا
import React, { useRef, useState, useEffect } from "react"; 
import Image from "next/image";
import Link from "next/link";
import { useSession } from 'next-auth/react';
import { useTheme } from "../../context/ThemeContext";
// 2. تم إضافة استيراد axios
import axios from "axios"; 
import {
  FaArrowLeft, FaEnvelope, FaIdBadge,
  FaSun, FaMoon, FaBell, FaShieldAlt,
  FaChevronRight, FaPen, FaCheck,
} from "react-icons/fa";

const ProfilePage = () => {
  const { data: session }      = useSession();
  const { theme, toggleTheme } = useTheme();
  const inputRef               = useRef<HTMLInputElement>(null);
  
  const [bio, setBio]          = useState("");
  const [editing, setEditing]  = useState(false);
  // 3. تم إضافة حالة الـ loading التي كانت ناقصة في الكود الخاص بك
  const [loading, setLoading]  = useState(false); 

  const isDark = theme === "dark";

  const user = {
    name:   session?.user?.name  ?? "Ahmed Hassan",
    email:  session?.user?.email ?? "ahmed@example.com",
    avatar: session?.user?.image ?? "/student-avatar.jpg",
    id:     (session?.user as any)?.id ?? "—",
  };

  // 4. تم إصلاح مصفوفة التبعيات لتعتمد مباشرة على القيمة النصية للايميل القادم من الـ session منعاً للـ Infinite Loop
  const sessionEmail = session?.user?.email;

  useEffect(() => {
    const loadBio = async () => {
      if (!sessionEmail) return;

      try {
        const res = await axios.get(
          `http://localhost:8000/api/user/bio`,
          { params: { email: sessionEmail } }
        );

        if (res.data?.bio) {
          setBio(res.data.bio);
        }
      } catch (err) {
        console.log("No bio found or error loading bio");
      }
    };

    loadBio();
  }, [sessionEmail]);

  // =========================
  // SAVE BIO
  // =========================
  const handleSaveBio = async () => {
    if (!user.email) return;
    
    try {
      setLoading(true);

      await axios.post("http://localhost:8000/api/user/bio", {
        email: user.email,
        bio,
      });

      setEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save bio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .profile-root {
          min-height: 100vh;
          background: var(--clr-bg, #fdfaf6);
          padding: 2.5rem 1.5rem 5rem;
        }

        /* ── back link ── */
        .profile-back {
          display: inline-flex; align-items: center; gap: .45rem;
          font-size: .95rem; font-weight: normal;
          color: var(--clr-accent, #c8956c); text-decoration: none;
          padding: .35rem .7rem; border-radius: .5rem;
          transition: background 180ms, transform 180ms;
          margin-bottom: 1.75rem;
        }
        .profile-back:hover { background: var(--clr-accent-soft, #f5e6d8); transform: translateX(-3px); }
        .profile-back:focus-visible { outline: 2px solid var(--clr-accent, #c8956c); outline-offset: 3px; border-radius: .5rem; }

        /* ── card ── */
        .profile-card {
          background: var(--clr-surface, #fff);
          border: 1.5px solid var(--clr-border, #ecddd0);
          border-radius: 1.5rem;
          box-shadow: 0 8px 32px rgba(74,59,47,.08);
          overflow: hidden;
          max-width: 600px; width: 100%; margin: 0 auto;
        }

        /* ── hero banner ── */
        .profile-banner {
          height: 100px;
          background: linear-gradient(135deg, var(--clr-accent-soft, #f5e6d8) 0%, var(--clr-bg, #fdfaf6) 100%);
          position: relative;
        }
        .profile-avatar-wrap {
          position: absolute; bottom: -40px; left: 50%;
          transform: translateX(-50%);
          width: 80px; height: 80px; border-radius: 50%;
          border: 3px solid var(--clr-surface, #fff);
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(74,59,47,.15);
        }

        /* ── body ── */
        .profile-body { padding: 3rem 2rem 2rem; }

        /* ── info row ── */
        .info-row {
          display: flex; align-items: center; gap: .6rem;
          padding: .5rem 0;
          font-size: 1rem; font-weight: normal;
          color: var(--clr-text-muted, #6b5c50);
          border-bottom: 1px solid var(--clr-border, #ecddd0);
        }
        .info-row:last-of-type { border-bottom: none; }
        .info-icon {
          width: 34px; height: 34px; border-radius: .5rem; flex-shrink: 0;
          background: var(--clr-accent-soft, #f5e6d8);
          display: flex; align-items: center; justify-content: center;
          color: var(--clr-accent, #c8956c); font-size: .9rem;
        }

        /* ── bio ── */
        .bio-input {
          width: 100%; padding: .65rem .9rem;
          border-radius: .75rem;
          border: 1.5px solid var(--clr-border, #ecddd0);
          background: var(--clr-bg, #fdfaf6);
          color: var(--clr-text, #2d1f14);
          font-size: 1rem; font-weight: normal;
          outline: none; resize: none; font-family: inherit;
          transition: border-color 200ms;
          box-sizing: border-box;
        }
        .bio-input:focus { border-color: var(--clr-accent, #c8956c); box-shadow: 0 0 0 3px rgba(200,149,108,.12); }
        .bio-input::placeholder { color: var(--clr-muted, #7a6a5e); opacity: .7; }

        .bio-save-btn {
          display: inline-flex; align-items: center; gap: .4rem;
          padding: .45rem .9rem; border-radius: .625rem; border: none;
          background: var(--clr-accent, #c8956c); color: #fff;
          font-size: .82rem; font-weight: normal; cursor: pointer;
          transition: background 180ms;
        }
        .bio-save-btn:hover { background: var(--clr-accent-hov, #b5794e); }
        .bio-save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        
        .bio-edit-btn {
          display: inline-flex; align-items: center; gap: .4rem;
          padding: .4rem .8rem; border-radius: .625rem;
          border: 1.5px solid var(--clr-border, #ecddd0);
          background: transparent; color: var(--clr-text-muted, #6b5c50);
          font-size: .82rem; font-weight: normal; cursor: pointer;
          transition: background 180ms, border-color 180ms;
        }
        .bio-edit-btn:hover { background: var(--clr-accent-soft, #f5e6d8); border-color: var(--clr-accent, #c8956c); }

        /* ── section heading ── */
        .section-heading {
          font-size: .875rem; font-weight: normal;
          text-transform: uppercase; letter-spacing: .07em;
          color: var(--clr-muted, #7a6a5e);
          margin: 1.75rem 0 .75rem;
        }

        /* ── setting row ── */
        .setting-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1rem 1.1rem; border-radius: .875rem;
          background: var(--clr-bg, #fdfaf6);
          border: 1.5px solid var(--clr-border, #ecddd0);
          margin-bottom: .6rem;
          transition: box-shadow 180ms, border-color 180ms;
          text-decoration: none;
          cursor: default;
        }
        .setting-row:is(a):hover, .setting-row.clickable:hover {
          box-shadow: 0 4px 14px rgba(74,59,47,.08);
          border-color: var(--clr-accent, #c8956c);
        }
        .setting-row:focus-visible { outline: 2px solid var(--clr-accent, #c8956c); outline-offset: 2px; border-radius: .875rem; }

        .setting-icon {
          width: 38px; height: 38px; border-radius: .6rem; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem;
        }

        /* ── toggle ── */
        .toggle-track {
          width: 44px; height: 24px; border-radius: 9999px;
          background: var(--clr-border, #ecddd0);
          position: relative; transition: background 200ms;
          cursor: pointer; border: none; flex-shrink: 0;
        }
        .toggle-track.on { background: var(--clr-accent, #c8956c); }
        .toggle-thumb {
          position: absolute; top: 3px; left: 3px;
          width: 18px; height: 18px; border-radius: 50%;
          background: #fff; transition: transform 200ms;
          box-shadow: 0 1px 4px rgba(0,0,0,.15);
        }
        .toggle-track.on .toggle-thumb { transform: translateX(20px); }

        /* ── coming soon badge ── */
        .coming-soon {
          font-size: .72rem; font-weight: normal;
          padding: .2rem .6rem; border-radius: 9999px;
          background: var(--clr-accent-soft, #f5e6d8);
          color: var(--clr-accent, #c8956c);
        }
      `}</style>

      <div className="profile-root">
        {/* ── Back ── */}
        <Link href="/dashBoard" className="profile-back" aria-label="Back to Dashboard">
          <FaArrowLeft aria-hidden="true" className="text-xs" />
          Back to Dashboard
        </Link>

        <div className="profile-card">

          {/* ── Banner + Avatar ── */}
          <div className="profile-banner" aria-hidden="true">
            <div className="profile-avatar-wrap">
              <Image
                src={user.avatar}
                alt={`${user.name}'s profile picture`}
                width={80} height={80}
                className="object-cover w-full h-full"
                unoptimized
              />
            </div>
          </div>

          <div className="profile-body">

            {/* ── Name + role badge ── */}
            <div className="text-center mb-5">
              <h1 className="text-2xl font-normal mb-1" style={{ color: "var(--clr-primary, #4a3b2f)" }}>
                {user.name}
              </h1>
              <span
                className="inline-block text-sm font-normal px-3 py-1 rounded-full"
                style={{ background: "var(--clr-accent-soft, #f5e6d8)", color: "var(--clr-accent, #c8956c)" }}
              >
                Member
              </span>
            </div>

            {/* ── Info rows ── */}
            <div
              className="rounded-xl overflow-hidden mb-5"
              style={{ border: "1.5px solid var(--clr-border, #ecddd0)" }}
            >
              {[
                { icon: <FaEnvelope aria-hidden="true" />, label: "Email",   value: user.email },
                { icon: <FaIdBadge  aria-hidden="true" />, label: "User ID",  value: user.id },
              ].map(row => (
                <div key={row.label} className="info-row px-4">
                  <div className="info-icon">{row.icon}</div>
                  <span style={{ color: "var(--clr-muted, #7a6a5e)", fontSize: ".85rem", minWidth: 60 }}>
                    {row.label}
                  </span>
                  <span className="flex-1 text-right" style={{ color: "var(--clr-primary, #4a3b2f)", fontSize: "1rem" }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {/* ── Bio ── */}
            <div className="mb-1">
              <div className="flex items-center justify-between mb-2">
                <p className="section-heading" style={{ margin: 0 }}>Bio</p>
                {!editing ? (
                  <button
                    className="bio-edit-btn"
                    onClick={() => { setEditing(true); setTimeout(() => inputRef.current?.focus(), 50); }}
                    aria-label="Edit bio"
                  >
                    <FaPen aria-hidden="true" className="text-xs" /> Edit
                  </button>
                ) : (
                  <button 
                    className="bio-save-btn" 
                    onClick={handleSaveBio} 
                    disabled={loading} 
                    aria-label="Save bio"
                  >
                    <FaCheck aria-hidden="true" className="text-xs" /> 
                    {loading ? "Saving..." : "Save"}
                  </button>
                )}
              </div>

              {editing ? (
                <textarea
                  ref={inputRef as any}
                  rows={3}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  className="bio-input"
                  placeholder="Write something about yourself…"
                  aria-label="Edit your bio"
                  disabled={loading}
                />
              ) : (
                <p
                  className="text-base font-normal leading-relaxed mb-5"
                  style={{ color: bio ? "var(--clr-text-muted, #6b5c50)" : "var(--clr-muted, #7a6a5e)", fontStyle: bio ? "normal" : "italic" }}
                >
                  {bio || "You don't have a bio yet. Click Edit to add one."}
                </p>
              )}
            </div>

            {/* ── Settings ── */}
            <p className="section-heading">Settings</p>

            {/* Theme toggle */}
            <div className="setting-row">
              <div className="flex items-center gap-3">
                <div
                  className="setting-icon"
                  style={{ background: isDark ? "rgba(250,200,80,.15)" : "rgba(250,200,80,.15)", color: "#d4a017" }}
                  aria-hidden="true"
                >
                  {isDark ? <FaSun /> : <FaMoon />}
                </div>
                <div>
                  <p className="text-base font-normal" style={{ color: "var(--clr-primary, #4a3b2f)" }}>Appearance</p>
                  <p className="text-xs font-normal" style={{ color: "var(--clr-muted, #7a6a5e)" }}>
                    {isDark ? "Dark mode" : "Light mode"}
                  </p>
                </div>
              </div>
              <button
                className={`toggle-track ${isDark ? "on" : ""}`}
                onClick={toggleTheme}
                role="switch"
                aria-checked={isDark}
                aria-label="Toggle dark mode"
              >
                <span className="toggle-thumb" />
              </button>
            </div>

            {/* Notifications — coming soon */}
            <div className="setting-row" style={{ opacity: .7 }}>
              <div className="flex items-center gap-3">
                <div className="setting-icon" style={{ background: "rgba(90,131,200,.12)", color: "#5a83c8" }} aria-hidden="true">
                  <FaBell />
                </div>
                <div>
                  <p className="text-base font-normal" style={{ color: "var(--clr-primary, #4a3b2f)" }}>Notifications</p>
                  <p className="text-sm font-normal" style={{ color: "var(--clr-muted, #7a6a5e)" }}>Manage your alerts</p>
                </div>
              </div>
              <span className="coming-soon">Coming soon</span>
            </div>

            {/* Privacy */}
            <Link href="/privacy" className="setting-row" style={{ display: "flex" }}>
              <div className="flex items-center gap-3">
                <div className="setting-icon" style={{ background: "rgba(90,158,111,.12)", color: "#5a9e6f" }} aria-hidden="true">
                  <FaShieldAlt />
                </div>
                <div>
                  <p className="text-base font-normal" style={{ color: "var(--clr-primary, #4a3b2f)" }}>Privacy Policy</p>
                  <p className="text-sm font-normal" style={{ color: "var(--clr-muted, #7a6a5e)" }}>Read our privacy terms</p>
                </div>
              </div>
              <FaChevronRight className="text-xs" style={{ color: "var(--clr-muted, #7a6a5e)" }} aria-hidden="true" />
            </Link>

          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;