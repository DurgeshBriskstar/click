import AdminDashboard from "sections/dashboard/admin/dashboard";

export const metadata = {
  title: "Admin Dashboard | ClickITCo",
  description: "Monitor ClickITCo operations with at-a-glance metrics for orders, customers, revenue, and system health.",
  authors: [{
    name: "ClickITCo Team",
    url: "https://clickitco.com"
  }],
  keywords: ["ClickITCo admin", "dashboard", "analytics", "operations", "monitoring"]
};

export default async function DashboardPage() {

  return <AdminDashboard />;
}