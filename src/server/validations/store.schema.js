import * as yup from "yup";

export const storeSchema = yup.object({
    store_name: yup.string().required("Store name is required!"),
    store_slug: yup.string()
        .required("Store slug is required!")
        .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only"),
    image: yup.mixed().nullable(),
    highlevel_location_id: yup.string().nullable(),
    highlevel_api_key: yup.string().nullable(),
    sections: yup.mixed().nullable(),
    contact_us: yup.object({
        store_address: yup.string().required("Store address is required!"),
        store_hours: yup.string().nullable(),
        store_email: yup.string().nullable(),
        store_phone: yup.string().nullable(),
    }).nullable(),
    social_links: yup.object({
        facebook_link: yup.string().nullable(),
        twitter_link: yup.string().nullable(),
        linkedin_link: yup.string().nullable(),
        instagram_link: yup.string().nullable(),
        location_link: yup.string().nullable(),
        google_plus_link: yup.string().nullable(),
        email_address: yup.string().nullable(),
        youtube_link: yup.string().nullable(),
    }).nullable(),
    status: yup.number().transform((value, originalValue) => originalValue === "" ? undefined : value).required("Status is required!"),
});

