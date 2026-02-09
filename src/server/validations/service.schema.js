import * as yup from "yup";

export const serviceSchema = yup.object({
    service_name: yup.string().required("Service name is required!"),
    service_slug: yup.string()
        .required("Service slug is required!")
        .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only"),
    short_description: yup.string().nullable(),
    image: yup.mixed().nullable(),
    highlights: yup.mixed().nullable(),
    layout_code: yup.string().nullable(),
    sections: yup.mixed().nullable(),
    status: yup.number().transform((value, originalValue) => originalValue === "" ? undefined : value).required("Status is required!"),
});