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
import CSelectField from "components/custom/inputs/CSelectField";
import CCheckbox from "components/custom/inputs/CCheckbox";
import { resetFaq, storeFaq, updateFaq } from "store/slices/faqSlice";
import { DarkButton } from "components/custom/button/DarkButton";
import { moduleStatusOptions, STATUS_ACTIVE } from "utils/constants";

const getInitialValues = (currentRecord) => {
    return {
        question: currentRecord?.question || "",
        answer: currentRecord?.answer || "",
        status: currentRecord?.status ?? STATUS_ACTIVE,
        show_on_stores: currentRecord?.show_on_stores ?? true,
        service_id: currentRecord?.service_id || null,
    };
};

const validationSchema = yup.object().shape({
    question: yup.string().trim().required("Question is required!"),
    answer: yup.string().trim().required("Answer is required!"),
    status: yup.number().transform((value, originalValue) => originalValue === "" ? undefined : value).required("Status is required!"),
    show_on_stores: yup.boolean(),
    service_id: yup.mixed().nullable(),
});

export default function Form({ isEdit, onBack, currentRecord, activeServices = [] }) {
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();

    const serviceOptions = useMemo(() => {
        return activeServices.map(service => ({
            label: service.service_name,
            value: service.id
        }));
    }, [activeServices]);

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
            if (formData?.service_id === "") {
                formData.service_id = null;
            }
            const action = isEdit
                ? updateFaq(currentRecord?.id, formData)
                : storeFaq(formData);

            dispatch(action)
                .then((originalPromiseResult) => {
                    reset();
                    dispatch(resetFaq());
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
                                name="question"
                                type="text"
                                autoFocus
                                control={control}
                                label="Question*"
                                placeholder="Enter question"
                                error={errors.question}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <CTextField
                                name="answer"
                                control={control}
                                label="Answer*"
                                placeholder="Enter answer"
                                multiline
                                rows={7}
                                error={errors.answer}
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

                        <Grid size={{ xs: 12, sm: 8 }}>
                            <CSelectField
                                name="service_id"
                                control={control}
                                label="Associate with Service"
                                placeholder="Select Service (Optional)"
                                options={serviceOptions}
                                error={errors.service_id}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 4 }}>
                            <CCheckbox
                                name="show_on_stores"
                                control={control}
                                label="Show on Store"
                                labelPlacement="top"
                                error={errors.show_on_stores}
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

