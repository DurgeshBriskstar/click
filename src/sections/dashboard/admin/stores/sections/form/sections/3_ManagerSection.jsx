"use client";
import { Grid } from "@mui/material";
import { CTextField } from "components/custom";
import CImageUpload from "components/custom/inputs/CImageUpload";

export default function ManagerSection({ control, sectionKey, errors }) {
    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                        <CTextField
                            control={control}
                            name={`sections.${sectionKey}.title`}
                            label="Section Title"
                            placeholder="Enter section title"
                            error={errors.sections?.[sectionKey]?.title}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <CTextField
                            control={control}
                            name={`sections.${sectionKey}.name`}
                            label="Manager Name"
                            placeholder="Enter manager name"
                            error={errors.sections?.[sectionKey]?.name}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <CTextField
                            control={control}
                            name={`sections.${sectionKey}.designation`}
                            label="Manager Designation"
                            placeholder="Enter manager designation"
                            error={errors.sections?.[sectionKey]?.designation}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <CTextField
                            control={control}
                            name={`sections.${sectionKey}.short_intro`}
                            label="Short Intro"
                            placeholder="Enter short intro"
                            multiline
                            rows={3}
                            error={errors.sections?.[sectionKey]?.short_intro}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
                <CImageUpload
                    control={control}
                    name={`sections.${sectionKey}.background_image`}
                    label="Image"
                    maxFiles={1}
                    multiple={false}
                    error={errors?.sections?.[sectionKey].background_image}
                />
            </Grid>
        </Grid>
    );
};