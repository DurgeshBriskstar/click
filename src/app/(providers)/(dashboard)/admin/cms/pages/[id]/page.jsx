import FormPage from "sections/dashboard/admin/cms/pages/FormPage";

export const metadata = {
  title: "Edit Page - ClickITCo Admin",
  description: "Update CMS page content in ClickITCo admin.",
  authors: [{
    name: "ClickITCo",
    url: "https://clickitco.com"
  }],
  keywords: ["edit page", "ClickITCo admin", "CMS"]
};
export default function UpdatePage() {
  return <FormPage isEdit={true} />;
}