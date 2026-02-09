"use client";

import { FAQSection, OurPartnersSection, TestimonialsSection } from "../common-sections";
import AppointmentBannerSection from "./sections/AppointmentBannerSection";
import AppointmentFormSection from "./sections/AppointmentFormSection";

export default function AppointmentPage({ data, partners, faqs, stores }) {
  const pageData = data || null;
  const sections = pageData?.sections || null;
  const storesData = stores?.data || [];

  if (!pageData) {
    return (
      <Container className="py-5 text-center">
        <div className="alert alert-warning">No page data available</div>
      </Container>
    );
  }

  return (
    <div className="appointment-page">
      {sections?.banner_section && (<AppointmentBannerSection pageData={pageData} data={sections.banner_section} />)}

      {sections?.form_section && (<AppointmentFormSection data={sections.form_section} stores={storesData} />)}

      {sections?.testimonials_section && (<TestimonialsSection data={sections?.testimonials_section} />)}

      {sections?.faqs_section && (<FAQSection data={sections?.faqs_section} faqs={faqs} />)}

      {sections?.partners_section && (<OurPartnersSection data={sections?.partners_section} partners={partners} />)}
    </div>
  );
}