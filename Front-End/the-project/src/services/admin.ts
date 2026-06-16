// src/services/admin.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/nextAuth";

const BASE_URL = "http://localhost:8000";

const ALLOWED_ADMIN_EMAILS = [
  "aethefifthofjuly@gmail.com",
];

export async function getDashboardData() {
  const session = await getServerSession(authOptions);
  
  console.log("🔍 Checking access for:", session?.user?.email);
  
  // ✅ أول تحقق: هل الإيميل موجود في القائمة؟
  if (!session?.user?.email || !ALLOWED_ADMIN_EMAILS.includes(session.user.email)) {
    console.log("❌ Email not in allowed list:", session?.user?.email);
    return {
      stats: { totalUsers: 0, totalScans: 0, totalBMIs: 0, totalLogins: 0 },
      chartData: [],
      usersList: [],
      error: "غير مصرح لك بالدخول إلى لوحة التحكم. هذا الحساب ليس لديه صلاحيات الأدمن."
    };
  }
  
  // ✅ ثاني تحقق: هل معاه backendToken؟
  if (!session?.backendToken) {
    console.log("❌ No backend token");
    return {
      stats: { totalUsers: 0, totalScans: 0, totalBMIs: 0, totalLogins: 0 },
      chartData: [],
      usersList: [],
      error: "انتهت جلستك. الرجاء إعادة تسجيل الدخول."
    };
  }

  // ✅ ثالث تحقق: هل role = admin؟
  if (session.user.role !== 'admin') {
    console.log("❌ Not admin role:", session.user.role);
    return {
      stats: { totalUsers: 0, totalScans: 0, totalBMIs: 0, totalLogins: 0 },
      chartData: [],
      usersList: [],
      error: "غير مصرح لك بالدخول. يجب أن تكون أدمن."
    };
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.backendToken}`,
  };

  try {
    const [statsRes, chartRes, usersRes] = await Promise.all([
      fetch(`${BASE_URL}/api/admin/stats`, { headers, cache: 'no-store' }),
      fetch(`${BASE_URL}/api/admin/charts/activity`, { headers, cache: 'no-store' }),
      fetch(`${BASE_URL}/api/admin/users`, { headers, cache: 'no-store' })
    ]);

    if (statsRes.status === 401 || statsRes.status === 403) {
      const errData = await statsRes.json();
      return {
        stats: { totalUsers: 0, totalScans: 0, totalBMIs: 0, totalLogins: 0 },
        chartData: [],
        usersList: [],
        error: errData.message || "غير مصرح"
      };
    }

    if (!statsRes.ok || !chartRes.ok || !usersRes.ok) {
      throw new Error(`Server Error: ${statsRes.status}`);
    }

    const [statsData, chartData, usersData] = await Promise.all([
      statsRes.json(),
      chartRes.json(),
      usersRes.json()
    ]);

    return {
      stats: statsData.data,
      chartData: chartData.data,
      usersList: usersData.users,
      error: null
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      stats: { totalUsers: 0, totalScans: 0, totalBMIs: 0, totalLogins: 0 },
      chartData: [],
      usersList: [],
      error: error instanceof Error ? error.message : "خطأ في الاتصال"
    };
  }
}