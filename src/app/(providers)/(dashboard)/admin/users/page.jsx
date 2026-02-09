import ListPage from "sections/dashboard/admin/users";

export const metadata = {
    title: "User Management - ClickITCo Admin",
    description: "Manage users and their roles from the admin dashboard.",
    authors: [
        {
            name: "ClickITCo",
            url: "https://clickitco.com",
        },
    ],
    keywords: ["user management", "ClickITCo admin", "user roles"],
};

export default async function UsersPage() {
    return <ListPage />;
}

