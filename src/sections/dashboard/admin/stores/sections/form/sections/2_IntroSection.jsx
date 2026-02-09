"use client";
import { Grid } from "@mui/material";
import { CTextField } from "components/custom";

export default function IntroSection({ control, sectionKey, errors }) {
    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
                <CTextField
                    control={control}
                    name={`sections.${sectionKey}.title`}
                    label="Title"
                    placeholder="Enter section title"
                    error={errors.sections?.[sectionKey]?.title}
                />
            </Grid>

            <Grid size={{ xs: 12 }}>
                <CTextField
                    control={control}
                    name={`sections.${sectionKey}.description`}
                    label="Description"
                    placeholder="Enter section description"
                    multiline
                    rows={3}
                    error={errors.sections?.[sectionKey]?.description}
                />
            </Grid>
        </Grid>
    );
};