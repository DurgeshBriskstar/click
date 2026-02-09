"use client";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Grid } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BannerSection from "./sections/1_BannerSection";
import FormSection from "./sections/2_FormSection";
import { FAQSection, GenericSection, PartnerSection, TestimonialSection } from "../common-sections";

const sectionConfigs = [
    { section_key: "banner_section", label: "Banner Section" },
    { section_key: "form_section", label: "Form Section" },
    { section_key: "testimonials_section", label: "Testimonials Section" },
    { section_key: "faqs_section", label: "FAQ's Section" },
    { section_key: "partners_section", label: "Partners Section" },
];

export default function AppointmentPageSections({ control, errors }) {
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
                                case "banner_section":
                                    return <BannerSection control={control} index={index} sectionKey={config.section_key} errors={errors} />;
                                case "form_section":
                                    return <FormSection control={control} index={index} sectionKey={config.section_key} errors={errors} />;
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
        </>
    );
}

