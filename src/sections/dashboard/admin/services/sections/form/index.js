"use client";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useForm, useFieldArray } from "react-hook-form";
import { useSnackbar } from "notistack";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid, Card, Typography, Box, Divider, IconButton, Accordion, AccordionSummary, AccordionDetails, Dialog, DialogTitle, DialogContent, DialogActions, InputAdornment, Tooltip, } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { resetService, storeService, updateService } from "store/slices/serviceSlice";
import { moduleStatusOptions, STATUS_ACTIVE } from "utils/constants";
import { DarkButton } from "components/custom/button/DarkButton";
import { CTextField } from "components/custom";
import CImageUpload from "components/custom/inputs/CImageUpload";
import CSelectField from "components/custom/inputs/CSelectField";
import { LAYOUT_COMPONENTS, LAYOUT_OPTIONS, LAYOUT_KEY_TO_CODE, LAYOUT_CODE_TO_KEY } from "./layouts";

const generateSlug = (text) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
};

const getInitialValues = (currentRecord) => {
    let highlights = (currentRecord?.highlights?.length > 0) ? currentRecord?.highlights : [];
    let layoutCode = currentRecord?.layout_code || null;
    let layoutKey = layoutCode ? LAYOUT_CODE_TO_KEY[layoutCode] : null;
    let sections = layoutCode && currentRecord?.sections?.[layoutCode] ? currentRecord.sections[layoutCode] : {};

    return {
        service_name: currentRecord?.service_name || "",
        service_slug: currentRecord?.service_slug || "",
        short_description: currentRecord?.short_description || "",
        icon: currentRecord?.icon || null,
        image: currentRecord?.image || null,
        highlights: highlights,
        status: currentRecord?.status ?? STATUS_ACTIVE,
        detail_layout: layoutKey || null,
        sections: sections,
    };
};

const validationSchema = yup.object().shape({
    service_name: yup.string().trim().required("Service name is required!"),
    service_slug: yup.string()
        .trim()
        .required("Service slug is required!")
        .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only (e.g., my-service-name)"),
    short_description: yup.string().nullable(),
    image: yup.mixed().nullable(),
    highlights: yup.array().of(
        yup.object().shape({
            value: yup.string()
        })
    ),
    status: yup.number().transform((value, originalValue) => originalValue === "" ? undefined : value).required("Status is required!"),
});

