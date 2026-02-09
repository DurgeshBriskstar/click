"use client";

import { Container } from "react-bootstrap";
import { BannerSection, IntroSection, FromOneStoreSection, JourneyTimelineSection, TeamSection } from "./sections";
import { FranchiseSection, TestimonialsSection } from "../common-sections";

export default function AboutPage({ data }) {
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
    <div className="about-page">
      {sections?.banner_section && <BannerSection pageData={pageData} data={sections.banner_section} />}
      {sections?.intro_section && <IntroSection data={sections.intro_section} />}
      {sections?.from_one_store_section && <FromOneStoreSection data={sections.from_one_store_section} />}
      {sections?.journey_timeline_section && <JourneyTimelineSection data={sections.journey_timeline_section} />}
      {sections?.franchise_section && <FranchiseSection data={sections.franchise_section} />}
      {sections?.team_section && <TeamSection data={sections.team_section} />}
      {sections?.testimonials_section && <TestimonialsSection data={sections.testimonials_section} />}
    </div>
  );
}

