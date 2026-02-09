"use client";
import { Grid } from "@mui/material";
import CImageUpload from "components/custom/inputs/CImageUpload";

export default function BannerSection({ control, sectionKey, errors }) {
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
        </Grid>
    );
};