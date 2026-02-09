import FormPage from "sections/dashboard/admin/partners/FormPage";

export const metadata = {
    title: "Create Partner - ClickITCo Admin",
    description: "Add a new business partner to ClickITCo.",
    authors: [{
        name: "ClickITCo",
        url: "https://clickitco.com"
    }],
    keywords: ["create partner", "ClickITCo admin", "business partners"]
};
export default function CreatePartnerPage() {
    return <FormPage />;
}

