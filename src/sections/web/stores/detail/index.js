"use client";

import { Container } from "react-bootstrap";
import StoreDetailBannerSection from "./sections/StoreDetailBannerSection";
import StoreIntroductionSection from "./sections/StoreIntroductionSection";
import MeetManagerSection from "./sections/MeetManagerSection";
import StoreMapSection from "./sections/StoreMapSection";
import StoreInfoSection from "./sections/StoreInfoSection";
import { FAQSection, OurPartnersSection, ServicesSection, TestimonialsSection, } from "../../common-sections";

export default function StoreDetailPage({ data, store, services, partners, faqs }) {

  const pageData = data || null;
  const sections = pageData?.sections || null;

  if (!pageData || !store) {
    return (
      <Container className="py-5 text-center">
        <div className="alert alert-warning">Store not found</div>
      </Container>
    );
  }

  return (
    <div className="store-detail-page">
      {sections?.banner_section && (<StoreDetailBannerSection data={sections?.banner_section} store={store} />)}

      {sections?.intro_section && (<StoreIntroductionSection data={sections?.intro_section} />)}

      {sections?.manager_section && (<MeetManagerSection data={sections?.manager_section} />)}

      {sections?.map_section && (<StoreMapSection data={sections?.map_section} store={store} />)}

      {sections?.store_info_section && (<StoreInfoSection data={sections?.store_info_section} store={store} />)}

      {sections?.services_section && (<ServicesSection data={sections?.services_section} services={services} />)}

      {sections?.testimonials_section && (<TestimonialsSection data={sections?.testimonials_section} />)}

      {sections?.faqs_section && (<FAQSection data={sections?.faqs_section} faqs={faqs} />)}

      {sections?.partners_section && (<OurPartnersSection data={sections?.partners_section} partners={partners} />)}
    </div>
  );
}

