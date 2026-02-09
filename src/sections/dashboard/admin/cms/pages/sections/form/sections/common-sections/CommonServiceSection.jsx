"use client";
import { Grid, Typography } from "@mui/material";
import { CTextField } from "components/custom";

export default function ServiceSection({ control, sectionKey, errors }) {
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
                <Typography fontWeight={400}><b>Note: </b>All services displayed in this section will be sourced from the Services module.</Typography>
            </Grid>
        </Grid>
    );
};