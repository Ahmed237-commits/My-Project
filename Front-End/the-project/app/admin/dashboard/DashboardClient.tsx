// src/app/admin/dashboard/DashboardClient.jsx
'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Scan, Scale, LogIn, ShieldAlert } from 'lucide-react';

type Stats = {
  totalUsers: number;
  totalScans: number;
  totalBMIs: number;
  totalLogins: number;
};

type ChartPoint = {
  date: string;
  logins: number;
};

type User = {
  _id: string;
  name: string;
  email: string;
  provider: string;
  role: string;
  createdAt: string;
};

type InitialData = {
  stats: Stats;
  chartData: ChartPoint[];
  usersList: User[];
  error?: string | null;
};

export default function DashboardClient({ initialData }: { initialData: InitialData }) {
  const { stats, chartData, usersList, error } = initialData;
  const ADMIN_EMAIL = "aethefifthofjuly@gmail.com";

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center" dir="rtl">
        <ShieldAlert className="h-16 w-16 text-red-500 mb-2" />
        <h2 className="text-2xl font-bold text-gray-800 mb-1">خطأ في الصلاحيات أو الاتصال</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <p className="text-sm text-gray-400">تأكد من تشغيل سيرفر الـ Express وأن حسابك مُسجل كـ admin.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans" dir="rtl">
      {/* الهيدر الرئيسي */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">لوحة تحكم Healthy Life 📊</h1>
          <p className="text-sm text-gray-500 mt-1">إحصائيات وتحليلات فورية مدعومة بـ Next.js و Express.</p>
        </div>
        <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium border border-indigo-100 align-middle">
          حساب الأدمن: <span className="font-bold">{ADMIN_EMAIL}</span>
        </div>
      </div>

      {/* كروت الإحصائيات (Stats Cards) */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">إجمالي المشتركين</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalUsers}</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users className="h-6 w-6" /></div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">عمليات الفحص (AI)</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalScans}</p>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-xl"><Scan className="h-6 w-6" /></div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">حسابات الـ BMI</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalBMIs}</p>
          </div>
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><Scale className="h-6 w-6" /></div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">تفاعلات الدخول</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalLogins}</p>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><LogIn className="h-6 w-6" /></div>
        </div>
      </div>

      {/* قسم الرسم البياني */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">معدل نشاط المستخدمين (آخر 7 أيام)</h2>
        <div className="h-80 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="logins" name="تسجيلات الدخول" stroke="#4f46e5" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">لا توجد بيانات كافية لعرض الرسم البياني حالياً.</div>
          )}
        </div>
      </div>

      {/* جدول إدارة المستخدمين */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">قائمة المستخدمين المسجلين</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-50 text-sm font-semibold text-gray-500 border-b border-gray-100">
                <th className="p-4">الاسم</th>
                <th className="p-4">البريد الإلكتروني</th>
                <th className="p-4">طريقة التسجيل</th>
                <th className="p-4">الصلاحية</th>
                <th className="p-4">تاريخ الإنشاء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm text-gray-600">
              {usersList.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50/70 transition">
                  <td className="p-4 font-medium text-gray-900">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${user.provider === 'google' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                      {user.provider}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-green-50 text-green-700'}`}>
                      {user.role === 'admin' ? 'أدمن' : 'مستخدم'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}