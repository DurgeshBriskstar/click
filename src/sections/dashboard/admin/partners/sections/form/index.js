"use client";
import { useEffect } from "react";
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
import { resetPartner, storePartner, updatePartner } from "store/slices/partnerSlice";
import { DarkButton } from "components/custom/button/DarkButton";
import { moduleStatusOptions, STATUS_ACTIVE } from "utils/constants";

const getInitialValues = (currentRecord) => {
    return {
        partner_name: currentRecord?.partner_name || "",
        image: currentRecord?.image || null,
        description: currentRecord?.description || "",
        status: currentRecord?.status ?? STATUS_ACTIVE,
    };
};

const validationSchema = yup.object().shape({
    partner_name: yup.string().trim().required("Partner name is required!"),
    image: yup.mixed().nullable(),
    description: yup.string().nullable(),
    status: yup.number().transform((value, originalValue) => originalValue === "" ? undefined : value).required("Status is required!"),
});

export default function Form({ isEdit, onBack, currentRecord }) {
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();

    const methods = useForm({
        defaultValues: getInitialValues(currentRecord),
        resolver: yupResolver(validationSchema)
    });

    const { handleSubmit, control, formState: { errors, isSubmitting }, reset } = methods;

    useEffect(() => {
        if (isEdit && currentRecord) {
            reset(getInitialValues(currentRecord));
        }
    }, [isEdit, currentRecord]);

    const onSubmit = async (formData) => {
        try {
            const action = isEdit
                ? updatePartner(currentRecord?.id, formData)
                : storePartner(formData);

            dispatch(action)
                .then((originalPromiseResult) => {
                    reset();
                    dispatch(resetPartner());
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
                    {/* Left section */}
                    <Grid size={{ xs: 12, md: 8 }} container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <CTextField
                                name="partner_name"
                                type="text"
                                autoFocus
                                control={control}
                                label="Partner Name*"
                                placeholder="Partner Name"
                                error={errors.partner_name}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <CTextField
                                name="description"
                                control={control}
                                label="Description"
                                placeholder="Enter description"
                                multiline
                                rows={7}
                                error={errors.description}
                            />
                        </Grid>
                    </Grid>

                    {/* Right section */}
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
                                label="Image"
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

