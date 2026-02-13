import * as yup from "yup";

export const settingSchema = {
    cmsPageSchema: yup.object({
        title: yup.string().trim().required("Page title required!"),
        slug: yup.string().trim().required("Page Slug is required!"),
        status: yup.string().trim().required("Status title required!"),
    }),

    cmsSiteSchema: yup.object({
        site_name: yup.string().trim().required("Site name is required!"),
    }),

    countrySchema: yup.object({
        country_name: yup.string().trim().required("Country name is required!"),
    }),
    stateSchema: yup.object({
        state_name: yup.string().trim().required("State name is required!"),
        country_id: yup.number().required("Country name is required!"),
    }),

    deviceSchema: yup.object({
        device_name: yup.string().trim().required("Device name is required!"),
    }),
    brandSchema: yup.object({
        brand_name: yup.string().trim().required("Brand name is required!"),
        device_id: yup.number().required("Device name is required!"),
    }),
    issueSchema: yup.object({
        issue_name: yup.string().trim().required("Issue name is required!"),
    }),
};