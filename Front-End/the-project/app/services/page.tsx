// src/services/admin.js

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const ADMIN_EMAIL = "aethefifthofjuly@gmail.com"; // إيميلك اللي واخد رول أدمن في الداتابيز

export async function getDashboardData() {
  const headers = {
    'Content-Type': 'application/json',
    'x-admin-email': ADMIN_EMAIL,
  };

  try {
    // جلب كل البيانات بالتوازي (Parallel Fetching) عشان السرعة ⚡
    const [statsRes, chartRes, usersRes] = await Promise.all([
      fetch(`${BASE_URL}/stats`, { headers, next: { revalidate: 60 } }), // كاش لمدة دقيقة
      fetch(`${BASE_URL}/charts/activity`, { headers, cache: 'no-store' }), // بيانات متجددة علطول
      fetch(`${BASE_URL}/users`, { headers, cache: 'no-store' })
    ]);

    if (!statsRes.ok || !chartRes.ok || !usersRes.ok) {
      throw new Error("فشل في جلب البيانات من السيرفر، تأكد من صلاحية الأدمن.");
    }

    const stats = await statsRes.json();
    const chart = await chartRes.json();
    const users = await usersRes.json();

    return {
      stats: stats.data,
      chartData: chart.data,
      usersList: users.users,
      error: null
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      stats: { totalUsers: 0, totalScans: 0, totalBMIs: 0, totalLogins: 0 },
      chartData: [],
      usersList: [],
      error: errorMessage
    };
  }
}