export default function Form({ isEdit, onBack, currentRecord }) {
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const [autoGenerateSlug, setAutoGenerateSlug] = useState(!isEdit);

    const methods = useForm({
        defaultValues: getInitialValues(currentRecord),
        resolver: yupResolver(validationSchema)
    });

    const { handleSubmit, control, formState: { errors, isSubmitting }, reset, watch, setValue, getValues, unregister } = methods;
    const { fields: highlightFields, append, remove } = useFieldArray({ control, name: `highlights` });

    const canAddMore = highlightFields.length < 6;

    const addHighlight = () => {
        if (canAddMore) {
            append({ title: "" });
        }
    };

    const selectedLayoutKey = watch("detail_layout");
    const serviceName = watch("service_name");
    const serviceSlug = watch("service_slug");
    const [previewLayoutKey, setPreviewLayoutKey] = useState(null);
    const [pendingLayoutKey, setPendingLayoutKey] = useState(null);
    const SelectedLayoutComponent = LAYOUT_COMPONENTS[selectedLayoutKey] || null;

    useEffect(() => {
        if (autoGenerateSlug && serviceName) {
            const generatedSlug = generateSlug(serviceName);
            setValue("service_slug", generatedSlug, { shouldValidate: true });
        }
    }, [serviceName, autoGenerateSlug, setValue]);

    useEffect(() => {
        if (serviceName && serviceSlug) {
            const expectedSlug = generateSlug(serviceName);
            if (serviceSlug !== expectedSlug && autoGenerateSlug) {
                setAutoGenerateSlug(false);
            }
        }
    }, [serviceSlug, serviceName, autoGenerateSlug]);

    useEffect(() => {
        if (isEdit && currentRecord) {
            reset(getInitialValues(currentRecord));
            setAutoGenerateSlug(false);
        }
    }, [isEdit, currentRecord, reset]);

    const handleRegenerateSlug = () => {
        const currentName = getValues("service_name");
        if (currentName) {
            const generatedSlug = generateSlug(currentName);
            setValue("service_slug", generatedSlug, { shouldValidate: true });
            setAutoGenerateSlug(true);
        }
    };

    const handleLayoutChangeRequest = (layoutKey) => {
        if (!selectedLayoutKey || selectedLayoutKey === layoutKey) {
            applyLayoutChange(layoutKey);
            return;
        }
        setPendingLayoutKey(layoutKey);
    };

    const applyLayoutChange = (layoutKey) => {
        const layoutCode = LAYOUT_KEY_TO_CODE[layoutKey];
        const existingSections = currentRecord?.sections?.[layoutCode] || {};
        unregister("sections");
        setValue("detail_layout", layoutKey, { shouldDirty: true });
        setValue("sections", existingSections, { shouldDirty: true });
        setPendingLayoutKey(null);
    };

    const handleConfirmLayoutChange = () => {
        if (pendingLayoutKey) {
            applyLayoutChange(pendingLayoutKey);
        }
    };

    const handleCancelLayoutChange = () => {
        setPendingLayoutKey(null);
    };

    const onSubmit = async (formData) => {
        try {
            const { detail_layout, sections, ...restData } = formData;
            const layoutCode = detail_layout ? LAYOUT_KEY_TO_CODE[detail_layout] : null;

            const payload = {
                ...restData,
                layout_code: layoutCode,
                sections: layoutCode ? { [layoutCode]: sections || {} } : {},
            };

            const action = isEdit
                ? updateService(currentRecord?.id, payload)
                : storeService(payload);

            dispatch(action)
                .then((originalPromiseResult) => {
                    reset();
                    dispatch(resetService());
                    enqueueSnackbar(originalPromiseResult?.message, { variant: 'success' });
                    onBack();
                })
                .catch((rejectedValueOrSerializedError) => {
                    enqueueSnackbar((rejectedValueOrSerializedError?.message || "Something went wrong!"), { variant: 'error' });
                    console.log('rejectedValueOrSerializedError', rejectedValueOrSerializedError);
                });
        } catch (error) {
            console.log("error", error);
            enqueueSnackbar(error?.response?.data?.message || "Something went wrong!", { variant: "error" });
        }
    };

    return (
        <Card className="p-3">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3} alignItems="flex-start">
                    {/* Left section */}
                    <Grid size={{ xs: 12, md: 8 }} container spacing={3} alignItems="flex-start">
                        <Grid size={{ xs: 12, md: 6 }}>
                            <CTextField
                                name="service_name"
                                type="text"
                                autoFocus
                                control={control}
                                label="Service Name*"
                                placeholder="Service Name"
                                error={errors.service_name}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <CTextField
                                name="service_slug"
                                type="text"
                                control={control}
                                label="Service Slug*"
                                placeholder="service-slug"
                                error={errors.service_slug}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Tooltip title="Regenerate slug from service name">
                                                <IconButton
                                                    type="button"
                                                    onClick={handleRegenerateSlug}
                                                    edge="end"
                                                    size="small"
                                                >
                                                    <AutorenewIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <CTextField
                                name="short_description"
                                type="text"
                                control={control}
                                label="Short Description"
                                placeholder="Enter a brief description of the service"
                                error={errors.short_description}
                                multiline
                                rows={3}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Divider sx={{ my: 2 }} />
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6" fontWeight={600}>
                                    Highlights ({highlightFields.length}/6)
                                </Typography>
                                <Button type="button" variant="outlined" size="small" startIcon={<AddIcon />} onClick={() => addHighlight()} disabled={!canAddMore}>
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
                                            name={`highlights.${index}.title`}
                                            label={`Highlight ${index + 1}`}
                                            placeholder="Enter highlight"
                                            error={errors?.highlights?.[index]?.title}
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

                        <Grid size={{ xs: 12 }}>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle1" fontWeight={700} mb={1}>
                                {SelectedLayoutComponent ? "Service Detail Page Sections (Based on Selected Layout)" : "Choose a theme or layout from the sidebar to configure the detail page"}
                            </Typography>
                            {SelectedLayoutComponent && (
                                <Grid size={{ xs: 12 }} key={selectedLayoutKey}>
                                    <Divider sx={{ my: 2 }} />
                                    <SelectedLayoutComponent control={control} errors={errors} />
                                </Grid>
                            )}
                        </Grid>
                    </Grid>

                    {/* Right section */}
                    <Grid size={{ xs: 12, md: 4 }} container spacing={3} alignItems="flex-start" alignContent="flex-start">
                        <Grid size={{ xs: 12 }}>
                            <CSelectField
                                name="status"
                                control={control}
                                label="Status*"
                                placeholder="Choose status"
                                options={moduleStatusOptions || []}
                                error={errors.status}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <CImageUpload
                                control={control}
                                name="icon"
                                label="Service Icon"
                                maxFiles={1}
                                multiple={false}
                                error={errors.icon}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <CImageUpload
                                control={control}
                                name="image"
                                label="Service Thumbnail"
                                maxFiles={1}
                                multiple={false}
                                error={errors.image}
                            />
                        </Grid>

                        {/* Layout/theme selection accordion */}
                        <Grid size={{ xs: 12 }}>
                            <Accordion disableGutters defaultExpanded>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography fontWeight={600}>
                                        Choose layout or theme for service detail page
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container spacing={2}>
                                        {LAYOUT_OPTIONS.map((layout) => {
                                            const isSelected = selectedLayoutKey === layout.key;
                                            return (
                                                <Grid key={layout.key} size={{ xs: 12, md: 6 }}>
                                                    <Card onClick={(e) => { e.stopPropagation(); setPreviewLayoutKey(layout.key); }}
                                                        sx={{
                                                            p: 2, cursor: "pointer", border: "1px solid", borderColor: isSelected ? "primary.main" : "divider",
                                                            display: "flex", flexDirection: "column", alignItems: "center", gap: 2, textAlign: "center",
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                width: '100%', height: 100, borderRadius: 1, bgcolor: "action.hover", display: "flex", alignItems: "center",
                                                                justifyContent: "center", border: "1px dashed", borderColor: "divider", overflow: "hidden", position: "relative",
                                                                ...(layout.sample && { backgroundImage: `url(${layout.sample})`, backgroundSize: "cover", backgroundPosition: "top center", backgroundRepeat: "no-repeat", }),
                                                                "& .hover-overlay": { opacity: 0, transition: "opacity 0.3s ease", },
                                                                "&:hover .hover-overlay": { opacity: 1, },
                                                            }}
                                                        >
                                                            {layout.sample ? (
                                                                <Box className="hover-overlay" sx={{ position: "absolute", inset: 0, bgcolor: "rgba(0, 0, 0, 0.6)", display: "flex", alignItems: "center", justifyContent: "center", }}>
                                                                    <Typography variant="caption" align="center" sx={{ color: "white", fontWeight: 600, textShadow: "0 1px 2px rgba(0,0,0,0.3)", }}>
                                                                        {layout.label}
                                                                    </Typography>
                                                                </Box>
                                                            ) : (
                                                                <Typography variant="caption" align="center">{layout.label}</Typography>
                                                            )}
                                                        </Box>
                                                        <Box display="flex" justifyContent="center" gap={1} width="90%">
                                                            <Button
                                                                type="button"
                                                                variant="outlined"
                                                                color="info"
                                                                size="small"
                                                                onClick={(e) => { e.stopPropagation(); setPreviewLayoutKey(layout.key); }}
                                                            >
                                                                Preview
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant={isSelected ? "contained" : "outlined"}
                                                                color="info"
                                                                size="small"
                                                                onClick={(e) => { e.stopPropagation(); handleLayoutChangeRequest(layout.key); }}
                                                            >
                                                                Use
                                                            </Button>
                                                        </Box>
                                                    </Card>
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                    </Grid>

                    {/* Preview dialog */}
                    <Dialog open={Boolean(previewLayoutKey)} onClose={() => setPreviewLayoutKey(null)} maxWidth="md" fullWidth sx={{ backgroundColor: "#efefef00" }}>
                        <DialogTitle sx={{ backgroundColor: "#efefef", textAlign: "center", fontWeight: "700" }}>
                            {LAYOUT_OPTIONS.find((l) => l.key === previewLayoutKey)?.label || "Layout Preview"}
                        </DialogTitle>
                        <DialogContent
                            sx={{
                                backgroundColor: "#efefef",
                                padding: "0 0 0 8px", maxHeight: "70vh", overflowY: "auto",
                                "&::-webkit-scrollbar": { width: 8, },
                                "&::-webkit-scrollbar-thumb": { bgcolor: "divider", borderRadius: 4, },
                            }}
                        >
                            {(() => {
                                const previewLayout = LAYOUT_OPTIONS.find((l) => l.key === previewLayoutKey);
                                return previewLayout?.sample ? (
                                    <Box component="img" src={previewLayout.sample} alt={previewLayout.label} sx={{ width: "100%", height: "auto", display: "block", }} />
                                ) : (
                                    <Box sx={{ width: "100%", height: 320, bgcolor: "action.hover", display: "flex", alignItems: "center", justifyContent: "center", }}>
                                        <Typography variant="subtitle2" align="center">
                                            {previewLayout?.label || "Layout preview"}
                                        </Typography>
                                    </Box>
                                );
                            })()}
                        </DialogContent>
                        <DialogActions sx={{ backgroundColor: "#efefef" }}>
                            <Button onClick={() => setPreviewLayoutKey(null)} color="inherit">Close</Button>
                            {previewLayoutKey && (
                                <Button onClick={() => { handleLayoutChangeRequest(previewLayoutKey); setPreviewLayoutKey(null); }} color="info" variant="contained">
                                    Use this layout
                                </Button>
                            )}
                        </DialogActions>
                    </Dialog>

                    {/* Layout change confirmation dialog */}
                    <Dialog open={Boolean(pendingLayoutKey)} onClose={handleCancelLayoutChange} maxWidth="xs" fullWidth>
                        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
                            Switch Layout?
                        </DialogTitle>
                        <DialogContent sx={{ pb: 0 }}>
                            <Typography variant="body2" color="text.secondary">
                                Switching to a different layout will erase all the content you have entered for the current layout. This action cannot be undo.
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Are you sure you want to continue?
                            </Typography>
                        </DialogContent>
                        <DialogActions sx={{
                            paddingBottom: '24px',
                            paddingRight: '24px',

                        }}>
                            <Button onClick={handleCancelLayoutChange} color="inherit">
                                Cancel
                            </Button>
                            <Button onClick={handleConfirmLayoutChange} color="error" variant="contained">
                                Yes, Switch Layout
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Grid size={12} display="flex" gap={2}>
                        <Button type="button" onClick={onBack} color="error" variant="contained">Cancel</Button>
                        <DarkButton loading={isSubmitting} type="submit" color="info" variant="contained">Save Changes</DarkButton>
                    </Grid>
                </Grid>
            </form>
        </Card>
    );
}