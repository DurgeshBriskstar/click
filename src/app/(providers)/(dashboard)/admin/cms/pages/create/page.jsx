import FormPage from "sections/dashboard/admin/cms/pages/FormPage";

export const metadata = {
  title: "Create Page - ClickITCo Admin",
  description: "Create a new CMS page for ClickITCo website.",
  authors: [{
    name: "ClickITCo",
    url: "https://clickitco.com"
  }],
  keywords: ["create page", "ClickITCo admin", "CMS"]
};
export default function CreatePage() {
  return <FormPage />;
}