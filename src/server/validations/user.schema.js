import * as yup from "yup";

export const userCreateSchema = yup.object({
    first_name: yup.string().trim().required("First name is required!"),
    last_name: yup.string().nullable(),
    email: yup.string().trim().email("Invalid email format").required("Email is required!"),
    phone: yup.string().nullable(),
    password: yup.string()
        .trim()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required!"),
    role: yup.string()
        .trim()
        .oneOf(["super_admin", "store_admin"], "Invalid role")
        .required("Role is required!"),
    store_id: yup.number().nullable(),
    status: yup.number().transform((value, originalValue) => originalValue === "" ? undefined : value).required("Status is required!"),
    image: yup.mixed().nullable(),
});

export const userUpdateSchema = yup.object({
    first_name: yup.string().trim().required("First name is required!"),
    last_name: yup.string().nullable(),
    phone: yup.string().nullable(),
    password: yup.string()
        .trim()
        .min(6, "Password must be at least 6 characters")
        .nullable()
        .transform((value) => (value === "" ? null : value)),
    role: yup.string()
        .trim()
        .oneOf(["super_admin", "store_admin"], "Invalid role")
        .required("Role is required!"),
    store_id: yup.number().nullable(),
    status: yup.number().transform((value, originalValue) => originalValue === "" ? undefined : value).required("Status is required!"),
    image: yup.mixed().nullable(),
});

