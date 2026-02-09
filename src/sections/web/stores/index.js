"use client";

import AllStoresSection from "./sections/AllStoresSection";
import { StoresSection } from "../common-sections";
import StoreBannerSection from "./sections/StoreBannerSection";

export default function StorePage({ data, stores }) {
  const pageData = data || null;
  const sections = pageData?.sections || null;

  if (!pageData) {
    return (
      <Container className="py-5 text-center">
        <div className="alert alert-warning">No page data available</div>
      </Container>
    );
  }

  const storesData = stores?.data || [];

  return (
    <div className="store-page">
      {sections?.banner_section && (<StoreBannerSection pageData={pageData} data={sections.banner_section} />)}
      {sections?.intro_section && <StoresSection data={sections?.intro_section} stores={stores} />}
      {storesData && <AllStoresSection data={storesData} />}
    </div>
  );
}
