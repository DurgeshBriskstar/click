"use client";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HeroSection from "./sections/1_HeroSection";
import ServiceCategorySection from "./sections/2_ServiceCategorySection";
import GetStartedSection from "./sections/3_GetStartedSection";
import AboutUsSection from "./sections/4_AboutUsSection";
import CTA1Section from "./sections/6_CTA1Section";
import TechInGoodHandSection from "./sections/7_TechInGoodHandSection";
import FranchiseSection from "./sections/9_FranchiseSection";
import MapSection from "./sections/12_MapSection";
import CTA2Section from "./sections/13_CTA2Section";
import BlogSection from "./sections/14_BlogSection";
import { FAQSection, GenericSection, PartnerSection, TestimonialSection } from "../common-sections";
import ServiceSection from "../common-sections/CommonServiceSection";

const sectionConfigs = [
    { section_key: "hero_section", label: "Hero Section" },
    { section_key: "service_category_section", label: "Service Category Section" },
    { section_key: "get_started_section", label: "Get Started Section" },
    { section_key: "about_us_section", label: "About Us Section" },
    { section_key: "partners_section", label: "Partners Section" },
    { section_key: "cta1_section", label: "CTA 1 Section" },
    { section_key: "tech_in_good_hand_section", label: "Tech Is In Good Hand Section" },
    { section_key: "services_section", label: "Services Section" },
    { section_key: "franchise_section", label: "Franchise Section" },
    { section_key: "faqs_section", label: "FAQ's Section" },
    { section_key: "testimonials_section", label: "Testimonials Section" },
    { section_key: "map_section", label: "Map Section" },
    { section_key: "cta2_section", label: "CTA 2 Section" },
    { section_key: "blog_section", label: "Blog Section" },
];

export default function HomePageSections({ control, errors }) {
    return (
        <>
            {sectionConfigs.map((config, index) => (
                <Accordion defaultExpanded={index === 0} key={config.section_key} elevation={2} sx={{ mb: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.2)', '&:before': { display: 'none' } }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography fontWeight={600}>{config.label}</Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                        {(() => {
                            switch (config.section_key) {
                                case "hero_section":
                                    return <HeroSection control={control} index={index} sectionKey={config.section_key} errors={errors} />;

                                case "service_category_section":
                                    return <ServiceCategorySection control={control} index={index} sectionKey={config.section_key} errors={errors} />;

                                case "get_started_section":
                                    return <GetStartedSection control={control} index={index} sectionKey={config.section_key} errors={errors} />;

                                case "about_us_section":
                                    return <AboutUsSection control={control} index={index} sectionKey={config.section_key} errors={errors} />;

                                case "partners_section":
                                    return <PartnerSection control={control} index={index} sectionKey={config.section_key} errors={errors} />;

                                case "cta1_section":
                                    return <CTA1Section control={control} index={index} sectionKey={config.section_key} errors={errors} />;

                                case "tech_in_good_hand_section":
                                    return <TechInGoodHandSection control={control} index={index} sectionKey={config.section_key} errors={errors} />;

                                case "services_section":
                                    return <ServiceSection control={control} index={index} sectionKey={config.section_key} errors={errors} />;

                                case "franchise_section":
                                    return <FranchiseSection control={control} index={index} sectionKey={config.section_key} errors={errors} />;

                                case "faqs_section":
                                    return <FAQSection control={control} index={index} sectionKey={config.section_key} errors={errors} />;

                                case "testimonials_section":
                                    return <TestimonialSection control={control} index={index} sectionKey={config.section_key} errors={errors} />;

                                case "map_section":
                                    return <MapSection control={control} index={index} sectionKey={config.section_key} errors={errors} />;

                                case "cta2_section":
                                    return <CTA2Section control={control} index={index} sectionKey={config.section_key} errors={errors} />;

                                case "blog_section":
                                    return <BlogSection control={control} index={index} sectionKey={config.section_key} errors={errors} />;

                                default:
                                    return <GenericSection control={control} index={index} sectionKey={config.section_key} errors={errors} />;
                            }
                        })()}
                    </AccordionDetails>
                </Accordion >
            ))
            }
        </>
    );
}

