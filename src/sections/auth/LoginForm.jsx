"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginUser, logoutUser } from "store/slices/authSlice";
import { Box, Button, Grid } from "@mui/material";
import { useSnackbar } from "notistack";
import { CTextField, EyeToggleButton } from "components/custom";
import { themeColors } from "theme/theme-colors";

const initialValues = {
    email: "",
    password: ""
};

const validationSchema = yup.object().shape({
    password: yup.string().trim().required("Password is required!"),
    email: yup.string().trim().email("Invalid Email Address!").required("Email is required!")
});

export default function LoginForm() {
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const { isLoading } = useSelector(state => state?.auth);
    const [visiblePassword, setVisiblePassword] = useState(false);

    // Check for logout message from sessionStorage (when user is deactivated)
    useEffect(() => {
        if (typeof window !== "undefined") {
            const logoutMessage = sessionStorage.getItem("logoutMessage");
            if (logoutMessage) {
                enqueueSnackbar(logoutMessage, { variant: "error", autoHideDuration: 5000 });
                sessionStorage.removeItem("logoutMessage");
                // Also dispatch logout to clear any auth state
                dispatch(logoutUser());
            }
        }
    }, [dispatch, enqueueSnackbar]);

    const methods = useForm({
        defaultValues: initialValues,
        resolver: yupResolver(validationSchema)
    });

    const { handleSubmit, control, formState: { errors, isSubmitting } } = methods;

    const onSubmit = async (formData) => {
        try {
            const response = await dispatch(loginUser(formData));

            if (response.success) {
                enqueueSnackbar(response.message, { variant: "success" });
                window?.location?.reload();
            }
        } catch (error) {
            console.log("error", error);

            enqueueSnackbar(error?.response?.data?.message || "Something went wrong!", { variant: "error" });
        }
    };

    const loading = isLoading || isSubmitting;

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
                <Grid item size={12}>
                    <CTextField
                        name="email"
                        type="email"
                        autoFocus
                        control={control}
                        label="Email*"
                        placeholder="Email"
                        error={errors.email}
                    />
                </Grid>
                <Grid item size={12}>
                    <CTextField
                        name="password"
                        type={visiblePassword ? "text" : "password"}
                        control={control}
                        label="Password*"
                        placeholder="Password"
                        error={errors.password}
                        slotProps={{
                            input: {
                                endAdornment: <EyeToggleButton show={visiblePassword} onClick={() => setVisiblePassword(!visiblePassword)} />
                            }
                        }}
                    />
                </Grid>
            </Grid>
            <Box display="flex" gap={2} justifyContent="end" alignItems="flex-end" mt={2}>
                <Button loading={loading} fullWidth type="submit" disabled={loading} variant="contained" color="info" size="large" sx={{ backgroundColor: themeColors?.lDark }}>
                    Login
                </Button>
            </Box>
        </form>
    );
}
