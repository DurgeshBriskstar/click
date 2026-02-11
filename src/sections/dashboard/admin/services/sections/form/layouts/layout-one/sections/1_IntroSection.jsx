"use client";
import { useFieldArray } from "react-hook-form";
import { Add, Delete } from "@mui/icons-material";
import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import { CTextField } from "components/custom";
import CImageUpload from "components/custom/inputs/CImageUpload";

export default function IntroSection({ control, sectionKey, errors }) {
    const { fields: highlightFields, append, remove } = useFieldArray({ control, name: `sections.${sectionKey}.highlights` });

    const canAddMore = highlightFields.length < 4;

    const addHighlight = () => {
        if (canAddMore) {
            append({ value: "" });
        }
    };
    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
                <CTextField
                    control={control}
                    name={`sections.${sectionKey}.title`}
                    label="Title"
                    placeholder="Enter title"
                    error={errors.sections?.[sectionKey]?.title}
                />
            </Grid>

            <Grid size={{ xs: 12 }}>
                <CTextField
                    control={control}
                    name={`sections.${sectionKey}.description`}
                    label="Description"
                    placeholder="Enter description"
                    multiline
                    rows={3}
                    error={errors.sections?.[sectionKey]?.description}
                />
            </Grid>

            <Grid size={{ xs: 12 }}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12 }}>
                                <CTextField
                                    control={control}
                                    name={`sections.${sectionKey}.leftTitle`}
                                    label="Left Title"
                                    placeholder="Enter left title"
                                    error={errors.sections?.[sectionKey]?.leftTitle}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <CTextField
                                    control={control}
                                    name={`sections.${sectionKey}.leftDescription`}
                                    label="Left Description"
                                    placeholder="Enter left description"
                                    multiline
                                    rows={3.5}
                                    error={errors.sections?.[sectionKey]?.leftDescription}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <CTextField
                                    control={control}
                                    name={`sections.${sectionKey}.button1Text`}
                                    label="Button Text"
                                    placeholder="Enter button text"
                                    error={errors.sections?.[sectionKey]?.buttonText}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <CTextField
                                    control={control}
                                    name={`sections.${sectionKey}.button1Link`}
                                    label="Button Link"
                                    placeholder="Enter button link"
                                    error={errors.sections?.[sectionKey]?.buttonLink}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12 }}>
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
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12 }}>
                                <CTextField
                                    control={control}
                                    name={`sections.${sectionKey}.rightTitle`}
                                    label="Right Title"
                                    placeholder="Enter right title"
                                    error={errors.sections?.[sectionKey]?.rightTitle}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <CTextField
                                    control={control}
                                    name={`sections.${sectionKey}.button2Text`}
                                    label="Button Text"
                                    placeholder="Enter button text"
                                    error={errors.sections?.[sectionKey]?.buttonText}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <CTextField
                                    control={control}
                                    name={`sections.${sectionKey}.button2Link`}
                                    label="Button Link"
                                    placeholder="Enter button link"
                                    error={errors.sections?.[sectionKey]?.buttonLink}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};