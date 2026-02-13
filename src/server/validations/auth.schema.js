import * as yup from "yup";

export const loginSchema = yup.object({
    password: yup.string().trim().required("Password is required!"),
    email: yup.string().trim().email("Invalid Email Address").required("Email is required!")
});

export const updateUserSchema = yup.object({
    first_name: yup.string().trim().required("First name is required!"),
    last_name: yup.string().trim().required("Last name is required!"),
    email: yup.string().trim().email("Invalid Email").nullable(""),
    image: yup.mixed().nullable(),
    highlevel_franchise_access_token: yup.string().nullable(),
    highlevel_franchise_form_id: yup.string().nullable(),
});

export const forgotPasswordSchema = yup.object({
    email: yup.string().trim().email("Invalid Email Address").required("Email is required!")
});

export const resetPasswordSchema = yup.object({
    token: yup.string().trim().required("Reset token is required!"),
    password: yup
        .string()
        .trim()
        .min(6, "Password must be at least 6 characters!")
        .required("Password is required!"),
    confirmPassword: yup
        .string()
        .trim()
        .oneOf([yup.ref("password")], "Passwords must match!")
        .required("Please confirm your password!")
});
