"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { Card } from "@mui/material";
import { CTextField, CRichTextEditor } from "components/custom";
import CImageUpload from "components/custom/inputs/CImageUpload";
import CSelectField from "components/custom/inputs/CSelectField";
import { resetBlog, storeBlog, updateBlog } from "store/slices/blogSlice";
import { DarkButton } from "components/custom/button/DarkButton";
import { moduleStatusOptions, STATUS_ACTIVE } from "utils/constants";

const getInitialValues = (currentRecord) => {
    return {
        title: currentRecord?.title || "",
        slug: currentRecord?.slug || "",
        excerpt: currentRecord?.excerpt || "",
        content: currentRecord?.content || "",
        image: currentRecord?.image || null,
        status: currentRecord?.status ?? STATUS_ACTIVE,
    };
};

const validationSchema = yup.object().shape({
    title: yup.string().trim().required("Title is required!"),
    slug: yup.string().trim().required("Slug is required!"),
    excerpt: yup.string().nullable(),
    content: yup.string().nullable(),
    image: yup.mixed().nullable(),
    status: yup.number().transform((value, originalValue) => originalValue === "" ? undefined : value).required("Status is required!"),
});

export default function Form({ isEdit, onBack, currentRecord }) {
    const { blog, isLoading } = useSelector((state) => state?.blog);
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();

    const methods = useForm({
        defaultValues: getInitialValues(currentRecord),
        resolver: yupResolver(validationSchema)
    });

    const { handleSubmit, control, watch, setValue, formState: { errors, isSubmitting }, reset } = methods;

    const watchedTitle = watch("title");

    useEffect(() => {
        if (isEdit && currentRecord) {
            reset(getInitialValues(currentRecord));
        }
    }, [isEdit, currentRecord]);

    useEffect(() => {
        if (!isEdit && watchedTitle) {
            const generatedSlug = watchedTitle
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/\s+/g, "-");
            setValue("slug", generatedSlug);
        }
    }, [watchedTitle, isEdit, setValue]);

    const onSubmit = async (formData) => {
        try {
            const action = isEdit
                ? updateBlog(currentRecord?.id, formData)
                : storeBlog(formData);

            dispatch(action)
                .then((originalPromiseResult) => {
                    reset();
                    dispatch(resetBlog());
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

    const loading = isLoading || isSubmitting;

    return (
        <Card className="p-3">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                    {/* Left section */}
                    <Grid size={{ xs: 12, md: 8 }} container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <CTextField
                                name="title"
                                type="text"
                                autoFocus
                                control={control}
                                label="Title*"
                                placeholder="Blog Title"
                                error={errors.title}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <CTextField
                                name="slug"
                                control={control}
                                label="Slug*"
                                placeholder="unique-slug"
                                error={errors.slug}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <CTextField
                                name="excerpt"
                                control={control}
                                label="Excerpt"
                                placeholder="Short summary"
                                multiline
                                rows={3}
                                error={errors.excerpt}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <CRichTextEditor
                                name="content"
                                control={control}
                                label="Content"
                                placeholder="Write blog content"
                                height="400px"
                                error={errors.content}
                            />
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
                                label="Featured Image"
                                maxFiles={1}
                                multiple={false}
                                error={errors.image}
                            />
                        </Grid>
                    </Grid>

                    <Grid size={12} display="flex" gap={2}>
                        <Button type="button" onClick={onBack} color="error" variant="contained">Cancel</Button>
                        <DarkButton loading={loading} type="submit" color="info" variant="contained">Save Changes</DarkButton>
                    </Grid>
                </Grid>
            </form>
        </Card>
    );
}


