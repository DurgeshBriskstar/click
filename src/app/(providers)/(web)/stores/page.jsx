import PageNotAvailable from "components/custom/common/PageNotAvailable";
import StorePage from "sections/web/stores"
import { getRecordByPageKey } from "server/services/cms.service";
import { getActiveStoreRecords } from "server/services/store.service";

export async function generateMetadata() {
  const pageData = await getRecordByPageKey("locationpage");
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
export default async function StoresPage() {
  const pageData = await getRecordByPageKey("locationpage");
  const storeData = await getActiveStoreRecords();

  return (
    pageData?.status !== "published"
      ? <PageNotAvailable />
      : <StorePage data={pageData || {}} stores={storeData || []} />
  )
}

