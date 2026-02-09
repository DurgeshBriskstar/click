import ListPage from "sections/dashboard/admin/inquiries/contact-us";

export const metadata = {
    title: "Contact Us Inquiries - ClickITCo Admin",
    description: "View contact form submissions from ClickITCo stores.",
    authors: [
        {
            name: "ClickITCo",
            url: "https://clickitco.com",
        },
    ],
    keywords: ["contact inquiries", "ClickITCo admin", "form submissions"],
};

export default async function ContactInquiriesPage() {
    return <ListPage />;
}

