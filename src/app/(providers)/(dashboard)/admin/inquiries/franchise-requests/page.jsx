import ListPage from "sections/dashboard/admin/inquiries/franchise-requests";

export const metadata = {
    title: "Franchise Requests - ClickITCo Admin",
    description: "View franchise form submissions from ClickITCo.",
    authors: [
        {
            name: "ClickITCo",
            url: "https://clickitco.com",
        },
    ],
    keywords: ["franchise requests", "ClickITCo admin", "form submissions"],
};

export default async function FranchiseRequestsPage() {
    return <ListPage />;
}

