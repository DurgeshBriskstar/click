"use client";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BannerSection from "./sections/1_BannerSection";
import IntroSection from "./sections/2_IntroSection";
import FromOneStoreSection from "./sections/3_FromOneStoreSection";
import JourneyTimelineSection from "./sections/4_JourneyTimelineSection";
import FranchiseSection from "./sections/5_FranchiseSection";
import { GenericSection, TeamSection, TestimonialSection } from "../common-sections";

const sectionConfigs = [
    { section_key: "banner_section", label: "Banner Section" },
    { section_key: "intro_section", label: "Intro Section" },
    { section_key: "from_one_store_section", label: "From One Store Section" },
    { section_key: "journey_timeline_section", label: "Journey Timeline Section" },
    { section_key: "franchise_section", label: "Franchise Section" },
    { section_key: "team_section", label: "Team Section" },
    { section_key: "testimonials_section", label: "Testimonials Section" },
];

export default function AboutPageSections({ control, errors }) {
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
                                case "intro_section":
                                    return <IntroSection control={control} index={index} sectionKey={config.section_key} errors={errors} />;
                                case "from_one_store_section":
                                    return <FromOneStoreSection control={control} index={index} sectionKey={config.section_key} errors={errors} />;
                                case "journey_timeline_section":
                                    return <JourneyTimelineSection control={control} index={index} sectionKey={config.section_key} errors={errors} />;
                                case "franchise_section":
                                    return <FranchiseSection control={control} index={index} sectionKey={config.section_key} errors={errors} />;
                                case "team_section":
                                    return <TeamSection control={control} index={index} sectionKey={config.section_key} errors={errors} />;
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

