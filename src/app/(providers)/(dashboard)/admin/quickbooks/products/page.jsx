import ListPage from "sections/dashboard/admin/quickbooks/products";

export const metadata = {
    title: "QuickBooks Products - ClickITCo Admin",
    description: "View QuickBooks products/items from your connected account.",
    authors: [
        {
            name: "ClickITCo",
            url: "https://clickitco.com",
        },
    ],
    keywords: ["QuickBooks", "products", "items", "ClickITCo admin"],
};

export default async function QuickBooksProductsPage() {
    return <ListPage />;
}
