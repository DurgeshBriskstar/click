import ListPage from "sections/dashboard/admin/partners";

export const metadata = {
    title: "Partners Management - ClickITCo Admin",
    description: "Manage ClickITCo partner relationships and details.",
    authors: [
        {
            name: "ClickITCo",
            url: "https://clickitco.com",
        },
    ],
    keywords: ["partners", "ClickITCo admin", "business partners"],
};

export default async function PartnersPage() {
    return <ListPage />;
}

