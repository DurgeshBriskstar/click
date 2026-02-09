"use client";
import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { Card } from "@mui/material";
import { CTextField } from "components/custom";
import CImageUpload from "components/custom/inputs/CImageUpload";
import CSelectField from "components/custom/inputs/CSelectField";
import { resetUserRecord, storeUser, updateUser } from "store/slices/userSlice";
import { DarkButton } from "components/custom/button/DarkButton";
import { moduleStatusOptions, STATUS_ACTIVE, roleOptions } from "utils/constants";

const getInitialValues = (currentRecord) => {
    return {
        first_name: currentRecord?.first_name || "",
        last_name: currentRecord?.last_name || "",
        email: currentRecord?.email || "",
        phone: currentRecord?.phone || "",
        password: "",
        role: currentRecord?.role || "",
        store_id: currentRecord?.store_id || null,
        image: currentRecord?.image || null,
        status: currentRecord?.status ?? STATUS_ACTIVE,
    };
};

const createValidationSchema = yup.object().shape({
    first_name: yup.string().required("First name is required!"),
    last_name: yup.string().nullable(),
    email: yup.string().email("Invalid email format").required("Email is required!"),
    phone: yup.string().nullable(),
    password: yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required!"),
    role: yup.string().required("Role is required!"),
    store_id: yup.number().nullable().transform((value) => (isNaN(value) ? null : value)),
    image: yup.mixed().nullable(),
    status: yup.number().transform((value, originalValue) => originalValue === "" ? undefined : value).required("Status is required!"),
});

const updateValidationSchema = yup.object().shape({
    first_name: yup.string().required("First name is required!"),
    last_name: yup.string().nullable(),
    phone: yup.string().nullable(),
    password: yup.string()
        .nullable()
        .transform((value) => (value === "" ? null : value))
        .test('min-length', 'Password must be at least 6 characters', function (value) {
            if (value === null || value === undefined || value === '') return true;
            return value.length >= 6;
        }),
    role: yup.string().required("Role is required!"),
    store_id: yup.number().nullable().transform((value) => (isNaN(value) ? null : value)),
    image: yup.mixed().nullable(),
    status: yup.number().transform((value, originalValue) => originalValue === "" ? undefined : value).required("Status is required!"),
});

export default function Form({ isEdit, onBack, currentRecord, activeStores = [] }) {
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();

    const storeOptions = useMemo(() => {
        return activeStores.map(store => ({
            label: store.store_name,
            value: store.id
        }));
    }, [activeStores]);

    const methods = useForm({
        defaultValues: getInitialValues(currentRecord),
        resolver: yupResolver(isEdit ? updateValidationSchema : createValidationSchema)
    });

    const { handleSubmit, control, formState: { errors, isSubmitting }, reset, watch } = methods;

    useEffect(() => {
        if (isEdit && currentRecord) {
            reset(getInitialValues(currentRecord));
        }
    }, [isEdit, currentRecord]);

    const onSubmit = async (formData) => {
        try {
            // Remove empty password for update if not provided
            const submitData = { ...formData };
            if (isEdit && !submitData.password) {
                delete submitData.password;
            }

            const action = isEdit
                ? updateUser(currentRecord?.id, submitData)
                : storeUser(submitData);

            dispatch(action)
                .then((originalPromiseResult) => {
                    reset();
                    dispatch(resetUserRecord());
                    enqueueSnackbar(originalPromiseResult?.message, { variant: 'success' });
                    onBack();
                })
                .catch((rejectedValueOrSerializedError) => {
                    enqueueSnackbar((rejectedValueOrSerializedError?.message || "Something went wrong!"), { variant: 'error' });
                    console.log('rejectedValueOrSerializedError', rejectedValueOrSerializedError);
                });
        } catch (error) {
            console.log("error", error);
            enqueueSnackbar(error?.response?.data?.message || "Something went wrong!", { variant: "error" });
        }
    };

    return (
        <Card className="p-3">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                    {/* Left section - Form fields */}
                    <Grid size={{ xs: 12, md: 8 }} container spacing={3} alignItems="flex-start" alignContent="flex-start">
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
                                label="Last Name"
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
                                disabled={isEdit}
                                error={errors.email}
                            />
                        </Grid>
                        <Grid size={{ md: 6, xs: 12 }}>
                            <CTextField
                                name="phone"
                                type="tel"
                                control={control}
                                label="Phone"
                                placeholder="Phone"
                                onlyNumbers
                                max={12}
                                error={errors.phone}
                            />
                        </Grid>
                        <Grid size={{ md: 6, xs: 12 }}>
                            <CTextField
                                name="password"
                                type="password"
                                control={control}
                                label={isEdit ? "Password (leave blank to keep current)" : "Password*"}
                                placeholder={isEdit ? "Enter new password" : "Password"}
                                error={errors.password}
                            />
                        </Grid>
                        <Grid size={{ md: 6, xs: 12 }}>
                            <CSelectField
                                name="role"
                                control={control}
                                label="Role*"
                                placeholder="Select Role"
                                options={roleOptions}
                                error={errors.role}
                            />
                        </Grid>
                        <Grid size={{ md: 6, xs: 12 }}>
                            <CSelectField
                                name="store_id"
                                control={control}
                                label="Associate with Store"
                                placeholder="Select Store (Optional)"
                                options={storeOptions}
                                error={errors.store_id}
                            />
                        </Grid>
                    </Grid>

                    {/* Right section - Profile Image & Status */}
                    <Grid size={{ xs: 12, md: 4 }} container spacing={3} alignItems="flex-start" alignContent="flex-start">
                        <Grid size={{ xs: 12 }}>
                            <CSelectField
                                name="status"
                                control={control}
                                label="Status*"
                                placeholder="Choose status"
                                options={moduleStatusOptions || []}
                                error={errors.status}
                            />
                        </Grid>

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

                    <Grid size={12} display="flex" gap={2}>
                        <Button type="button" onClick={onBack} color="error" variant="contained">Cancel</Button>
                        <DarkButton loading={isSubmitting} type="submit" color="info" variant="contained">Save Changes</DarkButton>
                    </Grid>
                </Grid>
            </form>
        </Card>
    );
}

