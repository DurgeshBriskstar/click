"use client";

import { Container } from "react-bootstrap";
import ServicesBannerSection from "./sections/ServicesBannerSection";
import ServicesGridSection from "./sections/ServicesGridSection";

export default function ServicesPage({ data, services }) {
  const pageData = data || null;
  const sections = pageData?.sections || null;

  if (!pageData) {
    return (
      <Container className="py-5 text-center">
        <div className="alert alert-warning">No page data available</div>
      </Container>
    );
  }

  const serviceData = services?.data || [];

  return (
    <div className="services-page">
      {sections?.banner_section && (<ServicesBannerSection pageData={pageData} data={sections.banner_section} />)}

      {sections?.intro_section && (<ServicesGridSection data={sections.intro_section} services={serviceData} />)}
    </div>
  );
}
