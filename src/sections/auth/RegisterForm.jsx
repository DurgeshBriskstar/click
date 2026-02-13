"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Grid } from "@mui/material";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { CTextField, EyeToggleButton } from "components/custom";
import { FlexBox } from "components/flex-box";
import BoxLink from "components/custom/common/BoxLink";
import CCheckbox from "components/custom/inputs/CCheckbox";
import { ROUTES } from "utils/routes";

const initialValues = {
    name: "",
    email: "",
    password: "",
    re_password: "",
    agreement: false
};

const validationSchema = yup.object().shape({
    name: yup.string().trim().required("Name is required"),
    email: yup.string().trim().email("Invalid Email Address").required("Email is required"),
    password: yup.string().trim().required("Password is required"),
    re_password: yup.string().trim().oneOf([yup.ref("password")], "Passwords must match").required("Please re-type password"),
    agreement: yup.bool().test("agreement", "You have to agree with our Terms and Conditions!", value => value === true).required("You have to agree with our Terms and Conditions!")
});

export default function RegisterForm() {
    const { enqueueSnackbar } = useSnackbar();
    const [visiblePassword, setVisiblePassword] = useState(false);

    const methods = useForm({
        defaultValues: initialValues,
        resolver: yupResolver(validationSchema)
    });

    const { handleSubmit, control, formState: { errors, isSubmitting } } = methods;

    const onSubmit = (data) => {
        enqueueSnackbar("Hello", { variant: 'error' });
        console.log("data", data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
                <Grid item size={12}>
                    <CTextField
                        name="name"
                        type="text"
                        autoFocus
                        control={control}
                        label="Full Name*"
                        placeholder="Ralph Awards"
                        error={errors.name}
                    />
                </Grid>
                <Grid item size={12}>
                    <CTextField
                        name="email"
                        type="email"
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
                        placeholder="********"
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
                        name="re_password"
                        type={visiblePassword ? "text" : "password"}
                        control={control}
                        label="Retype Password*"
                        placeholder="********"
                        error={errors.password}
                        slotProps={{
                            input: {
                                endAdornment: <EyeToggleButton show={visiblePassword} onClick={() => setVisiblePassword(!visiblePassword)} />
                            }
                        }}
                    />
                </Grid>
                <Grid item size={12}>
                    <CCheckbox
                        name="agreement"
                        control={control}
                        label={
                            <FlexBox flexWrap="wrap" alignItems="center" justifyContent="flex-start" gap={1}>
                                <Box display={{
                                    sm: "inline-block",
                                    xs: "none"
                                }}>By signing up, you agree to</Box>
                                <Box display={{
                                    sm: "none",
                                    xs: "inline-block"
                                }}>Accept Our</Box>
                                <BoxLink title="Terms & Condition" href={ROUTES?.HOMEPAGE} />
                            </FlexBox>
                        }
                        error={errors.agree}
                    />
                </Grid>
            </Grid>
            <Box display="flex" gap={2} justifyContent="end" alignItems="flex-end" mt={2}>
                <Button fullWidth type="submit" disabled={isSubmitting} variant="contained" color="primary" size="large">
                    Create an Account
                </Button>
            </Box>
        </form>
    );
}
