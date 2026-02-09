"use client";

import { Container } from "react-bootstrap";
import FranchiseBannerSection from "./sections/FranchiseBannerSection";
import FranchiseIntroFormSection from "./sections/FranchiseIntroFormSection";
import FranchiseWhyJoinSection from "./sections/FranchiseWhyJoinSection";
import { TestimonialsSection } from "../common-sections";

export default function FranchisePage({ data }) {
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
    <div className="franchise-page">
      {sections?.banner_section && (
        <FranchiseBannerSection data={sections.banner_section} pageData={pageData} />
      )}

      {sections?.intro_form_section && (
        <FranchiseIntroFormSection data={sections.intro_form_section} />
      )}

      {sections?.why_join_section && (
        <FranchiseWhyJoinSection data={sections.why_join_section} />
      )}

      {sections?.testimonials_section && (
        <TestimonialsSection data={sections.testimonials_section} />
      )}
    </div>
  );
}

