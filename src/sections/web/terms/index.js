"use client";

import { Container } from "react-bootstrap";
import BannerSection from "./sections/BannerSection";
import TermsContentSection from "./sections/TermsContentSection";

export default function TermsPage({ data }) {
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
      {sections?.content_section && <TermsContentSection data={sections.content_section} />}
    </div>
  );
}

