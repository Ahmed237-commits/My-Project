// app/admin/dashboard/page.tsx

import { getDashboardData } from "@/src/services/admin"; 

export default async function DashboardPage() {
  const data = await getDashboardData(); 

  if (data.error) {
    return <div className="text-red-500">حدث خطأ: {data.error}</div>;
  }

  return (
    <div className="p-6">
      <h1>لوحة تحكم الأدمن 📊</h1>
      
      <div className="grid grid-cols-4 gap-4 my-4">
        <div className="p-4 bg-white shadow rounded">المستخدمين: {data.stats.totalUsers}</div>
        <div className="p-4 bg-white shadow rounded">الفحوصات: {data.stats.totalScans}</div>
        <div className="p-4 bg-white shadow rounded">مؤشرات الـ BMI: {data.stats.totalBMIs}</div>
        <div className="p-4 bg-white shadow rounded">تسجيلات الدخول: {data.stats.totalLogins}</div>
      </div>

      {/* هنا يمكنك تمرير الـ data.usersList أو data.chartData للمكونات الأخرى */}
    </div>
  );
}