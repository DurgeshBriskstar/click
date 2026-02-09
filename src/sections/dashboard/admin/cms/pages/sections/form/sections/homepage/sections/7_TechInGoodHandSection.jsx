"use client";
import { Box, Button, Divider, Grid, IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { CTextField } from "components/custom";
import CImageUpload from "components/custom/inputs/CImageUpload";
import { useFieldArray } from "react-hook-form";

export default function TechInGoodHandSection({ control, sectionKey, errors }) {
    const { fields: highlightFields, append, remove } = useFieldArray({ control, name: `sections.${sectionKey}.highlights` });

    const canAddMore = highlightFields.length < 2;
    const canRemove = highlightFields.length > 1;

    const addHighlight = () => {
        if (canAddMore) {
            append({ image: "", title: "", subtitle: "" });
        }
    };

    return (
        <Grid container spacing={5} alignItems="flex-start">
            {/* Split layout */}
            <Grid size={{ xs: 12, md: 6 }} container spacing={2} alignItems="flex-start">
                <Grid size={{ xs: 12 }}>
                    <CTextField
                        control={control}
                        name={`sections.${sectionKey}.title`}
                        label="Title"
                        placeholder="Enter section title"
                        error={errors?.sections?.[sectionKey].title}
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
                        error={errors?.sections?.[sectionKey].subtitle}
                    />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <CImageUpload
                        control={control}
                        name={`sections.${sectionKey}.background_image`}
                        label="Background image"
                        maxFiles={1}
                        multiple={false}
                        error={errors?.sections?.[sectionKey].background_image}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <CTextField
                        control={control}
                        name={`sections.${sectionKey}.buttonText`}
                        label="Button Text"
                        placeholder="Enter button text"
                        error={errors?.sections?.[sectionKey].buttonText}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <CTextField
                        control={control}
                        name={`sections.${sectionKey}.buttonLink`}
                        label="Button Link"
                        placeholder="Enter button link"
                        error={errors?.sections?.[sectionKey].buttonLink}
                    />
                </Grid>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }} container spacing={2} alignItems="flex-start">
                <Grid size={{ xs: 12 }}>
                    <CTextField
                        control={control}
                        name={`sections.${sectionKey}.second_title`}
                        label="Second Title"
                        placeholder="Enter section second title"
                        error={errors?.sections?.[sectionKey].second_title}
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" fontWeight={600}>
                            Highlights ({highlightFields.length}/2)
                        </Typography>
                        <Button type="button" variant="outlined" size="small" startIcon={<AddIcon />} onClick={() => addHighlight()} disabled={!canAddMore}>
                            Add Highlight
                        </Button>
                    </Box>
                </Grid>

                <Grid container spacing={3} width='100%'>
                    {highlightFields.map((field, hiIndex) => {
                        return (
                            <Grid key={field.id} size={{ xs: 12, sm: 6, md: 6 }}
                                sx={{
                                    p: 2.5,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 2,
                                    width: '50%',
                                    bgcolor: 'background.paper',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    transition: 'all 0.2s',
                                    '&:hover': { boxShadow: '0 4px 8px rgba(0,0,0,0.15)' }
                                }}
                            >
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography variant="subtitle1" fontWeight={600}>
                                        Highlight {hiIndex + 1}
                                    </Typography>
                                    <IconButton
                                        type="button"
                                        onClick={() => remove(hiIndex)}
                                        disabled={!canRemove}
                                        color="error"
                                        size="small"
                                        sx={{ opacity: canRemove ? 1 : 0.5, cursor: canRemove ? 'pointer' : 'not-allowed' }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Box>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                                    <CImageUpload
                                        control={control}
                                        name={`sections.${sectionKey}.highlights.${hiIndex}.image`}
                                        label="Image"
                                        maxFiles={1}
                                        multiple={false}
                                        error={errors?.sections?.[sectionKey].highlights?.[hiIndex]?.image}
                                    />

                                    <CTextField
                                        control={control}
                                        name={`sections.${sectionKey}.highlights.${hiIndex}.title`}
                                        label="Title"
                                        placeholder="Enter highlight title"
                                        error={errors?.sections?.[sectionKey].highlights?.[hiIndex]?.title}
                                    />

                                    <CTextField
                                        control={control}
                                        name={`sections.${sectionKey}.highlights.${hiIndex}.subtitle`}
                                        label="Subtitle"
                                        placeholder="Enter highlight subtitle"
                                        error={errors?.sections?.[sectionKey].highlights?.[hiIndex]?.subtitle}
                                    />
                                </Box>
                            </Grid>
                        )
                    })}
                </Grid>
            </Grid>

            <Grid size={{ xs: 12 }}>
                <Typography fontWeight={400}><b>Note: </b>This section reflects the contact number automatically from site settings module.</Typography>
            </Grid>
        </Grid>
    );
};