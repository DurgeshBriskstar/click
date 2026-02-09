import ListPage from "sections/dashboard/admin/cms/pages";

export const metadata = {
  title: "Page Management | ClickITCo CMS",
  description: "Create and edit marketing and help pages for the ClickITCo storefront from the CMS dashboard.",
  authors: [{
    name: "ClickITCo Team",
    url: "https://clickitco.com"
  }],
  keywords: ["ClickITCo", "cms", "page builder", "content", "marketing pages"]
};

export default async function Pages() {

  return <ListPage />;
}