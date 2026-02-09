"use client";
import { Box, Grid, Typography } from "@mui/material";
import { CTextField } from "components/custom";
import CCheckbox from "components/custom/inputs/CCheckbox";
import CImageUpload from "components/custom/inputs/CImageUpload";
import { FlexBox } from "components/flex-box";

export default function StoreInfoSection({ control, sectionKey, errors }) {

    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
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
                            error={errors.sections?.[sectionKey]?.subtitle}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="body2" fontWeight={500} color="text.secondary">
                            Show:
                        </Typography>
                        <FlexBox alignItems="center" flexWrap="wrap" gap={1}>
                            <CCheckbox
                                control={control}
                                name={`sections.${sectionKey}.show_address`}
                                label="Address"
                            />
                            <CCheckbox
                                control={control}
                                name={`sections.${sectionKey}.show_email`}
                                label="Email"
                            />
                            <CCheckbox
                                control={control}
                                name={`sections.${sectionKey}.show_phone`}
                                label="Phone"
                            />
                            <CCheckbox
                                control={control}
                                name={`sections.${sectionKey}.show_business_hours`}
                                label="Business Hours"
                            />
                            <CCheckbox
                                control={control}
                                name={`sections.${sectionKey}.show_social_links`}
                                label="Social Links"
                            />
                        </FlexBox>
                    </Grid>
                </Grid>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
                <CImageUpload
                    control={control}
                    name={`sections.${sectionKey}.background_image`}
                    label="Card Background Image"
                    maxFiles={1}
                    multiple={false}
                    error={errors?.sections?.[sectionKey].background_image}
                />
            </Grid>
        </Grid>
    );
};