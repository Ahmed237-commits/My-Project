// app/admin/dashboard/page.tsx

import { getDashboardData } from "@/src/services/admin";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const data = await getDashboardData();

  return <DashboardClient initialData={data} />;
}