"use client";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContentSection from "./sections/2_ContentSection";
import BannerSection from "./sections/1_BannerSection";
import { GenericSection } from "../common-sections";

const sectionConfigs = [
    { section_key: "banner_section", label: "Banner Section" },
    { section_key: "content_section", label: "Content Section" }
];

export default function TermsPageSections({ control, errors }) {
    return (
        <>
            {
                sectionConfigs.map((config, index) => (
                    <Accordion defaultExpanded={index === 0} key={config?.section_key} elevation={2} sx={{ mb: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.2)', '&:before': { display: 'none' } }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography fontWeight={600}>{config?.label}</Typography>
                        </AccordionSummary>

                        <AccordionDetails>
                            {(() => {
                                switch (config?.section_key) {
                                    case "banner_section":
                                        return <BannerSection control={control} index={index} sectionKey={config?.section_key} errors={errors} />;
                                    case "content_section":
                                        return <ContentSection control={control} index={index} sectionKey={config?.section_key} errors={errors} />;
                                    default:
                                        return <GenericSection control={control} index={index} sectionKey={config?.section_key} errors={errors} />;
                                }
                            })()}
                        </AccordionDetails>
                    </Accordion >
                ))
            }
        </>
    );
}

