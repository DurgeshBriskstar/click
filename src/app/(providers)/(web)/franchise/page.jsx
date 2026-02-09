import PageNotAvailable from "components/custom/common/PageNotAvailable";
import FranchisePage from "sections/web/franchise";
import { getRecordByPageKey } from "server/services/cms.service";

export const metadata = {
  title: "Franchise | ClickITCo Support",
  description: "Join ClickITCo as a franchise partner and build a successful IT services business. Explore franchise opportunities, benefits, and investment requirements.",
  authors: [{
    name: "ClickITCo Team",
    url: "https://clickitco.com"
  }],
  keywords: ["ClickITCo", "franchise", "franchise opportunity", "IT services franchise", "business opportunity"]
};

export default async function FranchisePageRoute() {
  const pageData = await getRecordByPageKey("franchisepage");

  return (
    pageData?.status !== "published"
      ? <PageNotAvailable />
      : <FranchisePage data={pageData || {}} />
  )
}