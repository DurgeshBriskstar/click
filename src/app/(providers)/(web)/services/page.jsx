import PageNotAvailable from "components/custom/common/PageNotAvailable";
import ServicesPage from "sections/web/services"
import { getRecordByPageKey } from "server/services/cms.service";
import { getActiveServicesRecords } from "server/services/service.service";

export async function generateMetadata() {
  const pageData = await getRecordByPageKey("servicelistpage");
  const meta = pageData?.meta || {};

  return {
    title: meta?.title || "Click IT Co.",
    description: meta?.description || "Predictable Monthly Costs by Economies of Scale",
    keywords: meta?.keywords || ["Click IT Computers", "Click IT Website Design", "Click IT Secure", "Click IT Phone", "Click IT Email", "Click IT E-marketing", "Click IT Connect", "Click IT Backup", "Click IT Repairs", "Click IT Hosting", "Click IT MSP", "Click IT MPS", "Click IT Chat", "Click IT CRM"],
    authors: [{
      name: "ClickITCo",
      url: "https://clickitco.com"
    }],
  };
}

export default async function ServiceListPage() {
  const pageData = await getRecordByPageKey("servicelistpage");
  const serviceData = await getActiveServicesRecords();

  return (
    pageData?.status !== "published"
      ? <PageNotAvailable />
      : <ServicesPage data={pageData || {}} services={serviceData || []} />
  )
}