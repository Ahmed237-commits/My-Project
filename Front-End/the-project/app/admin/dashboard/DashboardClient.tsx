// src/app/admin/dashboard/DashboardClient.jsx
'use client';

import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, Legend
} from 'recharts';
import { 
  Users, Scan, Scale, LogIn, ShieldAlert, TrendingUp, 
  TrendingDown, Activity, PieChartIcon, BarChart3, 
  Calendar, Globe, Mail, UserCheck, UserX, Clock,
  ArrowUpRight, ArrowDownRight, Filter, Download
} from 'lucide-react';

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

const COLORS = ['#4f46e5', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981'];

export default function DashboardClient({ initialData }: { initialData: InitialData }) {
  const { stats, chartData, usersList, error } = initialData;
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');
  const ADMIN_EMAIL = "aethefifthofjuly@gmail.com";

  // تحليلات إضافية
  const analytics = useMemo(() => {
    if (!usersList.length) return null;

    const totalUsers = usersList.length;
    const admins = usersList.filter(u => u.role === 'admin').length;
    const regularUsers = totalUsers - admins;
    
    // تحليل طرق التسجيل
    const providers = usersList.reduce((acc, user) => {
      acc[user.provider] = (acc[user.provider] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const providerData = Object.entries(providers).map(([name, value]) => ({
      name: name === 'google' ? 'Google' : name === 'github' ? 'GitHub' : 'Credentials',
      value,
      color: name === 'google' ? '#ea4335' : name === 'github' ? '#333' : '#4f46e5'
    }));

    // تحليل المستخدمين الجدد (آخر 7 أيام)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const newUsers = usersList.filter(u => new Date(u.createdAt) > sevenDaysAgo).length;
    const growthRate = totalUsers > 0 ? ((newUsers / totalUsers) * 100).toFixed(1) : '0';

    // تحليل النشاط
    const activeScans = stats.totalScans || 0;
    const avgScansPerUser = totalUsers > 0 ? (activeScans / totalUsers).toFixed(1) : '0';
    
    // معدل التحويل (BMI)
    const bmiRate = totalUsers > 0 ? ((stats.totalBMIs / totalUsers) * 100).toFixed(1) : '0';

    return {
      totalUsers,
      admins,
      regularUsers,
      providerData,
      newUsers,
      growthRate,
      activeScans,
      avgScansPerUser,
      bmiRate,
      adminPercentage: ((admins / totalUsers) * 100).toFixed(1),
    };
  }, [usersList, stats]);

  // تحليل شهري للنشاط
  const monthlyActivity = useMemo(() => {
    if (!usersList.length) return [];
    
    const months: Record<string, { name: string; users: number; scans: number }> = {};
    const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    
    usersList.forEach(user => {
      const date = new Date(user.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      if (!months[key]) {
        months[key] = { name: monthNames[date.getMonth()], users: 0, scans: 0 };
      }
      months[key].users++;
    });

    return Object.values(months).slice(-6); // آخر 6 شهور
  }, [usersList]);

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 text-center" dir="rtl">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md">
          <ShieldAlert className="h-20 w-20 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">خطأ في الصلاحيات أو الاتصال</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-500">
            <p className="mb-2">تأكد من:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>تشغيل سيرفر Express على المنفذ 8000</li>
              <li>تسجيل الدخول بحساب مسجل كـ admin</li>
              <li>صحة اتصال قاعدة البيانات</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8 font-sans" dir="rtl">
      {/* الهيدر الرئيسي */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
              <Activity className="h-8 w-8 text-indigo-600" />
              لوحة التحكم
            </h1>
            <p className="text-gray-500 mt-2">مرحباً بك في نظام إدارة Healthy Life المتكامل</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">متصل</span>
            </div>
            <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-sm font-medium border border-indigo-100">
              <Mail className="h-4 w-4 inline ml-1" />
              {ADMIN_EMAIL}
            </div>
          </div>
        </div>

        {/* فلتر الفترة الزمنية */}
        <div className="flex gap-2 bg-white p-1 rounded-xl shadow-sm border border-gray-200 w-fit">
          {[
            { key: 'week', label: 'آخر أسبوع', icon: Calendar },
            { key: 'month', label: 'آخر شهر', icon: Calendar },
            { key: 'year', label: 'آخر سنة', icon: Calendar },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setSelectedPeriod(key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                selectedPeriod === key 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* كروت الإحصائيات الرئيسية */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {[
          {
            title: 'إجمالي المشتركين',
            value: stats.totalUsers,
            icon: Users,
            color: 'blue',
            trend: analytics ? `+${analytics.newUsers} جديد` : '',
            trendUp: true,
          },
          {
            title: 'عمليات الفحص (AI)',
            value: stats.totalScans,
            icon: Scan,
            color: 'green',
            trend: analytics ? `${analytics.avgScansPerUser} لكل مستخدم` : '',
            trendUp: true,
          },
          {
            title: 'حسابات الـ BMI',
            value: stats.totalBMIs,
            icon: Scale,
            color: 'orange',
            trend: analytics ? `${analytics.bmiRate}% نسبة` : '',
            trendUp: true,
          },
          {
            title: 'تسجيلات الدخول',
            value: stats.totalLogins,
            icon: LogIn,
            color: 'purple',
            trend: 'نشط',
            trendUp: true,
          },
        ].map((card, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-${card.color}-50 text-${card.color}-600`}>
                <card.icon className="h-6 w-6" />
              </div>
              {card.trend && (
                <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                  {card.trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {card.trend}
                </span>
              )}
            </div>
            <p className="text-3xl md:text-4xl font-bold text-gray-800 mb-1">{card.value.toLocaleString()}</p>
            <p className="text-sm text-gray-500">{card.title}</p>
          </div>
        ))}
      </div>

      {/* قسم التحليلات المتقدمة */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* معدل النمو */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-bold text-gray-800">معدل النمو</h3>
            </div>
            <div className="text-4xl font-bold text-green-600 mb-2">{analytics.growthRate}%</div>
            <p className="text-sm text-gray-500">مستخدمين جدد هذا الأسبوع</p>
            <div className="mt-4 bg-green-50 rounded-lg p-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">مستخدمين جدد</span>
                <span className="font-bold text-green-700">{analytics.newUsers}</span>
              </div>
            </div>
          </div>

          {/* توزيع طرق التسجيل */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="h-6 w-6 text-indigo-600" />
              <h3 className="text-lg font-bold text-gray-800">طرق التسجيل</h3>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.providerData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {analytics.providerData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* إحصائيات المستخدمين */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="h-6 w-6 text-purple-600" />
              <h3 className="text-lg font-bold text-gray-800">توزيع المستخدمين</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">مشرفين</span>
                <span className="font-bold text-indigo-600">{analytics.admins}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full" 
                  style={{ width: `${analytics.adminPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">مستخدمين عاديين</span>
                <span className="font-bold text-green-600">{analytics.regularUsers}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${100 - parseFloat(analytics.adminPercentage)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* رسم النشاط اليومي */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">نشاط تسجيل الدخول</h3>
              <p className="text-sm text-gray-500">آخر 7 أيام</p>
            </div>
            <BarChart3 className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="h-80">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorLogins" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="logins" 
                    name="تسجيلات الدخول" 
                    stroke="#4f46e5" 
                    strokeWidth={2}
                    fill="url(#colorLogins)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                لا توجد بيانات كافية
              </div>
            )}
          </div>
        </div>

        {/* رسم النشاط الشهري */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">المستخدمين الجدد شهرياً</h3>
              <p className="text-sm text-gray-500">آخر 6 أشهر</p>
            </div>
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <div className="h-80">
            {monthlyActivity.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px'
                    }}
                  />
                  <Bar dataKey="users" name="مستخدمين جدد" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                لا توجد بيانات كافية
              </div>
            )}
          </div>
        </div>
      </div>

      {/* جدول المستخدمين المحسن */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">قائمة المستخدمين</h2>
            <p className="text-sm text-gray-500 mt-1">إجمالي {usersList.length} مستخدم مسجل</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm font-medium text-gray-600 transition">
              <Filter className="h-4 w-4" />
              تصفية
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 rounded-xl text-sm font-medium text-indigo-600 transition">
              <Download className="h-4 w-4" />
              تصدير
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-50 text-sm font-semibold text-gray-600">
                <th className="p-4">#</th>
                <th className="p-4">المستخدم</th>
                <th className="p-4">البريد الإلكتروني</th>
                <th className="p-4">طريقة التسجيل</th>
                <th className="p-4">الصلاحية</th>
                <th className="p-4">تاريخ التسجيل</th>
                <th className="p-4">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {usersList.map((user, index) => (
                <tr key={user._id} className="hover:bg-gray-50/50 transition group">
                  <td className="p-4 text-gray-400 text-sm">{index + 1}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${
                        user.provider === 'google' ? 'bg-red-500' : 
                        user.provider === 'github' ? 'bg-gray-800' : 'bg-indigo-500'
                      }`}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-400">{user._id.slice(-6)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{user.email}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium ${
                      user.provider === 'google' 
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : user.provider === 'github'
                        ? 'bg-gray-100 text-gray-700 border border-gray-200'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}>
                      <Globe className="h-3 w-3" />
                      {user.provider === 'google' ? 'Google' : 
                       user.provider === 'github' ? 'GitHub' : 'بريد إلكتروني'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold ${
                      user.role === 'admin' 
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                        : 'bg-green-50 text-green-700 border border-green-200'
                    }`}>
                      {user.role === 'admin' ? '👑 مشرف' : '👤 مستخدم'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(user.createdAt).toLocaleDateString('ar-EG', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600 font-medium">نشط</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {usersList.length === 0 && (
          <div className="p-12 text-center text-gray-400">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>لا يوجد مستخدمين مسجلين حالياً</p>
          </div>
        )}
      </div>

      {/* فوتر */}
      <div className="mt-8 text-center text-sm text-gray-400">
        <p>Healthy Life Admin Dashboard © {new Date().getFullYear()} | تم التطوير بواسطة فريق Healthy Life</p>
      </div>
    </div>
  );
}