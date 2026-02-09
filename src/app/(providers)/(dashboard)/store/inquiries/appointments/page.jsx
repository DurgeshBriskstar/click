import ListPage from "sections/dashboard/store/inquiries/appointments";

export const metadata = {
    title: "Appointment Inquiries - ClickITCo Store Admin",
    description: "View appointment form submissions for your store.",
    authors: [
        {
            name: "ClickITCo",
            url: "https://clickitco.com",
        },
    ],
    keywords: ["appointment inquiries", "ClickITCo store admin", "form submissions"],
};

export default async function AppointmentInquiriesPage() {
    return <ListPage />;
}

