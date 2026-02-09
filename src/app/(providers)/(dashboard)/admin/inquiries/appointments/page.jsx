import ListPage from "sections/dashboard/admin/inquiries/appointments";

export const metadata = {
    title: "Appointment Inquiries - ClickITCo Admin",
    description: "View appointment form submissions from ClickITCo stores.",
    authors: [
        {
            name: "ClickITCo",
            url: "https://clickitco.com",
        },
    ],
    keywords: ["appointment inquiries", "ClickITCo admin", "form submissions"],
};

export default async function AppointmentInquiriesPage() {
    return <ListPage />;
}

