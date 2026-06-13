// src/app/admin/dashboard/page.jsx
import React from 'react';
import { getDashboardData } from '../../services/page';
import DashboardClient from './DashboardClient'; // هنكتبها تحت حالاً

export const metadata = {
  title: 'لوحة التحكم | Healthy Life',
};

export default async function AdminDashboardPage() {
  // جلب البيانات مباشرة على السيرفر قبل ما الصفحة تروح للمتصفح ⚡
  const data = await getDashboardData();

  return <DashboardClient initialData={data} />;
}