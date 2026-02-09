import FormPage from "sections/dashboard/admin/users/FormPage";

export const metadata = {
    title: "Create User - ClickITCo Admin",
    description: "Create a new user in ClickITCo admin dashboard.",
    authors: [
        {
            name: "ClickITCo",
            url: "https://clickitco.com",
        },
    ],
    keywords: ["create user", "ClickITCo admin", "add user"],
};

export default async function CreateUserPage() {
    return <FormPage isEdit={false} />;
}

