"use client";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { Card, InputAdornment, IconButton, Tooltip, Accordion, AccordionSummary, Typography, AccordionDetails, Divider, Dialog, DialogTitle, DialogContent, Box, DialogActions, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import Facebook from "@mui/icons-material/Facebook";
import YouTube from "@mui/icons-material/YouTube";
import { Instagram, LinkedIn, LocationPin, Mail, X, Google } from "@mui/icons-material";
import { resetStore, storeStore, updateStore } from "store/slices/storeSlice";
import { moduleStatusOptions, STATUS_ACTIVE } from "utils/constants";
import { CTextField } from "components/custom";
import CImageUpload from "components/custom/inputs/CImageUpload";
import CSelectField from "components/custom/inputs/CSelectField";
import { DarkButton } from "components/custom/button/DarkButton";
import { FAQSection, GenericSection, PartnerSection, TestimonialSection, ServiceSection } from "sections/dashboard/admin/cms/pages/sections/form/sections/common-sections";
import BannerSection from "./sections/1_BannerSection";
import IntroSection from "./sections/2_IntroSection";
import sampleLayout from "/public/backend-assets/stores/store-layout1.png";
import ManagerSection from "./sections/3_ManagerSection";
import StoreInfoSection from "./sections/5_StoreInfoSection";
import MapSection from "./sections/4_MapSection";
import CSoftPhoneInput from "components/custom/inputs/CPhoneInput";

const sectionConfigs = [
    { section_key: "banner_section", label: "Banner Section" },
    { section_key: "intro_section", label: "Intro Section" },
    { section_key: "manager_section", label: "Manager Section" },
    { section_key: "map_section", label: "Map Section" },
    { section_key: "store_info_section", label: "Store Info Section" },
    { section_key: "services_section", label: "Services Section" },
    { section_key: "testimonials_section", label: "Testimonials Section" },
    { section_key: "faqs_section", label: "FAQ's Section" },
    { section_key: "partners_section", label: "Partners Section" },
];

const generateSlug = (text) => {
    return text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
};

const getInitialValues = (currentRecord) => {
    return {
        store_name: currentRecord?.store_name || "",
        store_slug: currentRecord?.store_slug || "",
        image: currentRecord?.image || null,
        highlevel_location_id: currentRecord?.highlevel_location_id || "",
        highlevel_api_key: currentRecord?.highlevel_api_key || "",
        sections: currentRecord?.sections || {},
        contact_us: {
            title: currentRecord?.contact_us?.title || "",
            subtitle: currentRecord?.contact_us?.subtitle || "",
            store_address: currentRecord?.contact_us?.store_address || "",
            store_hours: currentRecord?.contact_us?.store_hours || "",
            store_email: currentRecord?.contact_us?.store_email || "",
            store_phone: currentRecord?.contact_us?.store_phone || "",
        },
        social_links: {
            facebook_link: currentRecord?.social_links?.facebook_link || "",
            twitter_link: currentRecord?.social_links?.twitter_link || "",
            linkedin_link: currentRecord?.social_links?.linkedin_link || "",
            instagram_link: currentRecord?.social_links?.instagram_link || "",
            location_link: currentRecord?.social_links?.location_link || "",
            google_plus_link: currentRecord?.social_links?.google_plus_link || "",
            email_address: currentRecord?.social_links?.email_address || "",
            youtube_link: currentRecord?.social_links?.youtube_link || "",
        },
        settings: {
            contact_form_id: currentRecord?.settings?.contact_form_id || "",
            contact_form_iframe: currentRecord?.settings?.contact_form_iframe || "",
            appointment_calendar_form_id: currentRecord?.settings?.appointment_calendar_form_id || "",
            appointment_calendar_form_iframe: currentRecord?.settings?.appointment_calendar_form_iframe || "",
        },
        status: currentRecord?.status ?? STATUS_ACTIVE,
    };
};

const validationSchema = yup.object().shape({
    store_name: yup.string().required("Store name is required!"),
    store_slug: yup.string()
        .required("Store slug is required!")
        .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only (e.g., my-store-name)"),
    contact_us: yup.object().shape({
        store_address: yup.string().required("Store address is required!"),
        store_hours: yup.string().nullable(),
        store_email: yup.string().email("Invalid email format").nullable(),
        store_phone: yup.string().nullable(),
    }),
    social_links: yup.object().shape({
        facebook_link: yup.string().url("Invalid URL format").nullable(),
        twitter_link: yup.string().url("Invalid URL format").nullable(),
        linkedin_link: yup.string().url("Invalid URL format").nullable(),
        instagram_link: yup.string().url("Invalid URL format").nullable(),
        location_link: yup.string().url("Invalid URL format").nullable(),
        google_plus_link: yup.string().url("Invalid URL format").nullable(),
        email_address: yup.string().email("Invalid email format").nullable(),
        youtube_link: yup.string().url("Invalid URL format").nullable(),
    }),
    image: yup.mixed().nullable(),
    highlevel_location_id: yup.string().nullable(),
    highlevel_api_key: yup.string().nullable(),
    status: yup.number().transform((value, originalValue) => originalValue === "" ? undefined : value).required("Status is required!"),
});

export default function Form({ isEdit, onBack, currentRecord, isStoreAdminEdit = false }) {
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const [autoGenerateSlug, setAutoGenerateSlug] = useState(!isEdit);
    const [previewLayout, setPreviewLayout] = useState(false);
    const [activeTab, setActiveTab] = useState("detail_page_cms");

    const methods = useForm({
        defaultValues: getInitialValues(currentRecord),
        resolver: yupResolver(validationSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange'
    });

    const { handleSubmit, control, formState: { errors, isSubmitting }, reset, watch, setValue, getValues } = methods;

    const storeName = watch("store_name");
    const storeSlug = watch("store_slug");

    useEffect(() => {
        if (autoGenerateSlug && storeName) {
            const generatedSlug = generateSlug(storeName);
            setValue("store_slug", generatedSlug, { shouldValidate: true });
        }
    }, [storeName, autoGenerateSlug, setValue]);

    useEffect(() => {
        if (storeName && storeSlug) {
            const expectedSlug = generateSlug(storeName);
            if (storeSlug !== expectedSlug && autoGenerateSlug) {
                setAutoGenerateSlug(false);
            }
        }
    }, [storeSlug, storeName, autoGenerateSlug]);

    useEffect(() => {
        if (isEdit && currentRecord) {
            reset(getInitialValues(currentRecord));
            setAutoGenerateSlug(false);
        }
    }, [isEdit, currentRecord, reset]);

    const handleRegenerateSlug = () => {
        const currentName = getValues("store_name");
        if (currentName) {
            const generatedSlug = generateSlug(currentName);
            setValue("store_slug", generatedSlug, { shouldValidate: true });
            setAutoGenerateSlug(true);
        }
    };

    // Helper function to check if an object has any errors
    const hasErrors = (errorObj) => {
        if (!errorObj || errorObj === null || errorObj === undefined) return false;
        if (typeof errorObj !== 'object') return false;

        if (Array.isArray(errorObj)) {
            return errorObj.some(item => hasErrors(item));
        }

        return Object.keys(errorObj).some(key => {
            const value = errorObj[key];
            if (value && typeof value === 'object') {
                return hasErrors(value);
            }
            return Boolean(value);
        });
    };

    const hasDetailPageErrors = hasErrors(errors.sections);
    const hasContactUsErrors = hasErrors(errors.contact_us);
    const hasSocialLinksErrors = hasErrors(errors.social_links);
    const hasSettingsErrors = hasErrors(errors.settings);

    const onSubmit = async (formData) => {
        try {
            const action = isEdit
                ? updateStore(currentRecord?.id, formData)
                : storeStore(formData);

            dispatch(action)
                .then((originalPromiseResult) => {
                    reset();
                    dispatch(resetStore());
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
                <Grid container spacing={3}>
                    {/* Left section */}
                    <Grid size={{ xs: 12, md: 8 }} container spacing={3} alignItems="flex-start" alignContent="flex-start">

                        <Grid size={{ xs: 12, md: 12 }} container spacing={3} alignItems="flex-start" alignContent="flex-start">
                            <Grid size={{ xs: 12, md: 6 }}>
                                <CTextField
                                    name="store_name"
                                    type="text"
                                    autoFocus={!isStoreAdminEdit}
                                    control={control}
                                    label="Store Name*"
                                    placeholder="Store Name"
                                    error={errors.store_name}
                                    disabled={isStoreAdminEdit}
                                    sx={isStoreAdminEdit ? {
                                        "& .MuiInputBase-input.Mui-disabled": {
                                            WebkitTextFillColor: "rgba(0, 0, 0, 0.72)",
                                            color: "text.primary",
                                        },
                                    } : undefined}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <CTextField
                                    name="store_slug"
                                    type="text"
                                    control={control}
                                    label="Store Slug*"
                                    placeholder="store-slug"
                                    error={errors.store_slug}
                                    disabled={isStoreAdminEdit}
                                    sx={isStoreAdminEdit ? {
                                        "& .MuiInputBase-input.Mui-disabled": {
                                            WebkitTextFillColor: "rgba(0, 0, 0, 0.72)",
                                            color: "text.primary",
                                        },
                                    } : undefined}
                                    InputProps={{
                                        ...(!isStoreAdminEdit && {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Tooltip title="Regenerate slug from store name">
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
                                        }),
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                            <TabContext value={activeTab}>
                                <Box sx={{ borderBottom: 1, borderColor: "grey.300", bgcolor: "grey.400", borderRadius: "10px 10px 0 0", }}>
                                    <TabList
                                        onChange={(e, newValue) => setActiveTab(newValue)}
                                        variant="scrollable"
                                        sx={{
                                            minHeight: 48,
                                            "& .MuiTabs-indicator": {
                                                height: 3,
                                                borderRadius: "3px 3px 0 0",
                                                backgroundColor: "primary.main",
                                            },
                                            "& .MuiTab-root": {
                                                textTransform: "none",
                                                fontWeight: 600,
                                                fontSize: "0.9rem",
                                                minHeight: 48,
                                                px: 3,
                                                color: "text.secondary",
                                                "&.Mui-selected": {
                                                    color: "primary.main",
                                                    bgcolor: "grey.200",
                                                    borderRadius: "10px 10px 0 0",
                                                },
                                                "&:hover": {
                                                    color: "primary.main",
                                                    bgcolor: "action.hover",
                                                },
                                            },
                                        }}
                                    >
                                        <Tab
                                            value="detail_page_cms"
                                            label={
                                                <Box component="span" sx={{ color: hasDetailPageErrors ? "text.error" : "inherit", display: "inline-block", }}>
                                                    Detail Page CMS
                                                </Box>
                                            }
                                        />
                                        <Tab
                                            value="contact_us_cms"
                                            label={
                                                <Box component="span" sx={{ color: hasContactUsErrors ? "text.error" : "inherit", display: "inline-block", }}>
                                                    Contact Us Page CMS
                                                </Box>
                                            }
                                        />
                                        <Tab
                                            value="social_links"
                                            label={
                                                <Box component="span" sx={{ color: hasSocialLinksErrors ? "text.error" : "inherit", display: "inline-block", }}>
                                                    Social Links
                                                </Box>
                                            }
                                        />
                                        <Tab
                                            value="settings"
                                            label={
                                                <Box component="span" sx={{ color: hasSettingsErrors ? "text.error" : "inherit", display: "inline-block", }}>
                                                    Settings (Highlevel Forms)
                                                </Box>
                                            }
                                        />
                                    </TabList>
                                </Box>

                                {/* Tab 1: Detail Page CMS */}
                                <TabPanel value="detail_page_cms" sx={{ px: 2, pt: 3, pb: 2, border: "1px solid", borderColor: "grey.300", borderTop: 0, borderRadius: "0 0 8px 8px", bgcolor: "background.paper" }}>
                                    <Typography variant="subtitle1" fontWeight={700} mb={3} display="flex" justifyContent="space-between">
                                        Store Detail Page Sections
                                        <Tooltip title="This is just a sample layout to show how the page will look when it's displayed.">
                                            <Button type="button" variant="outlined" color="info" size="small" onClick={() => setPreviewLayout(true)}>Preview Sample Layout</Button>
                                        </Tooltip>
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 12 }}>
                                            {sectionConfigs.map((config, index) => (
                                                <Accordion defaultExpanded={index === 0} key={config.section_key} elevation={2} sx={{ mb: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.2)', '&:before': { display: 'none' } }}>
                                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                        <Typography fontWeight={600}>{config.label}</Typography>
                                                    </AccordionSummary>

                                                    <AccordionDetails>
                                                        {(() => {
                                                            switch (config.section_key) {
                                                                case "banner_section":
                                                                    return <BannerSection control={control} index={index} sectionKey={config.section_key} errors={errors} />;
                                                                case "intro_section":
                                                                    return <IntroSection control={control} index={index} sectionKey={config.section_key} errors={errors} />;
                                                                case "manager_section":
                                                                    return <ManagerSection control={control} index={index} sectionKey={config.section_key} errors={errors} />;
                                                                case "map_section":
                                                                    return <MapSection control={control} index={index} sectionKey={config.section_key} errors={errors} />;
                                                                case "store_info_section":
                                                                    return <StoreInfoSection control={control} index={index} sectionKey={config.section_key} errors={errors} />;
                                                                case "services_section":
                                                                    return <ServiceSection control={control} index={index} sectionKey={config.section_key} errors={errors} />;
                                                                case "testimonials_section":
                                                                    return <TestimonialSection control={control} index={index} sectionKey={config.section_key} errors={errors} />;
                                                                case "faqs_section":
                                                                    return <FAQSection control={control} index={index} sectionKey={config.section_key} errors={errors} />;
                                                                case "partners_section":
                                                                    return <PartnerSection control={control} index={index} sectionKey={config.section_key} errors={errors} />;
                                                                default:
                                                                    return <GenericSection control={control} index={index} sectionKey={config.section_key} errors={errors} />;
                                                            }
                                                        })()}
                                                    </AccordionDetails>
                                                </Accordion>
                                            ))}
                                        </Grid>
                                    </Grid>
                                </TabPanel>

                                {/* Tab 2: Contact Us Page CMS */}
                                <TabPanel value="contact_us_cms" sx={{ px: 2, pt: 3, pb: 2, border: "1px solid", borderColor: "grey.300", borderTop: 0, borderRadius: "0 0 8px 8px", bgcolor: "background.paper" }}>
                                    <Typography variant="subtitle1" fontWeight={700} mb={3}>
                                        Contact Information
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 12 }}>
                                            <CTextField
                                                control={control}
                                                name={`contact_us.title`}
                                                label="Title"
                                                placeholder="Enter section title"
                                                error={errors.contact_us?.title}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <CTextField
                                                control={control}
                                                name={`contact_us.subtitle`}
                                                label="Subtitle"
                                                placeholder="Enter section subtitle"
                                                multiline
                                                rows={3}
                                                error={errors.contact_us?.subtitle}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <CTextField
                                                control={control}
                                                name="contact_us.store_address"
                                                label="Store Address*"
                                                placeholder="Enter store address"
                                                error={errors.contact_us?.store_address}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <CTextField
                                                control={control}
                                                name="contact_us.store_hours"
                                                label="Business Hours"
                                                placeholder="Ex: Mon - Sat     10:00AM - 07:00PM"
                                                error={errors.contact_us?.store_hours}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <CTextField
                                                control={control}
                                                name="contact_us.store_email"
                                                type="email"
                                                label="Store Email"
                                                placeholder="Enter store email"
                                                error={errors.contact_us?.store_email}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <CSoftPhoneInput
                                                name="contact_us.store_phone"
                                                control={control}
                                                label="Store Phone"
                                                placeholder="Enter store phone"
                                                onlyNumbers
                                                error={errors.contact_us?.store_phone}
                                            />
                                        </Grid>
                                    </Grid>
                                </TabPanel>

                                {/* Tab 3: Social Links */}
                                <TabPanel value="social_links" sx={{ px: 2, pt: 3, pb: 2, border: "1px solid", borderColor: "grey.300", borderTop: 0, borderRadius: "0 0 8px 8px", bgcolor: "background.paper" }}>
                                    <Typography variant="subtitle1" fontWeight={700} mb={3}>
                                        Social Media Links
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                            <CTextField
                                                name="social_links.facebook_link"
                                                type="text"
                                                control={control}
                                                label="Facebook"
                                                placeholder="https://example.com"
                                                slotProps={{ input: { startAdornment: <Facebook fontSize="small" color="info" sx={{ mr: 1 }} /> } }}
                                                error={errors.social_links?.facebook_link}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                            <CTextField
                                                name="social_links.twitter_link"
                                                type="text"
                                                control={control}
                                                label="X (Twitter)"
                                                placeholder="https://example.com"
                                                slotProps={{ input: { startAdornment: <X fontSize="small" color="info" sx={{ mr: 1 }} /> } }}
                                                error={errors.social_links?.twitter_link}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                            <CTextField
                                                name="social_links.linkedin_link"
                                                type="text"
                                                control={control}
                                                label="Linkedin"
                                                placeholder="https://example.com"
                                                slotProps={{ input: { startAdornment: <LinkedIn fontSize="small" color="info" sx={{ mr: 1 }} /> } }}
                                                error={errors.social_links?.linkedin_link}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                            <CTextField
                                                name="social_links.instagram_link"
                                                type="text"
                                                control={control}
                                                label="Instagram"
                                                placeholder="https://example.com"
                                                slotProps={{ input: { startAdornment: <Instagram fontSize="small" color="info" sx={{ mr: 1 }} /> } }}
                                                error={errors.social_links?.instagram_link}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                            <CTextField
                                                name="social_links.location_link"
                                                type="text"
                                                control={control}
                                                label="Location URL"
                                                placeholder="https://example.com"
                                                slotProps={{ input: { startAdornment: <LocationPin fontSize="small" color="info" sx={{ mr: 1 }} /> } }}
                                                error={errors.social_links?.location_link}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                            <CTextField
                                                name="social_links.google_plus_link"
                                                type="text"
                                                control={control}
                                                label="Google Plus"
                                                placeholder="https://example.com"
                                                slotProps={{ input: { startAdornment: <Google fontSize="small" color="info" sx={{ mr: 1 }} /> } }}
                                                error={errors.social_links?.google_plus_link}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                            <CTextField
                                                name="social_links.email_address"
                                                type="text"
                                                control={control}
                                                label="Email Address"
                                                placeholder="test@example.com"
                                                slotProps={{ input: { startAdornment: <Mail fontSize="small" color="info" sx={{ mr: 1 }} /> } }}
                                                error={errors.social_links?.email_address}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                            <CTextField
                                                name="social_links.youtube_link"
                                                type="text"
                                                control={control}
                                                label="Youtube"
                                                placeholder="https://example.com"
                                                slotProps={{ input: { startAdornment: <YouTube fontSize="small" color="info" sx={{ mr: 1 }} /> } }}
                                                error={errors.social_links?.youtube_link}
                                            />
                                        </Grid>
                                    </Grid>
                                </TabPanel>

                                {/* Tab 2: Contact Us Page CMS */}
                                <TabPanel value="settings" sx={{ px: 2, pt: 3, pb: 2, border: "1px solid", borderColor: "grey.300", borderTop: 0, borderRadius: "0 0 8px 8px", bgcolor: "background.paper" }}>
                                    <Typography variant="subtitle1" fontWeight={700} mb={3}>
                                        Settings: Highlevel Configurations
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 12 }}>
                                            <Grid container spacing={3}>
                                                <Grid size={{ xs: 12, md: 6 }} sx={{ bgcolor: "#e7e7e75c", p: 2, borderRadius: 2 }}>
                                                    <Grid container spacing={3}>
                                                        <Grid size={{ xs: 12 }}>
                                                            <CTextField
                                                                control={control}
                                                                name={`settings.contact_form_id`}
                                                                label="Contact Form Id"
                                                                placeholder="Enter contact form id"
                                                                error={errors.settings?.contact_form_id}
                                                            />
                                                        </Grid>
                                                        <Grid size={{ xs: 12 }}>
                                                            <CTextField
                                                                control={control}
                                                                name={`settings.contact_form_iframe`}
                                                                label="Contact Form IFrame"
                                                                placeholder="Enter contact form iframe"
                                                                multiline
                                                                rows={3}
                                                                error={errors.settings?.contact_form_iframe}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 6 }} sx={{ bgcolor: "#e7e7e75c", p: 2, borderRadius: 2 }}>
                                                    <Grid container spacing={3}>
                                                        <Grid size={{ xs: 12 }}>
                                                            <CTextField
                                                                control={control}
                                                                name={`settings.appointment_calendar_form_id`}
                                                                label="Appointment Calendar Id"
                                                                placeholder="Enter appointment calendar id"
                                                                error={errors.settings?.appointment_calendar_form_id}
                                                            />
                                                        </Grid>
                                                        <Grid size={{ xs: 12 }}>
                                                            <CTextField
                                                                control={control}
                                                                name={`settings.appointment_calendar_form_iframe`}
                                                                label="Appointment Calendar Form IFrame"
                                                                placeholder="Enter appointment calendar form iframe"
                                                                multiline
                                                                rows={3}
                                                                error={errors.settings?.appointment_calendar_form_iframe}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </TabPanel>
                            </TabContext>
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

                        <Grid size={{ xs: 12 }}>
                            <CImageUpload
                                control={control}
                                name="image"
                                label="Store Image"
                                maxFiles={1}
                                multiple={false}
                                error={errors.image}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <CTextField
                                name="highlevel_location_id"
                                type="text"
                                control={control}
                                label="Highlevel Location Id"
                                placeholder="Enter Highlevel Location Id"
                                error={errors.highlevel_location_id}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <CTextField
                                name="highlevel_api_key"
                                type="text"
                                control={control}
                                label="Highlevel API Key"
                                placeholder="Enter Highlevel API Key"
                                multiline
                                rows={6}
                                error={errors.highlevel_api_key}
                            />
                        </Grid>
                    </Grid>

                    <Grid size={12} display="flex" gap={2}>
                        <Button type="button" onClick={onBack} color="error" variant="contained">Cancel</Button>
                        <DarkButton loading={isSubmitting} type="submit" color="info" variant="contained">Save Changes</DarkButton>
                    </Grid>
                </Grid>
            </form>
            {/* Preview dialog */}
            <Dialog open={Boolean(previewLayout)} onClose={() => setPreviewLayout(false)} maxWidth="md" fullWidth sx={{ backgroundColor: "#efefef00" }}>
                <DialogTitle sx={{ backgroundColor: "#efefef", textAlign: "center", fontWeight: "700" }}>Service Detail Page Sample Layout</DialogTitle>
                <DialogContent sx={{ backgroundColor: "#efefef", padding: "0 0 0 8px", maxHeight: "70vh", overflowY: "auto", "&::-webkit-scrollbar": { width: 8, }, "&::-webkit-scrollbar-thumb": { bgcolor: "divider", borderRadius: 4, }, }}>
                    {previewLayout && <Box component="img" src={sampleLayout?.src} alt={"Store Detail Page"} sx={{ width: "100%", height: "auto", display: "block", }} />}
                </DialogContent>
                <DialogActions sx={{ backgroundColor: "#efefef" }}>
                    <Button onClick={() => setPreviewLayout(false)} color="inherit">Close</Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
}

