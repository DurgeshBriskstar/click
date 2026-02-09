import ListPage from "sections/dashboard/admin/quickbooks/customers";

export const metadata = {
    title: "QuickBooks Customers - ClickITCo Admin",
    description: "View QuickBooks customers from your connected account.",
    authors: [
        {
            name: "ClickITCo",
            url: "https://clickitco.com",
        },
    ],
    keywords: ["QuickBooks", "customers", "ClickITCo admin"],
};

export default async function QuickBooksCustomersPage() {
    return <ListPage />;
}
