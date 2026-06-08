'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { FaBell } from 'react-icons/fa';

interface Notification { _id: string; read: boolean; }

export default function NotificationIcon({ email }: { email: string }) {
  const [hasUnread, setHasUnread] = useState(false);

  const checkUnread = useCallback(async () => {
    if (!email) return;
    try {
      const res  = await fetch(`http://localhost:8000/api/notifications?email=${email}`);
      if (!res.ok) return;
      const data: Notification[] = await res.json();
      setHasUnread(Array.isArray(data) && data.some(n => !n.read));
    } catch {}
  }, [email]);

  useEffect(() => {
    // 1. Check on mount
    checkUnread();

    // 2. Re-check every 30s (catches mark-read from notifications page)
    const interval = setInterval(checkUnread, 30_000);

    // 3. Re-check when user comes back to this tab/window
    const onFocus = () => checkUnread();
    window.addEventListener('focus', onFocus);

    // 4. Re-check when page becomes visible again (switching tabs)
    const onVisible = () => {
      if (document.visibilityState === 'visible') checkUnread();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [checkUnread]);

  return (
    <Link
      href="/notifications"
      className="topbar-btn relative"
      aria-label={hasUnread ? "Notifications — unread messages" : "Notifications"}
    >
      {hasUnread && (
        <>
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 z-10" aria-hidden="true" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-ping" aria-hidden="true" />
        </>
      )}
      <FaBell aria-hidden="true" />
    </Link>
  );
}
