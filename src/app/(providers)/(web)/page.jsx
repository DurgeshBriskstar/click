import { getRecordByPageKey } from "server/services/cms.service";
import HomePage from "sections/web/homepage";
import { getActiveServicesRecords } from "server/services/service.service";
import { getActivePartnersRecords } from "server/services/partner.service";
import { getActiveFAQsRecords } from "server/services/faq.service";
import { getActiveBlogRecords } from "server/services/blog.service";
import { getActiveStoreRecords } from "server/services/store.service";
import PageNotAvailable from "components/custom/common/PageNotAvailable";

export async function generateMetadata() {
  const pageData = await getRecordByPageKey("homepage");
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

export default async function IndexPage() {
  const pageData = await getRecordByPageKey("homepage");
  const serviceData = await getActiveServicesRecords();
  const partnerData = await getActivePartnersRecords();
  const faqData = await getActiveFAQsRecords();
  const blogData = await getActiveBlogRecords({ rowsPerPage: 3 });
  const storeData = await getActiveStoreRecords();
  const sections = pageData?.sections || null;

  return (
    pageData?.status !== "published"
      ? <PageNotAvailable />
      : <HomePage data={sections} services={serviceData || []} partners={partnerData || []} faqs={faqData || []} blogs={blogData || []} stores={storeData || []} />
  )
}
