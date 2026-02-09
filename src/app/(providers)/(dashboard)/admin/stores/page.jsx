import ListPage from "sections/dashboard/admin/stores";

export const metadata = {
    title: "Store Management - ClickITCo Admin",
    description: "Manage ClickITCo store locations and details from the admin dashboard.",
    authors: [
        {
            name: "ClickITCo",
            url: "https://clickitco.com",
        },
    ],
    keywords: ["store management", "ClickITCo admin", "store locations"],
};

export default async function StoresPage() {
    return <ListPage />;
}

