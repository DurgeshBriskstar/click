import FormPage from "sections/dashboard/admin/faqs/FormPage";
import { getActiveServicesRecords } from "server/services/service.service";

export const metadata = {
    title: "Create FAQ - ClickITCo Admin",
    description: "Add a new frequently asked question to ClickITCo.",
    authors: [{
        name: "ClickITCo",
        url: "https://clickitco.com"
    }],
    keywords: ["create FAQ", "ClickITCo admin", "support"]
};
export default async function CreateFaqPage() {
    const serviceData = await getActiveServicesRecords();

    return <FormPage services={serviceData} />;
}

