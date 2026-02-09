"use client";
import { Grid, Typography } from "@mui/material";
import { CTextField } from "components/custom";

export default function MapSection({ control, sectionKey, errors }) {
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
                    name={`sections.${sectionKey}.subtitle`}
                    label="Subtitle"
                    placeholder="Enter section subtitle"
                    multiline
                    rows={3}
                    error={errors.sections?.[sectionKey]?.subtitle}
                />
            </Grid>
            <Grid size={{ xs: 12 }}>
                <Typography fontWeight={400}><b>Note: </b>This section reflects the map and location data automatically.</Typography>
            </Grid>
        </Grid>
    );
};