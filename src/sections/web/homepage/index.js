"use client";

import { Container } from "react-bootstrap";
import { AboutUsSection, GettingStartedSection, HeroSection, InsightsSection, ProductisedCategoriesSection, QuickTrustedSection, TechInGoodHandsSection, TrustedPartnerSection } from "./sections";
import { FAQSection, OurPartnersSection, ServicesSection, StoresSection, FranchiseSection, TestimonialsSection } from "../common-sections";

export default function HomePage({ data, services, partners, faqs, blogs, stores }) {
    const pageData = data || null;

    if (!pageData) {
        return (
            <Container className="py-5 text-center">
                <div className="alert alert-warning">No page data available</div>
            </Container>
        );
    }

    return (
        <div>
            {pageData?.hero_section && <HeroSection data={pageData?.hero_section} services={services} />}
            {pageData?.service_category_section && <ProductisedCategoriesSection data={pageData?.service_category_section} />}
            {pageData?.get_started_section && <GettingStartedSection data={pageData?.get_started_section} />}
            {pageData?.about_us_section && <AboutUsSection data={pageData?.about_us_section} />}
            {pageData?.partners_section && <OurPartnersSection data={pageData?.partners_section} partners={partners} />}
            {pageData?.cta1_section && <TrustedPartnerSection data={pageData?.cta1_section} />}
            {pageData?.tech_in_good_hand_section && <TechInGoodHandsSection data={pageData?.tech_in_good_hand_section} />}
            {pageData?.services_section && <ServicesSection data={pageData?.services_section} services={services} />}
            {pageData?.franchise_section && <FranchiseSection data={pageData?.franchise_section} />}
            {pageData?.faqs_section && <FAQSection data={pageData?.faqs_section} faqs={faqs} />}
            {pageData?.testimonials_section && <TestimonialsSection data={pageData?.testimonials_section} />}
            {pageData?.map_section && <StoresSection data={pageData?.map_section} stores={stores} />}
            {pageData?.cta2_section && <QuickTrustedSection data={pageData?.cta2_section} />}
            {pageData?.blog_section && <InsightsSection data={pageData?.blog_section} blogs={blogs} />}
        </div>
    );
}
