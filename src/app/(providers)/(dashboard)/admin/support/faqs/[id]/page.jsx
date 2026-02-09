import FormPage from "sections/dashboard/admin/faqs/FormPage";
import { getActiveServicesRecords } from "server/services/service.service";

export const metadata = {
    title: "Edit FAQ - ClickITCo Admin",
    description: "Update FAQ details in ClickITCo admin.",
    authors: [{
        name: "ClickITCo",
        url: "https://clickitco.com"
    }],
    keywords: ["edit FAQ", "ClickITCo admin", "update FAQ"]
};

export default async function EditFaqPage() {
    const serviceData = await getActiveServicesRecords();

    return <FormPage isEdit services={serviceData} />;
}

