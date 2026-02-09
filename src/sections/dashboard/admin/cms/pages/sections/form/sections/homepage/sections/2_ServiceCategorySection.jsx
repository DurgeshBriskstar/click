"use client";
import { useFieldArray } from "react-hook-form";
import { Grid, Typography, Button, IconButton, Box, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { CTextField } from "components/custom";
import CImageUpload from "components/custom/inputs/CImageUpload";

export default function ServiceCategorySection({ control, sectionKey, errors }) {
    const { fields: highlightFields, append, remove } = useFieldArray({ control, name: `sections.${sectionKey}.highlights` });

    const canAddMore = highlightFields.length < 4;
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
                <Divider sx={{ my: 2 }} />
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" fontWeight={600}>
                        Highlights ({highlightFields.length}/4)
                    </Typography>
                    <Button
                        type="button"
                        variant="outlined"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => addHighlight()}
                        disabled={!canAddMore}
                    >
                        Add Highlight
                    </Button>
                </Box>
            </Grid>

            <Grid container spacing={3} width='100%'>
                {highlightFields.map((field, catIndex) => {
                    return (
                        <Grid
                            key={field.id}
                            size={{ xs: 12, sm: 6, md: 3 }}
                            sx={{
                                p: 2.5,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                                width: '25%',
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
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="subtitle1" fontWeight={600}>
                                    Highlight {catIndex + 1}
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
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                                <CImageUpload
                                    control={control}
                                    name={`sections.${sectionKey}.highlights.${catIndex}.image`}
                                    label="Image"
                                    maxFiles={1}
                                    multiple={false}
                                    error={errors?.sections?.[sectionKey].highlights?.[catIndex]?.image}
                                />

                                <CTextField
                                    control={control}
                                    name={`sections.${sectionKey}.highlights.${catIndex}.title`}
                                    label="Title"
                                    placeholder="Enter highlight title"
                                    error={errors?.sections?.[sectionKey].highlights?.[catIndex]?.title}
                                />

                                <CTextField
                                    control={control}
                                    name={`sections.${sectionKey}.highlights.${catIndex}.description`}
                                    label="Description"
                                    placeholder="Enter highlight description"
                                    multiline
                                    rows={3}
                                    error={errors?.sections?.[sectionKey].highlights?.[catIndex]?.description}
                                />
                            </Box>
                        </Grid>
                    )
                })}
            </Grid>
        </Grid>
    );
};