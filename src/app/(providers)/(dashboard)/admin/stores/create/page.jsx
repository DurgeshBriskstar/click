import FormPage from "sections/dashboard/admin/stores/FormPage";

export const metadata = {
    title: "Create Store - ClickITCo Admin",
    description: "Add a new store location to ClickITCo.",
    authors: [{
        name: "ClickITCo",
        url: "https://clickitco.com"
    }],
    keywords: ["create store", "ClickITCo admin", "new store location"]
};
export default function CreateStorePage() {
    return <FormPage />;
}

