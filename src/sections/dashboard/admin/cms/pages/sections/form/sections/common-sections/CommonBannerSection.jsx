"use client";
import { Grid, Tooltip } from "@mui/material";
import { CTextField } from "components/custom";
import CImageUpload from "components/custom/inputs/CImageUpload";

export default function CommonBannerSection({ control, sectionKey, errors }) {
    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
                <CImageUpload
                    control={control}
                    name={`sections.${sectionKey}.banner_image`}
                    label="Banner image"
                    maxFiles={1}
                    multiple={false}
                    error={errors?.sections?.[sectionKey].banner_image}
                />
            </Grid>
            <Grid size={{ xs: 12 }}>
                <CTextField
                    control={control}
                    name={`sections.${sectionKey}.title`}
                    label="Title (Use curly braces {} around text to highlight it)"
                    placeholder="Enter section title"
                    error={errors.sections?.[sectionKey]?.title}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <CTextField
                    control={control}
                    name={`sections.${sectionKey}.buttonText`}
                    label="Button Text"
                    placeholder="Enter button text"
                    error={errors.sections?.[sectionKey]?.buttonText}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <CTextField
                    control={control}
                    name={`sections.${sectionKey}.buttonLink`}
                    label="Button Link"
                    placeholder="Enter button link"
                    error={errors.sections?.[sectionKey]?.buttonLink}
                />
            </Grid>
        </Grid>
    );
};