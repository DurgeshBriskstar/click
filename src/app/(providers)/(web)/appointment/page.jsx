import PageNotAvailable from "components/custom/common/PageNotAvailable";
import AppointmentPage from "sections/web/appointment";
import { getRecordByPageKey } from "server/services/cms.service";
import { getActiveFAQsRecords } from "server/services/faq.service";
import { getActivePartnersRecords } from "server/services/partner.service";
import { getActiveStoreRecords } from "server/services/store.service";

export async function generateMetadata() {
  const pageData = await getRecordByPageKey("appointmentpage");
  const meta = pageData?.meta || {};

  return {
    title: meta?.title || "",
    description: meta?.description || "",
    keywords: meta?.keywords || ["Click IT Computers", "Click IT Website Design", "Click IT Secure", "Click IT Phone", "Click IT Email", "Click IT E-marketing", "Click IT Connect", "Click IT Backup", "Click IT Repairs", "Click IT Hosting", "Click IT MSP", "Click IT MPS", "Click IT Chat", "Click IT CRM"],
    authors: [{
      name: "ClickITCo",
      url: "https://clickitco.com"
    }],
  };
}

export default async function AppointmentBookingPage() {
  const pageData = await getRecordByPageKey("appointmentpage");
  const partnerData = await getActivePartnersRecords();
  const faqData = await getActiveFAQsRecords();
  const storeData = await getActiveStoreRecords();

  return (
    pageData?.status !== "published"
      ? <PageNotAvailable />
      : <AppointmentPage data={pageData || {}} partners={partnerData || []} faqs={faqData || []} stores={storeData || []} />
  )
}