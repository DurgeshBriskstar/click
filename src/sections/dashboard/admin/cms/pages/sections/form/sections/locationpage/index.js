"use client";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Grid } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IntroSection from "./sections/1_IntroSection";
import BannerSection from "./sections/1_BannerSection";
import { GenericSection } from "../common-sections";

const sectionConfigs = [
    { section_key: "banner_section", label: "Banner Section" },
    { section_key: "intro_section", label: "Intro Section" }
];

export default function LocationPageSections({ control, errors }) {
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
                                default:
                                    return <GenericSection control={control} index={index} sectionKey={config.section_key} errors={errors} />;
                            }
                        })()}
                    </AccordionDetails>
                </Accordion >
            ))
            }
            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                    <Typography fontWeight={400}><b>Note: </b>This section reflects the map and location data automatically.</Typography>
                </Grid>
            </Grid>
        </>
    );
}

