import StoreDashboard from "sections/dashboard/store/dashboard";

export const metadata = {
  title: "Store Admin Dashboard | ClickITCo",
  description: "Monitor your store operations with at-a-glance metrics for inquiries, appointments, and store performance.",
  authors: [{
    name: "ClickITCo Team",
    url: "https://clickitco.com"
  }],
  keywords: ["ClickITCo store admin", "dashboard", "analytics", "store operations", "monitoring"]
};

export default async function DashboardPage() {
  return <StoreDashboard />;
}