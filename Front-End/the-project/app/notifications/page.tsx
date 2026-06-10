'use client';

import { useEffect, useState, useCallback } from 'react';
import { FaBell, FaArrowLeft, FaCheck, FaCircle } from 'react-icons/fa';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
interface Notification {
  _id: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const {data : session , status} = useSession();
const email = session?.user?.email  
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const fetchData = useCallback(async (signal?: AbortSignal) => {
    if (!email) return;

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE_URL}/api/notifications?email=${encodeURIComponent(email)}`, {
        signal, 
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      console.error("Fetch error:", err);
      setError("Could not load notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [email, API_BASE_URL]);

  const markAllReadSilently = useCallback(async () => {
    if (!email) return;

    try {
      await fetch(`${API_BASE_URL}/api/notifications/mark-read`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
    }
  }, [email, API_BASE_URL]);

  useEffect(() => {
    if (!email) {
      setLoading(false);  
      return;
    }
    const abortController = new AbortController();

    fetchData(abortController.signal).then(() => {
      markAllReadSilently();
    });

    return () => {
      abortController.abort();
    };
  }, [email, fetchData, markAllReadSilently]);

  const unreadCount = notifications.filter(n => !n.read).length;
console.log({
  email,
  loading,
  error,
});
  return (
    <>
      <style jsx>{`
        .notif-root { min-height: 100vh; background: var(--clr-bg, #fdfaf6); padding: 2.5rem 1.5rem 5rem; }
        .notif-back { display: inline-flex; align-items: center; gap: .45rem; font-size: .875rem; color: var(--clr-accent, #c8956c); text-decoration: none; padding: .35rem .7rem; border-radius: .5rem; transition: background 180ms, transform 180ms; margin-bottom: 1.75rem; }
        .notif-back:hover { background: var(--clr-accent-soft, #f5e6d8); transform: translateX(-3px); }
        .notif-header { display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 2rem; }
        .notif-badge { width: 52px; height: 52px; border-radius: 50%; flex-shrink: 0; background: var(--clr-accent-soft, #f5e6d8); display: flex; align-items: center; justify-content: center; color: var(--clr-accent, #c8956c); font-size: 1.3rem; }
        .notif-divider { width: 2.5rem; height: 3px; border-radius: 9px; background: var(--clr-accent, #c8956c); margin: .5rem 0 0; }
        .unread-pill { display: inline-flex; align-items: center; gap: .35rem; padding: .25rem .75rem; border-radius: 9999px; background: var(--clr-accent, #c8956c); color: #fff; font-size: .78rem; }
        .notif-card { background: var(--clr-surface, #fff); border: 1.5px solid var(--clr-border, #ecddd0); border-radius: 1.1rem; padding: 1.1rem 1.25rem; display: flex; align-items: flex-start; gap: .85rem; transition: box-shadow 200ms, border-color 200ms; }
        .notif-card:hover { box-shadow: 0 6px 20px rgba(74,59,47,.08); border-color: var(--clr-accent, #c8956c); }
        .notif-card.unread { background: var(--clr-accent-soft, #f5e6d8); border-color: rgba(200,149,108,.5); }
        .notif-dot-wrap { margin-top: .2rem; flex-shrink: 0; }
        .notif-dot-unread { color: var(--clr-accent, #c8956c); font-size: .55rem; }
        .notif-dot-read   { color: var(--clr-border, #ecddd0);  font-size: .55rem; }
        .skeleton { background: linear-gradient(90deg, var(--clr-border, #ecddd0) 25%, rgba(236,221,208,.5) 50%, var(--clr-border, #ecddd0) 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: .75rem; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .notif-state-card { background: var(--clr-surface, #fff); border: 1.5px solid var(--clr-border, #ecddd0); border-radius: 1.25rem; padding: 3rem 2rem; text-align: center; }
        .notif-state-emoji { font-size: 2.5rem; margin-bottom: .75rem; }
      `}</style>

      <div className="notif-root">
        <div className="max-w-2xl mx-auto">

          <Link href="/dashBoard" className="notif-back">
            <FaArrowLeft className="text-xs" />
            Back to Dashboard
          </Link>

          <div className="notif-header">
            <div className="notif-badge"><FaBell /></div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-normal" style={{ color: "var(--clr-primary, #4a3b2f)" }}>
                  Notifications
                </h1>
                {unreadCount > 0 && (
                  <span className="unread-pill">
                    <FaCircle className="text-[6px]" />
                    {unreadCount} unread
                  </span>
                )}
              </div>
              <div className="notif-divider" />
              <p className="text-sm font-normal mt-2" style={{ color: "var(--clr-text-muted, #6b5c50)" }}>
                Stay up to date with your health activity.
              </p>
            </div>
          </div>

          {/* حالة التحميل */}
          {loading && !error && (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 76 }} />)}
            </div>
          )}

          {/* حالة الخطأ */}
          {!loading && error && (
            <div className="notif-state-card">
              <div className="notif-state-emoji">⚠️</div>
              <p className="font-normal text-base" style={{ color: "var(--clr-primary, #4a3b2f)" }}>{error}</p>
              <button 
                onClick={() => fetchData()} 
                className="mt-3 text-sm underline" 
                style={{ color: "var(--clr-accent, #c8956c)" }}
              >
                Try Again
              </button>
            </div>
          )}

          {/* الإيميل غير متوفر بعد */}
          {!email && !loading && !error  && (
            <div className="notif-state-card">
              <p className="font-normal text-base text-gray-500">Loading user session...</p>
            </div>
          )}

          {/* لا يوجد إشعارات */}
          {email && !loading && !error && notifications.length === 0 && (
            <div className="notif-state-card">
              <div className="notif-state-emoji">🔔</div>
              <p className="font-normal text-base" style={{ color: "var(--clr-primary, #4a3b2f)" }}>No notifications yet</p>
              <p className="text-sm font-normal mt-1" style={{ color: "var(--clr-text-muted, #6b5c50)" }}>
                We'll let you know when something happens.
              </p>
            </div>
          )}

          {/* عرض الإشعارات */}
          {email && !loading && !error && notifications.length > 0 && (
            <ul className="space-y-3">
              {notifications.map(n => (
                <li key={n._id}>
                  <div className={`notif-card ${!n.read ? "unread" : ""}`}>
                    <div className="notif-dot-wrap">
                      {n.read ? <FaCheck className="notif-dot-read" /> : <FaCircle className="notif-dot-unread" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-normal leading-relaxed" style={{ color: "var(--clr-primary, #4a3b2f)" }}>
                        {n.message}
                      </p>
                      <time className="text-xs font-normal mt-1 block" style={{ color: "var(--clr-muted, #7a6a5e)" }}>
                        {new Date(n.createdAt).toLocaleString("en-US", {
                          month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                        })}
                      </time>
                    </div>
                    {!n.read && <span className="text-xs font-normal flex-shrink-0" style={{ color: "var(--clr-accent, #c8956c)" }}>New</span>}
                  </div>
                </li>
              ))}
            </ul>
          )}

        </div>
      </div>
    </>
  );
}