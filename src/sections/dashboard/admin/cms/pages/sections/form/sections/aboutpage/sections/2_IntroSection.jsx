"use client";
import { Grid } from "@mui/material";
import { CTextField } from "components/custom";
import CImageUpload from "components/custom/inputs/CImageUpload";

export default function IntroSection({ control, sectionKey, errors }) {
    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
                <CImageUpload
                    control={control}
                    name={`sections.${sectionKey}.background_image`}
                    label="Image"
                    maxFiles={1}
                    multiple={false}
                    error={errors?.sections?.[sectionKey].background_image}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
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
                </Grid>
            </Grid>
        </Grid>
    );
};