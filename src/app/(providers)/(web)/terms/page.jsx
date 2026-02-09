import PageNotAvailable from "components/custom/common/PageNotAvailable";
import TermsPage from "sections/web/terms";
import { getRecordByPageKey } from "server/services/cms.service";

export async function generateMetadata() {
  const pageData = await getRecordByPageKey("termspage");

  const meta = pageData?.meta || {};

  return {
    title: meta?.title || "Terms of Service | ClickITCo",
    description: meta?.description || "Read ClickITCo's Terms of Service to understand the rules and regulations for using our website and services.",
    keywords: meta?.keywords || ["ClickITCo", "Terms of Service", "Terms and Conditions", "User Agreement", "Legal"],
    authors: [{
      name: "ClickITCo Team",
      url: "https://clickitco.com"
    }],
  };
}

export default async function TermsPageRoute() {
  const pageData = await getRecordByPageKey("termspage");

  return (
    pageData?.status !== "published"
      ? <PageNotAvailable />
      : <TermsPage data={pageData || {}} />
  )
}