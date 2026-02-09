"use client";
import { useFieldArray } from "react-hook-form";
import { Box, Button, Divider, Grid, IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { CTextField } from "components/custom";
import CImageUpload from "components/custom/inputs/CImageUpload";

export default function FranchiseSection({ control, sectionKey, errors }) {
    const { fields: highlightFields, append, remove } = useFieldArray({ control, name: `sections.${sectionKey}.highlights` });

    const canAddMore = highlightFields.length < 5;

    const addHighlight = () => {
        if (canAddMore) {
            append({ value: "" });
        }
    };

    return (
        <Grid container spacing={5}>
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
                            rows={3.4}
                            error={errors.sections?.[sectionKey]?.subtitle}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <CTextField
                            control={control}
                            name={`sections.${sectionKey}.buttonText`}
                            label="Button Text"
                            placeholder="Enter button text"
                            error={errors.sections?.[sectionKey]?.buttonText}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <CTextField
                            control={control}
                            name={`sections.${sectionKey}.buttonLink`}
                            label="Button Link"
                            placeholder="Enter button link"
                            error={errors.sections?.[sectionKey]?.buttonLink}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ maxHeight: "300px" }}>
                            <CImageUpload
                                control={control}
                                name={`sections.${sectionKey}.background_image`}
                                label="Image"
                                maxFiles={1}
                                multiple={false}
                                error={errors?.sections?.[sectionKey].background_image}
                            />
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <CTextField
                            control={control}
                            name={`sections.${sectionKey}.second_title`}
                            label="Second Title"
                            placeholder="Enter second title"
                            error={errors.sections?.[sectionKey]?.second_title}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <CTextField
                            control={control}
                            name={`sections.${sectionKey}.second_subtitle`}
                            label="Second Subtitle"
                            placeholder="Enter second subtitle"
                            error={errors.sections?.[sectionKey]?.second_subtitle}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <CTextField
                            control={control}
                            name={`sections.${sectionKey}.imageButtonLink`}
                            label="Image button Link"
                            placeholder="Enter image button link"
                            error={errors.sections?.[sectionKey]?.imageButtonLink}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 2 }} />
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" fontWeight={600}>
                        Highlights
                    </Typography>
                    <Button
                        type="button"
                        variant="outlined"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={addHighlight}
                        disabled={!canAddMore}
                    >
                        Add Highlight
                    </Button>
                </Box>
            </Grid>
            {highlightFields.map((field, index) => (
                <Grid key={field.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Box display="flex" gap={2} alignItems="flex-start">
                        <Box flex={1}>
                            <CTextField
                                control={control}
                                name={`sections.${sectionKey}.highlights.${index}.title`}
                                label={`Highlight ${index + 1}`}
                                placeholder="Enter highlight"
                                error={errors?.sections?.[sectionKey]?.highlights?.[index]?.title}
                            />
                        </Box>
                        <IconButton
                            type="button"
                            onClick={() => remove(index)}
                            color="error"
                            size="small"
                            sx={{ mt: 1 }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                </Grid>
            ))}
        </Grid>
    );
};