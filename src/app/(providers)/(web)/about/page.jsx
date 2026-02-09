import PageNotAvailable from "components/custom/common/PageNotAvailable";
import AboutPage from "sections/web/about";
import { getRecordByPageKey } from "server/services/cms.service";

export async function generateMetadata() {
  const pageData = await getRecordByPageKey("aboutpage");
  const meta = pageData?.meta || {};

  return {
    title: meta?.title || "About Us | ClickITCo",
    description: meta?.description || "Learn more about ClickITCo and our mission to transform IT services",
    keywords: meta?.keywords || ["ClickITCo", "About Us", "IT Services", "Company History", "Our Mission"],
    authors: [{
      name: "ClickITCo Team",
      url: "https://clickitco.com"
    }],
  };
}

export default async function AboutPageRoute() {
  const pageData = await getRecordByPageKey("aboutpage");

  return (
    pageData?.status !== "published"
      ? <PageNotAvailable />
      : <AboutPage data={pageData || {}} />
  )
}