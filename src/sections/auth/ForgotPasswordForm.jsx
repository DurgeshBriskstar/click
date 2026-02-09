"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Grid, Typography, Link } from "@mui/material";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { CTextField } from "components/custom";
import { forgotPassword } from "store/slices/authSlice";
import { ROUTES } from "utils/routes";
import { themeColors } from "theme/theme-colors";

const initialValues = {
    email: ""
};

const validationSchema = yup.object().shape({
    email: yup.string().email("Invalid email address").required("Email is required")
});

export default function ForgotPasswordForm() {
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const methods = useForm({
        defaultValues: initialValues,
        resolver: yupResolver(validationSchema)
    });

    const { handleSubmit, control, formState: { errors, isSubmitting } } = methods;

    const onSubmit = async (data) => {
        try {
            const response = await dispatch(forgotPassword(data));

            if (response?.success) {
                enqueueSnackbar(response.message || "Password reset link sent to your email!", { variant: 'success' });
                setIsSubmitted(true);
            }
        } catch (error) {
            enqueueSnackbar(error?.message || "Something went wrong!", { variant: 'error' });
        }
    };

    if (isSubmitted) {
        return (
            <>
                <Typography variant="h3" sx={{ mb: 3, textAlign: "center" }}>
                    Check your email
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, textAlign: "center", color: "text.secondary" }}>
                    We've sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.
                </Typography>
                <Typography variant="body2" sx={{ mb: 3, textAlign: "center", color: "text.secondary" }}>
                    The link will expire in 1 hour.
                </Typography>
                <Box display="flex" gap={2} justifyContent="center" alignItems="center" mt={2}>
                    <Link href={ROUTES.LOGIN} underline="hover">
                        Back to Login
                    </Link>
                </Box>
            </>
        );
    }

    return (
        <>
            <Typography variant="h3" sx={{ mb: 3, textAlign: "center" }}>
                Forgot Password
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, textAlign: "center", color: "text.secondary" }}>
                Enter your email address and we'll send you a link to reset your password.
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    <Grid item size={12}>
                        <CTextField
                            name="email"
                            type="email"
                            autoFocus
                            control={control}
                            label="Email*"
                            placeholder="Enter your email"
                            error={errors.email}
                        />
                    </Grid>
                </Grid>
                <Box display="flex" gap={2} justifyContent="end" alignItems="flex-end" mt={2}>
                    <Button fullWidth type="submit" disabled={isSubmitting} variant="contained" color="primary" size="large" sx={{ backgroundColor: themeColors?.lDark }}>
                        {isSubmitting ? "Sending..." : "Send Reset Link"}
                    </Button>
                </Box>
                <Box display="flex" gap={2} justifyContent="center" alignItems="center" mt={2}>
                    <Link href={ROUTES.LOGIN} underline="hover" color={themeColors?.lDark}>
                        Back to Login
                    </Link>
                </Box>
            </form>
        </>
    );
}

