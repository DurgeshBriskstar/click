import FormPage from "sections/dashboard/admin/services/FormPage";

export const metadata = {
  title: "Create Service - ClickITCo Admin",
  description: "Add a new service to ClickITCo offerings.",
  authors: [{
    name: "ClickITCo",
    url: "https://clickitco.com"
  }],
  keywords: ["create service", "ClickITCo admin", "IT services"]
};
export default function CreateServicePage() {
  return <FormPage />;
}