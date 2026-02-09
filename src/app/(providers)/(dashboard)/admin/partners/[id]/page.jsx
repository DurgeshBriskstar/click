import FormPage from "sections/dashboard/admin/partners/FormPage";

export const metadata = {
    title: "Edit Partner - ClickITCo Admin",
    description: "Update partner details in ClickITCo admin.",
    authors: [{
        name: "ClickITCo",
        url: "https://clickitco.com"
    }],
    keywords: ["edit partner", "ClickITCo admin", "update partner"]
};

export default function EditPartnerPage() {
    return <FormPage isEdit />;
}

