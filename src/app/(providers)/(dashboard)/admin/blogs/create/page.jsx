import FormPage from "sections/dashboard/admin/blogs/FormPage";

export const metadata = {
    title: "Create Blog - ClickITCo",
    description: `Create new blog entries for ClickITCo.`,
    authors: [{
        name: "ClickITCo Team",
        url: "https://clickitco.com"
    }],
    keywords: ["blog", "content", "clickitco", "create blog", "admin"]
};

export default function CreateBlogPage() {
    return <FormPage />;
}


