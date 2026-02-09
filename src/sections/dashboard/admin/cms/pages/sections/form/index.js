"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Card, Grid, Button, Accordion, AccordionSummary, AccordionDetails, MenuItem, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { liveSlug } from "utils/formats";
import { cmsPagesOptions, cmsPageStatusOptions } from "utils/constants";
import { resetPage, storePage, updatePage } from "store/slices/cmsSlice";
import { CTextField } from "components/custom";
import HomePageSections from "./sections/homepage";
import CSelectField from "components/custom/inputs/CSelectField";
import { DarkButton } from "components/custom/button/DarkButton";
import AboutPageSections from "./sections/aboutpage";
import LocationPageSections from "./sections/locationpage";
import ContactPageSections from "./sections/contactpage";
import BlogListPageSections from "./sections/blogspage";
import ServiceListPageSections from "./sections/servicelistpage";
import FranchisePageSections from "./sections/franchisepage";
import AppointmentPageSections from "./sections/appointment";
import PrivacyPageSections from "./sections/privacypage";
import TermsPageSections from "./sections/termspage";

const getInitialValues = (currentRecord) => {
    return {
        page_key: currentRecord?.page_key || "",
        title: currentRecord?.title || "",
        slug: currentRecord?.slug || "",
        status: currentRecord?.status || "published",
        sections: currentRecord?.sections || {},
        meta: currentRecord?.meta || { title: "", description: "", keywords: "" }
    };
};

const validationSchema = (isEdit) =>
    yup.object({
        page_key: isEdit ? yup.string() : yup.string().required("Page key is required!"),
        title: yup.string().required("Page title required!"),
        slug: yup.string().required("Page Slug is required!"),
        status: yup.string().required("Status is required!"),
    });

export default function Form({ isEdit, onBack, currentRecord }) {
    const { enqueueSnackbar } = useSnackbar();
    const { page, isLoading } = useSelector((state) => state?.cms);
    const dispatch = useDispatch();

    const methods = useForm({
        defaultValues: getInitialValues(currentRecord),
        resolver: yupResolver(validationSchema(isEdit))
    });

    const { handleSubmit, control, watch, setValue, formState: { errors, isSubmitting }, reset } = methods;
    const slugValue = watch("slug");
    const pageKey = watch("page_key");

    useEffect(() => {
        if (isEdit && currentRecord) {
            reset(getInitialValues(currentRecord));
        }
    }, [isEdit, currentRecord]);

    useEffect(() => {
        if (slugValue) {
            const formatted = liveSlug(slugValue)
            if (formatted !== slugValue) {
                setValue("slug", formatted, { shouldValidate: true });
            }
        }
    }, [slugValue, setValue]);

    const onSubmit = async (formData) => {
        try {
            const action = isEdit
                ? updatePage(currentRecord?.id, formData)
                : storePage(formData);

            dispatch(action)
                .then((originalPromiseResult) => {
                    reset();
                    dispatch(resetPage());
                    enqueueSnackbar(originalPromiseResult?.message, { variant: 'success' });
                    onBack();
                })
                .catch((rejectedValueOrSerializedError) => {
                    enqueueSnackbar((rejectedValueOrSerializedError?.message || "Something went wrong!"), { variant: 'error' });
                    console.log('rejectedValueOrSerializedError', rejectedValueOrSerializedError);
                });
        } catch (error) {
            console.log("error", error);
            enqueueSnackbar(error?.response?.data?.message || error?.message || "Something went wrong!", { variant: "error" });
        }
    };

    const loading = isLoading || isSubmitting;

    return (
        <Card className="p-3">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3} mb={3}>
                    {
                        !isEdit &&
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <CSelectField
                                name="page_key"
                                control={control}
                                label="Page Key*"
                                placeholder="Choose one : homepage, aboutpage, examplepage"
                                options={cmsPagesOptions || []}
                                error={errors.page_key}
                            />
                        </Grid>
                    }

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <CTextField
                            name="title"
                            label="Page Title*"
                            placeholder="Home / About / Services"
                            control={control}
                            error={errors.title}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <CTextField
                            name="slug"
                            label="Page Slug*"
                            placeholder="example: about-us"
                            control={control}
                            error={errors.slug}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <CSelectField
                            name="status"
                            control={control}
                            label="Status*"
                            placeholder="Choose one"
                            options={cmsPageStatusOptions || []}
                            error={errors.status}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                        {(() => {
                            switch (pageKey) {
                                case "homepage":
                                    return <HomePageSections control={control} errors={errors} />;
                                case "aboutpage":
                                    return <AboutPageSections control={control} errors={errors} />;
                                case "franchisepage":
                                    return <FranchisePageSections control={control} errors={errors} />;
                                case "servicelistpage":
                                    return <ServiceListPageSections control={control} errors={errors} />;
                                case "locationpage":
                                    return <LocationPageSections control={control} errors={errors} />;
                                case "contactpage":
                                    return <ContactPageSections control={control} errors={errors} />;
                                case "bloglistpage":
                                    return <BlogListPageSections control={control} errors={errors} />;
                                case "appointmentpage":
                                    return <AppointmentPageSections control={control} errors={errors} />;
                                case "privacypage":
                                    return <PrivacyPageSections control={control} errors={errors} />;
                                case "termspage":
                                    return <TermsPageSections control={control} errors={errors} />;

                                default:
                                    return <></>;
                            }
                        })()}
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Accordion elevation={2} sx={{ mb: 2, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.2)', '&:before': { display: 'none' } }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography fontWeight={600}>Meta SEO Settings</Typography>
                            </AccordionSummary>

                            <AccordionDetails>
                                <Grid container spacing={3}>

                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <CTextField
                                            control={control}
                                            name="meta.title"
                                            label="Meta Title"
                                            placeholder="Meta Title"
                                            error={errors?.meta?.title}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <CTextField
                                            control={control}
                                            name="meta.keywords"
                                            label="Meta Keywords"
                                            placeholder="SEO, Marketing, Best"
                                            error={errors?.meta?.keywords}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12 }}>
                                        <CTextField
                                            control={control}
                                            name="meta.description"
                                            label="Meta Description"
                                            placeholder="Meta Description"
                                            multiline
                                            rows={3}
                                            error={errors?.meta?.description}
                                        />
                                    </Grid>

                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>

                    <Grid size={12} display="flex" gap={2} mt={2}>
                        <Button type="button" onClick={onBack} color="error" variant="contained">Cancel</Button>
                        <DarkButton loading={loading} type="submit" color="info" variant="contained">Save Changes</DarkButton>
                    </Grid>
                </Grid>
            </form >
        </Card >
    );
}