import ListPage from "sections/dashboard/admin/services";

export const metadata = {
  title: "Services | ClickITCo Admin",
  description: "Create and manage ClickITCo service offerings, categories, and pricing from the admin console.",
  authors: [{
    name: "ClickITCo Team",
    url: "https://clickitco.com"
  }],
  keywords: ["ClickITCo admin", "services", "catalog", "pricing", "operations"]
};

export default async function ServicePage() {

  return <ListPage />;
}