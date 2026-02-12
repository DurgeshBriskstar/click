"use client";
import { useFieldArray } from "react-hook-form";
import { Add, Delete } from "@mui/icons-material";
import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import { CTextField } from "components/custom";
import CImageUpload from "components/custom/inputs/CImageUpload";

export default function StatSection({ control, sectionKey, errors }) {
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
                <CImageUpload
                    control={control}
                    name={`sections.${sectionKey}.background_image`}
                    label="Image"
                    maxFiles={1}
                    multiple={false}
                    error={errors?.sections?.[sectionKey].background_image}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <CTextField
                    control={control}
                    name={`sections.${sectionKey}.title`}
                    label="Video Link Title"
                    placeholder="Enter video link title"
                    error={errors.sections?.[sectionKey]?.title}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <CTextField
                    control={control}
                    name={`sections.${sectionKey}.video_link`}
                    label="Video Link"
                    type="url"
                    placeholder="Enter video link Ex:Youtube"
                    error={errors.sections?.[sectionKey]?.video_link}
                />
            </Grid>
            <Grid size={{ xs: 12 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" fontWeight={600}>
                        Statistics ({highlightFields.length}/4)
                    </Typography>
                    <Button
                        type="button"
                        variant="outlined"
                        size="small"
                        startIcon={<Add />}
                        onClick={addHighlight}
                        disabled={!canAddMore}
                    >
                        Add Statistic
                    </Button>
                </Box>
            </Grid>
            <Grid size={{ xs: 12 }}>
                <Grid container spacing={3} width='100%'>
                    {highlightFields.map((field, catIndex) => {
                        return (
                            <Grid
                                key={field.id}
                                size={{ xs: 12, sm: 3 }}
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
                                    '&:hover': { boxShadow: '0 4px 8px rgba(0,0,0,0.15)' }
                                }}
                            >
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography variant="subtitle1" fontWeight={600}>Statistic {catIndex + 1}</Typography>
                                    <IconButton type="button" onClick={() => remove(catIndex)} color="error" size="small">
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </Box>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                                    <CTextField
                                        control={control}
                                        name={`sections.${sectionKey}.highlights.${catIndex}.title`}
                                        label="Title"
                                        placeholder="Enter title"
                                        error={errors?.sections?.[sectionKey].highlights?.[catIndex]?.title}
                                    />

                                    <CTextField
                                        control={control}
                                        name={`sections.${sectionKey}.highlights.${catIndex}.number`}
                                        label="Number"
                                        placeholder="Enter number"
                                        // onlyNumbers
                                        // max={8}
                                        error={errors?.sections?.[sectionKey].highlights?.[catIndex]?.number}
                                    />
                                </Box>
                            </Grid>
                        )
                    })}
                </Grid>
            </Grid>
        </Grid>
    );
};