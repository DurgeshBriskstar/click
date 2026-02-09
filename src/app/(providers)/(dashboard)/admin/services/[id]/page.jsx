import FormPage from "sections/dashboard/admin/services/FormPage";

export const metadata = {
  title: "Edit Service - ClickITCo Admin",
  description: "Update service details in ClickITCo admin.",
  authors: [{
    name: "ClickITCo",
    url: "https://clickitco.com"
  }],
  keywords: ["edit service", "ClickITCo admin", "update service"]
};
export default function UpdateServicePage() {
  return <FormPage isEdit={true} />;
}