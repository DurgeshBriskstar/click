import * as yup from "yup";

export const blogSchema = yup.object({
    title: yup.string().trim().required("Title is required!"),
    slug: yup.string().trim().required("Slug is required!"),
    excerpt: yup.string().nullable(),
    content: yup.string().nullable(),
    image: yup.mixed().nullable(),
    status: yup.number().transform((value, originalValue) => originalValue === "" ? undefined : value).required("Status is required!"),
});


