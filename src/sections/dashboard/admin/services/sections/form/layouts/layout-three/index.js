import { Typography, Box, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import IntroSection from "./sections/1_IntroSection";
import { ExpandMore } from "@mui/icons-material";
import { FAQSection, GenericSection, PartnerSection, TestimonialSection } from "sections/dashboard/admin/cms/pages/sections/form/sections/common-sections";
import ServiceSection from "sections/dashboard/admin/cms/pages/sections/form/sections/common-sections/CommonServiceSection";
import DetailSection2 from "./sections/3_DetailSection2";
import DetailSection1 from "./sections/2_DetailSection1";
import CommonBannerSection from "sections/dashboard/admin/cms/pages/sections/form/sections/common-sections/CommonBannerSection";

const sectionConfigs = [
    { section_key: "banner_section", label: "Banner Section" },
    { section_key: "intro_section", label: "Intro Section" },
    { section_key: "detail_section1", label: "Detail Section 1" },
    { section_key: "detail_section2", label: "Detail Section 2" },
    { section_key: "services_section", label: "Services Section" },
    { section_key: "testimonials_section", label: "Testimonials Section" },
    { section_key: "faqs_section", label: "FAQ's Section" },
    { section_key: "partners_section", label: "Partners Section" },
];

export default function LayoutThree({ control, errors }) {
    return (
        <Box>
            {sectionConfigs.map((config, index) => (
                <Accordion defaultExpanded={index === 0} key={config.section_key} elevation={2} sx={{ mb: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.2)', '&:before': { display: 'none' } }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography fontWeight={600}>{config.label}</Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                        {(() => {
                            switch (config.section_key) {
                                case "banner_section":
                                    return <CommonBannerSection control={control} index={index} sectionKey={config.section_key} errors={errors} />;
                                case "intro_section":
                                    return <IntroSection control={control} index={index} sectionKey={config.section_key} errors={errors} />;
                                case "detail_section1":
                                    return <DetailSection1 control={control} index={index} sectionKey={config.section_key} errors={errors} />;
                                case "detail_section2":
                                    return <DetailSection2 control={control} index={index} sectionKey={config.section_key} errors={errors} />;
                                case "services_section":
                                    return <ServiceSection control={control} index={index} sectionKey={config.section_key} errors={errors} />;
                                case "testimonials_section":
                                    return <TestimonialSection control={control} index={index} sectionKey={config.section_key} errors={errors} />;
                                case "faqs_section":
                                    return <FAQSection control={control} index={index} sectionKey={config.section_key} errors={errors} />;
                                case "partners_section":
                                    return <PartnerSection control={control} index={index} sectionKey={config.section_key} errors={errors} />;
                                default:
                                    return <GenericSection control={control} index={index} sectionKey={config.section_key} errors={errors} />;
                            }
                        })()}
                    </AccordionDetails>
                </Accordion >
            ))}
        </Box>
    );
}

