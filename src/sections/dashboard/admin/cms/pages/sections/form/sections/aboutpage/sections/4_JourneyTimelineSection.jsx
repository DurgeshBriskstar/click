"use client";
import { Add, Delete } from "@mui/icons-material";
import { Box, Button, Divider, Grid, IconButton, Typography } from "@mui/material";
import { useFieldArray } from "react-hook-form";
import { CTextField } from "components/custom";
import CImageUpload from "components/custom/inputs/CImageUpload";

export default function JourneyTimelineSection({ control, sectionKey, errors }) {
    const { fields: highlightFields, append, remove } = useFieldArray({ control, name: `sections.${sectionKey}.highlights` });

    const canAddMore = highlightFields.length < 8;
    const canRemove = highlightFields.length > 1;

    const addHighlight = () => {
        if (canAddMore) {
            append({ image: "", title: "", description: "" });
        }
    };

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
                <Divider sx={{ my: 2 }} />
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" fontWeight={600}>
                        Milestones ({highlightFields.length}/8)
                    </Typography>
                    <Button
                        type="button"
                        variant="outlined"
                        size="small"
                        startIcon={<Add />}
                        onClick={() => addHighlight()}
                        disabled={!canAddMore}
                    >
                        Add Milestone
                    </Button>
                </Box>
            </Grid>

            <Grid size={{ xs: 12 }}>
                <Grid container spacing={3} width='100%'>
                    {highlightFields.map((field, catIndex) => {
                        return (
                            <Grid
                                key={field.id}
                                size={{ xs: 12, sm: 6, md: 2.3 }}
                                sx={{
                                    p: 2,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 2,
                                    bgcolor: 'background.paper',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
                                    }
                                }}
                            >
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                                    <Typography variant="subtitle1" fontWeight={600}>
                                        Milestone {catIndex + 1}
                                    </Typography>
                                    <IconButton
                                        type="button"
                                        onClick={() => remove(catIndex)}
                                        disabled={!canRemove}
                                        color="error"
                                        size="small"
                                        sx={{
                                            opacity: canRemove ? 1 : 0.5,
                                            cursor: canRemove ? 'pointer' : 'not-allowed'
                                        }}
                                    >
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </Box>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12 }}>
                                        <CImageUpload
                                            control={control}
                                            name={`sections.${sectionKey}.highlights.${catIndex}.image`}
                                            label="Image"
                                            maxFiles={1}
                                            multiple={false}
                                            error={errors?.sections?.[sectionKey].highlights?.[catIndex]?.image}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <CTextField
                                            control={control}
                                            name={`sections.${sectionKey}.highlights.${catIndex}.year`}
                                            label="Year"
                                            placeholder="Enter year (e.g., 2022)"
                                            onlyNumbers
                                            max={4}
                                            error={errors?.sections?.[sectionKey].highlights?.[catIndex]?.year}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <CTextField
                                            control={control}
                                            name={`sections.${sectionKey}.highlights.${catIndex}.title`}
                                            label="Title"
                                            placeholder="Enter title"
                                            error={errors?.sections?.[sectionKey].highlights?.[catIndex]?.title}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <CTextField
                                            control={control}
                                            name={`sections.${sectionKey}.highlights.${catIndex}.description`}
                                            label="Description"
                                            placeholder="Enter description"
                                            multiline
                                            rows={3}
                                            error={errors?.sections?.[sectionKey].highlights?.[catIndex]?.description}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        )
                    })}
                </Grid>
            </Grid>
        </Grid>
    );
};

