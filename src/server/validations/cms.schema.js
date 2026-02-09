import * as yup from "yup";

export const cmsPageSchema = yup.object({
    title: yup.string().required("Page title required!"),
    slug: yup.string().required("Page Slug is required!"),
    status: yup.string().required("Status title required!"),
});

export const cmsSiteSchema = yup.object({
    site_name: yup.string().required("Site name is required!"),
});