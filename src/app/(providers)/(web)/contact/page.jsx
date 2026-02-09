import PageNotAvailable from "components/custom/common/PageNotAvailable";
import ContactPage from "sections/web/contact";
import { getRecordByPageKey } from "server/services/cms.service";
import { getActiveStoreRecords } from "server/services/store.service";

export async function generateMetadata() {
  const pageData = await getRecordByPageKey("contactpage");
  const meta = pageData?.meta || {};

  return {
    title: meta?.title || "Contact Us | ClickITCo",
    description: meta?.description || "Learn more about ClickITCo and our mission to transform IT services",
    keywords: meta?.keywords || ["ClickITCo", "About Us", "IT Services", "Company History", "Our Mission"],
    authors: [{
      name: "ClickITCo Team",
      url: "https://clickitco.com"
    }],
  };
}

export default async function ContactPageRoute() {
  const [pageData, storesData] = await Promise.all([
    getRecordByPageKey("contactpage"),
    getActiveStoreRecords()
  ]);

  return (
    pageData?.status !== "published"
      ? <PageNotAvailable />
      : <ContactPage data={pageData || {}} stores={storesData?.data || []} />
  )
}