import FormPage from "sections/dashboard/admin/blogs/FormPage";

export const metadata = {
    title: "Edit Blog - ClickITCo",
    description: `Update blog entries for ClickITCo.`,
    authors: [{
        name: "ClickITCo Team",
        url: "https://clickitco.com"
    }],
    keywords: ["blog", "content", "clickitco", "edit blog", "admin"]
};

export default function EditBlogPage() {
    return <FormPage isEdit />;
}


