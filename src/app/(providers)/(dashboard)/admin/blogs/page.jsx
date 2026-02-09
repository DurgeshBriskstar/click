import ListPage from "sections/dashboard/admin/blogs";

export const metadata = {
  title: "Blog Management - ClickITCo",
  description: "Manage blogs for ClickITCo customers and vendors.",
  authors: [{
    name: "ClickITCo Team",
    url: "https://clickitco.com"
  }],
  keywords: ["ClickITCo", "blogs", "content management", "admin"]
};

export default async function BlogsPage() {
  return <ListPage />;
}