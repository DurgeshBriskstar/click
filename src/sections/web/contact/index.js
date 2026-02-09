"use client";

import { ContactBannerSection, ContactMainSection, } from "./sections";

export default function ContactPage({ data, stores = [] }) {
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
    <div className="contact-page">
      {sections?.banner_section && <ContactBannerSection pageData={pageData} data={sections.banner_section} />}
      {sections?.intro_section && <ContactMainSection stores={stores} />}
    </div>
  );
}

