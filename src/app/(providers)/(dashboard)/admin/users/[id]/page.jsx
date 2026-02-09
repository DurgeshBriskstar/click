import FormPage from "sections/dashboard/admin/users/FormPage";

export const metadata = {
    title: "Edit User - ClickITCo Admin",
    description: "Edit user details in ClickITCo admin dashboard.",
    authors: [
        {
            name: "ClickITCo",
            url: "https://clickitco.com",
        },
    ],
    keywords: ["edit user", "ClickITCo admin", "update user"],
};

export default async function EditUserPage() {
    return <FormPage isEdit={true} />;
}

