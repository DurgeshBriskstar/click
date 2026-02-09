import PageNotAvailable from "components/custom/common/PageNotAvailable";
import PrivacyPage from "sections/web/privacy";
import { getRecordByPageKey } from "server/services/cms.service";

export async function generateMetadata() {
  const pageData = await getRecordByPageKey("privacypage");
  const meta = pageData?.meta || {};

  return {
    title: meta?.title || "Privacy Policy | ClickITCo",
    description: meta?.description || "Read ClickITCo's Privacy Policy to understand how we collect, use, and protect your personal information.",
    keywords: meta?.keywords || ["ClickITCo", "Privacy Policy", "Data Protection", "Privacy", "Personal Information"],
    authors: [{
      name: "ClickITCo Team",
      url: "https://clickitco.com"
    }],
  };
}

export default async function PrivacyPageRoute() {
  const pageData = await getRecordByPageKey("privacypage");

  return (
    pageData?.status !== "published"
      ? <PageNotAvailable />
      : <PrivacyPage data={pageData || {}} />
  )
}