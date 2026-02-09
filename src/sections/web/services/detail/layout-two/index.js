"use client";

import { Container } from "react-bootstrap";
import BannerSection from "./sections/BannerSection";
import DetailSection1 from "./sections/DetailSection1";
import DetailSection2 from "./sections/DetailSection2";
import DetailSection3 from "./sections/DetailSection3";
import DetailSection4 from "./sections/DetailSection4";
import { FAQSection, OurPartnersSection, ServicesSection, TestimonialsSection } from "../common-sections";

export default function ServiceLayoutTwo({ serviceData, sections, services, partners, faqs }) {
  const pageData = serviceData || null;

  if (!pageData) {
    return (
      <Container className="py-5 text-center">
        <div className="alert alert-warning">No page data available</div>
      </Container>
    );
  }

  return (
    <div className="service-detail-page layout-two">
      {sections?.banner_section && (<BannerSection pageData={pageData} data={sections.banner_section} />)}

      {sections?.detail_section1 && (<DetailSection1 data={sections.detail_section1} />)}

      {sections?.detail_section2 && (<DetailSection2 data={sections.detail_section2} />)}

      {sections?.detail_section3 && (<DetailSection3 data={sections.detail_section3} />)}

      {sections?.detail_section4 && (<DetailSection4 data={sections.detail_section4} />)}

      {sections?.services_section && (<ServicesSection data={sections.services_section} services={services} />)}

      {sections?.testimonials_section && (<TestimonialsSection data={sections.testimonials_section} />)}

      {sections?.faqs_section && (<FAQSection data={sections.faqs_section} faqs={faqs} isStore={false} serviceId={pageData?.id || null} />)}

      {sections?.partners_section && (<OurPartnersSection data={sections.partners_section} partners={partners} />)}
    </div>
  );
}