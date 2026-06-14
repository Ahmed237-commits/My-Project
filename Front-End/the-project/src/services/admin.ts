// src/services/admin.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const ADMIN_EMAIL = "aethefifthofjuly@gmail.com";

export async function getDashboardData() {
  const headers = {
    'Content-Type': 'application/json',
    'x-admin-email': ADMIN_EMAIL,
  };

  try {
    const [statsRes, chartRes, usersRes] = await Promise.all([
      fetch(`${BASE_URL}/stats`, { headers, next: { revalidate: 60 } }),
      fetch(`${BASE_URL}/charts/activity`, { headers, cache: 'no-store' }),
      fetch(`${BASE_URL}/users`, { headers, cache: 'no-store' })
    ]);

    if (!statsRes.ok || !chartRes.ok || !usersRes.ok) {
      throw new Error("server Error");
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
    return {
      stats: { totalUsers: 0, totalScans: 0, totalBMIs: 0, totalLogins: 0 },
      chartData: [],
      usersList: [],
      error: error instanceof Error ? error.message : String(error)
    };
  }
}