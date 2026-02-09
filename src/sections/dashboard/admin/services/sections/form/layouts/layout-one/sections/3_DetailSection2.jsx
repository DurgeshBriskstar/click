"use client";
import { useFieldArray } from "react-hook-form";
import { Add, Delete } from "@mui/icons-material";
import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import { CTextField } from "components/custom";
import CImageUpload from "components/custom/inputs/CImageUpload";

export default function DetailSection2({ control, sectionKey, errors }) {
    const { fields: highlightFields, append, remove } = useFieldArray({ control, name: `sections.${sectionKey}.highlights` });

    const canAddMore = highlightFields.length < 8;

    const addHighlight = () => {
        if (canAddMore) {
            append({ value: "" });
        }
    };
    return (
        <Grid container spacing={5}>
            <Grid size={{ xs: 12 }}>
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

                    <Grid size={{ xs: 12, md: 9 }}>
                        <Grid container spacing={3}>

                            <Grid size={{ xs: 12 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography variant="h6" fontWeight={600}>
                                        Highlights ({highlightFields.length}/8)
                                    </Typography>
                                    <Button
                                        type="button"
                                        variant="outlined"
                                        size="small"
                                        startIcon={<Add />}
                                        onClick={addHighlight}
                                        disabled={!canAddMore}
                                    >
                                        Add Highlight
                                    </Button>
                                </Box>
                            </Grid>
                            {highlightFields.map((field, index) => (
                                <Grid key={field.id} size={{ xs: 12, md: 6 }}>
                                    <Box display="flex" gap={2} alignItems="flex-start">
                                        <Box flex={1}>
                                            <CTextField
                                                control={control}
                                                name={`sections.${sectionKey}.highlights.${index}.value`}
                                                label={`Highlight ${index + 1}`}
                                                placeholder="Enter highlight"
                                                error={errors?.sections?.[sectionKey]?.highlights?.[index]?.value}
                                            />
                                        </Box>
                                        <IconButton
                                            type="button"
                                            onClick={() => remove(index)}
                                            color="error"
                                            size="small"
                                            sx={{ mt: 1 }}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                        <CImageUpload
                            control={control}
                            name={`sections.${sectionKey}.image`}
                            label="Image"
                            maxFiles={1}
                            multiple={false}
                            error={errors?.sections?.[sectionKey].image}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};