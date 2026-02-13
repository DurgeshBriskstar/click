"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Grid, Typography, Link, CircularProgress, Alert } from "@mui/material";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { CTextField, EyeToggleButton } from "components/custom";
import { verifyResetToken, resetPassword } from "store/slices/authSlice";
import { ROUTES } from "utils/routes";
import { themeColors } from "theme/theme-colors";

const initialValues = {
    password: "",
    confirmPassword: ""
};

const validationSchema = yup.object().shape({
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

export default function ResetPasswordForm() {
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [isLoading, setIsLoading] = useState(true);
    const [isValidToken, setIsValidToken] = useState(false);
    const [visiblePassword, setVisiblePassword] = useState(false);
    const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const methods = useForm({
        defaultValues: initialValues,
        resolver: yupResolver(validationSchema)
    });

    const { handleSubmit, control, formState: { errors, isSubmitting } } = methods;

    useEffect(() => {
        const verifyTokenAsync = async () => {
            if (!token) {
                setIsLoading(false);
                setIsValidToken(false);
                return;
            }

            try {
                const response = await dispatch(verifyResetToken(token));
                if (response?.success) {
                    setIsValidToken(true);
                } else {
                    setIsValidToken(false);
                }
            } catch (error) {
                setIsValidToken(false);
            } finally {
                setIsLoading(false);
            }
        };

        verifyTokenAsync();
    }, [token, dispatch]);

    const onSubmit = async (data) => {
        if (!token) {
            enqueueSnackbar("Invalid reset token", { variant: 'error' });
            return;
        }

        try {
            const response = await dispatch(resetPassword({
                token,
                password: data.password,
                confirmPassword: data.confirmPassword
            }));

            if (response?.success) {
                enqueueSnackbar(response.message || "Password reset successfully!", { variant: 'success' });
                setIsSuccess(true);

                setTimeout(() => {
                    router.push(ROUTES.LOGIN);
                }, 2000);
            }
        } catch (error) {
            enqueueSnackbar(error?.message || "Failed to reset password", { variant: 'error' });
        }
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                <CircularProgress />
            </Box>
        );
    }

    if (!token || !isValidToken) {
        return (
            <>
                <Typography variant="h3" sx={{ mb: 3, textAlign: "center" }}>
                    Invalid Reset Link
                </Typography>
                <Alert severity="error" sx={{ mb: 3 }}>
                    This password reset link is invalid or has expired. Please request a new one.
                </Alert>
                <Box display="flex" gap={2} justifyContent="center" alignItems="center" mt={2}>
                    <Link href={ROUTES.FORGOT_PASSWORD} underline="hover">
                        Request New Reset Link
                    </Link>
                </Box>
                <Box display="flex" gap={2} justifyContent="center" alignItems="center" mt={1}>
                    <Link href={ROUTES.LOGIN} underline="hover">
                        Back to Login
                    </Link>
                </Box>
            </>
        );
    }

    if (isSuccess) {
        return (
            <>
                <Typography variant="h3" sx={{ mb: 3, textAlign: "center" }}>
                    Password Reset Successful!
                </Typography>
                <Alert severity="success" sx={{ mb: 3 }}>
                    Your password has been reset successfully. Redirecting to login...
                </Alert>
                <Box display="flex" gap={2} justifyContent="center" alignItems="center" mt={2}>
                    <Link href={ROUTES.LOGIN} underline="hover">
                        Go to Login
                    </Link>
                </Box>
            </>
        );
    }

    return (
        <>
            <Typography variant="h3" sx={{ mb: 3, textAlign: "center" }}>
                Reset Your Password
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, textAlign: "center", color: "text.secondary" }}>
                Enter your new password below.
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    <Grid item size={12}>
                        <CTextField
                            name="password"
                            type={visiblePassword ? "text" : "password"}
                            autoFocus
                            control={control}
                            label="New Password*"
                            placeholder="Enter new password"
                            error={errors.password}
                            slotProps={{
                                input: {
                                    endAdornment: <EyeToggleButton show={visiblePassword} onClick={() => setVisiblePassword(!visiblePassword)} />
                                }
                            }}
                        />
                    </Grid>
                    <Grid item size={12}>
                        <CTextField
                            name="confirmPassword"
                            type={visibleConfirmPassword ? "text" : "password"}
                            control={control}
                            label="Confirm Password*"
                            placeholder="Confirm new password"
                            error={errors.confirmPassword}
                            slotProps={{
                                input: {
                                    endAdornment: <EyeToggleButton show={visibleConfirmPassword} onClick={() => setVisibleConfirmPassword(!visibleConfirmPassword)} />
                                }
                            }}
                        />
                    </Grid>
                </Grid>
                <Box display="flex" gap={2} justifyContent="end" alignItems="flex-end" mt={2}>
                    <Button fullWidth type="submit" disabled={isSubmitting} variant="contained" color="primary" size="large" sx={{ backgroundColor: themeColors?.lDark }}>
                        {isSubmitting ? "Resetting..." : "Reset Password"}
                    </Button>
                </Box>
                <Box display="flex" gap={2} justifyContent="center" alignItems="center" mt={2}>
                    <Link href={ROUTES.LOGIN} underline="hover">
                        Back to Login
                    </Link>
                </Box>
            </form>
        </>
    );
}
