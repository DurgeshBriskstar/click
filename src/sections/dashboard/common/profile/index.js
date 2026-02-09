"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { updateAccount } from "store/slices/authSlice";
import PageWrapper from "../../common/layout/PageWrapper";
import { CTextField, EyeToggleButton } from "components/custom";
import { DarkButton } from "components/custom/button/DarkButton";
import CImageUpload from "components/custom/inputs/CImageUpload";
import CSoftPhoneInput from "components/custom/inputs/CPhoneInput";
import { SUPER_ADMIN_ROLE } from "utils/constants";

const getInitialValues = (currentRecord) => {
    return {
        first_name: currentRecord?.first_name || "",
        last_name: currentRecord?.last_name || "",
        email: currentRecord?.email || "",
        phone: currentRecord?.phone || "",
        image: currentRecord?.image || null,
        highlevel_franchise_access_token: currentRecord?.highlevel_franchise_access_token || null,
        highlevel_franchise_form_id: currentRecord?.highlevel_franchise_form_id || null,
    }
};

const validationSchema = yup.object().shape({
    first_name: yup.string().required("First name is required!"),
    last_name: yup.string().required("Last name is required!"),
    email: yup.string().email("Invalid Email").required("Email is required!"),
    image: yup.mixed().nullable(),
    highlevel_franchise_access_token: yup.string().nullable(),
    highlevel_franchise_form_id: yup.string().nullable(),
});

export default function UserProfile() {
    const { user, loading, initialized } = useSelector((state) => state.auth);
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const [visiblePassword, setVisiblePassword] = useState(false);

    const methods = useForm({
        defaultValues: getInitialValues(user),
        resolver: yupResolver(validationSchema),
    });

    const { handleSubmit, control, formState: { errors, isSubmitting }, reset } = methods;

    useEffect(() => {
        if (user?.id) {
            reset(getInitialValues(user));
        }
    }, [user]);

    const onSubmit = async (formData) => {
        try {

            const { email, ...newFormData } = formData;

            let finalPayload = newFormData;

            if (user?.role !== SUPER_ADMIN_ROLE) {
                const { highlevel_franchise_access_token, highlevel_franchise_form_id, ...rest } = newFormData;
                finalPayload = rest;
            }

            await dispatch(updateAccount(finalPayload)).then(originalPromiseResult => {
                enqueueSnackbar(originalPromiseResult?.message, { variant: 'success' });
            }).catch(rejectedValueOrSerializedError => {
                enqueueSnackbar(rejectedValueOrSerializedError?.message, { variant: 'error' });
            });
        } catch (error) {
            enqueueSnackbar(error?.message, { variant: 'error' });
        }
    };

    if (loading) {
        return null;
    }

    return (
        <PageWrapper title="Profile Setting">
            <Card className="p-2">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        {/* Left section - Form fields */}
                        <Grid size={{ xs: 12, md: 8 }} container spacing={2} alignItems="flex-start" alignContent="flex-start">
                            <Grid size={{ md: 6, xs: 12 }}>
                                <CTextField
                                    name="first_name"
                                    type="text"
                                    autoFocus
                                    control={control}
                                    label="First Name*"
                                    placeholder="First Name"
                                    error={errors.first_name}
                                />
                            </Grid>
                            <Grid size={{ md: 6, xs: 12 }}>
                                <CTextField
                                    name="last_name"
                                    type="text"
                                    control={control}
                                    label="Last Name*"
                                    placeholder="Last Name"
                                    error={errors.last_name}
                                />
                            </Grid>
                            <Grid size={{ md: 6, xs: 12 }}>
                                <CTextField
                                    name="email"
                                    type="email"
                                    control={control}
                                    label="Email*"
                                    placeholder="Email"
                                    disabled
                                    error={errors.email}
                                    sx={{
                                        "& .MuiInputBase-input.Mui-disabled": {
                                            WebkitTextFillColor: "rgba(0, 0, 0, 0.72)",
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid size={{ md: 6, xs: 12 }}>
                                <CSoftPhoneInput
                                    name="phone"
                                    control={control}
                                    label="Phone number"
                                    placeholder="Phone number"
                                    onlyNumbers
                                    error={errors.phone}
                                />
                            </Grid>
                            {
                                user?.role === SUPER_ADMIN_ROLE &&
                                <>
                                    <Grid size={{ md: 6, xs: 12 }}>
                                        <CTextField
                                            name="highlevel_franchise_access_token"
                                            type={visiblePassword ? "text" : "password"}
                                            control={control}
                                            label="Highlevel Franchise Access Token"
                                            placeholder="Enter franchise account access token"
                                            error={errors.highlevel_franchise_access_token}
                                            slotProps={{
                                                input: {
                                                    endAdornment: <EyeToggleButton show={visiblePassword} onClick={() => setVisiblePassword(!visiblePassword)} />
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid size={{ md: 6, xs: 12 }}>
                                        <CTextField
                                            name="highlevel_franchise_form_id"
                                            type="text"
                                            control={control}
                                            label="Highlevel Franchise Form Id"
                                            placeholder="Enter franchise request form id"
                                            error={errors.highlevel_franchise_form_id}
                                        />
                                    </Grid>
                                </>
                            }
                        </Grid>

                        {/* Right section - Profile Image */}
                        <Grid size={{ xs: 12, md: 4 }} container spacing={2} alignItems="flex-start" alignContent="flex-start">
                            <Grid size={{ xs: 12 }}>
                                <CImageUpload
                                    control={control}
                                    name="image"
                                    label="Profile Image"
                                    maxFiles={1}
                                    multiple={false}
                                    error={errors.image}
                                />
                            </Grid>
                        </Grid>

                        <Grid size={12}>
                            <DarkButton type="submit" variant="contained" color="info" loading={isSubmitting}>Save Changes</DarkButton>
                        </Grid>
                    </Grid>
                </form>
            </Card>
        </PageWrapper>
    );
}