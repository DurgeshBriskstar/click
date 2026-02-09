import ListPage from "sections/dashboard/admin/faqs";

export const metadata = {
    title: "FAQ Management - ClickITCo Admin",
    description: "Manage frequently asked questions for ClickITCo website.",
    authors: [
        {
            name: "ClickITCo",
            url: "https://clickitco.com",
        },
    ],
    keywords: ["FAQ management", "ClickITCo admin", "support"],
};

export default async function FaqsPage() {
    return <ListPage />;
}

