"use client";

import { Container } from "react-bootstrap";
import BannerSection from "./sections/BannerSection";
import PrivacyContentSection from "./sections/PrivacyContentSection";

export default function PrivacyPage({ data }) {
  const pageData = data || null;
  const sections = pageData?.sections || null;

  if (!pageData) {
    return (
      <Container className="py-5 text-center">
        <div className="alert alert-warning">No page data available</div>
      </Container>
    );
  }
  return (
    <div className="terms-page">
      {sections?.banner_section && <BannerSection pageData={pageData} data={sections.banner_section} />}
      {sections?.content_section && <PrivacyContentSection data={sections.content_section} />}
    </div>
  );
}

