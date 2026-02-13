import * as yup from "yup";

export const cmsPageSchema = yup.object({
    title: yup.string().trim().required("Page title required!"),
    slug: yup.string().trim().required("Page Slug is required!"),
    status: yup.string().trim().required("Status title required!"),
});

export const cmsSiteSchema = yup.object({
    site_name: yup.string().trim().required("Site name is required!"),
});