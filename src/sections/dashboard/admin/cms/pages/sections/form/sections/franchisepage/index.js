"use client";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BannerSection from "./sections/1_BannerSection";
import IntroFormSection from "./sections/2_IntroFormSection";
import WhyJoinSection from "./sections/3_WhyJoinSection";
import { GenericSection, TestimonialSection } from "../common-sections";

const sectionConfigs = [
    { section_key: "banner_section", label: "Banner Section" },
    { section_key: "intro_form_section", label: "Intro & Form Section" },
    { section_key: "why_join_section", label: "Why Join Section" },
    { section_key: "testimonials_section", label: "Testimonials Section" },
];

export default function FranchisePageSections({ control, errors }) {
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
                                case "intro_form_section":
                                    return <IntroFormSection control={control} index={index} sectionKey={config.section_key} errors={errors} />;
                                case "why_join_section":
                                    return <WhyJoinSection control={control} index={index} sectionKey={config.section_key} errors={errors} />;
                                case "testimonials_section":
                                    return <TestimonialSection control={control} index={index} sectionKey={config.section_key} errors={errors} />;
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

