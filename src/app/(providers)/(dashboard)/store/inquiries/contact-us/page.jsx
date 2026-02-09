import ListPage from "sections/dashboard/store/inquiries/contact-us";

export const metadata = {
    title: "Contact Us Inquiries - ClickITCo Store Admin",
    description: "View contact form submissions for your store.",
    authors: [
        {
            name: "ClickITCo",
            url: "https://clickitco.com",
        },
    ],
    keywords: ["contact inquiries", "ClickITCo store admin", "form submissions"],
};

export default async function ContactInquiriesPage() {
    return <ListPage />;
}

