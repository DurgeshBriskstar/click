import FormPage from "sections/dashboard/admin/stores/FormPage";

export const metadata = {
    title: "Edit Store - ClickITCo Admin",
    description: "Update store location details in ClickITCo admin.",
    authors: [{
        name: "ClickITCo",
        url: "https://clickitco.com"
    }],
    keywords: ["edit store", "ClickITCo admin", "update store"]
};

export default function EditStorePage() {
    return <FormPage isEdit />;
}

