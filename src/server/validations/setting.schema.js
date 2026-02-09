import * as yup from "yup";

export const settingSchema = {
    cmsPageSchema: yup.object({
        title: yup.string().required("Page title required!"),
        slug: yup.string().required("Page Slug is required!"),
        status: yup.string().required("Status title required!"),
    }),

    cmsSiteSchema: yup.object({
        site_name: yup.string().required("Site name is required!"),
    }),

    countrySchema: yup.object({
        country_name: yup.string().required("Country name is required!"),
    }),
    stateSchema: yup.object({
        state_name: yup.string().required("State name is required!"),
        country_id: yup.number().required("Country name is required!"),
    }),

    deviceSchema: yup.object({
        device_name: yup.string().required("Device name is required!"),
    }),
    brandSchema: yup.object({
        brand_name: yup.string().required("Brand name is required!"),
        device_id: yup.number().required("Device name is required!"),
    }),
    issueSchema: yup.object({
        issue_name: yup.string().required("Issue name is required!"),
    }),
};