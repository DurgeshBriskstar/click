"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { Box, LinearProgress } from "@mui/material";
import { ROUTES } from "utils/routes";
import { getFaq } from "store/slices/faqSlice";
import PageWrapper from "sections/dashboard/common/layout/PageWrapper";
import Form from "./sections/form";

export default function FormPage({ isEdit = false, services }) {
    const { id } = useParams();
    const dispatch = useDispatch();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { faq, isLoading } = useSelector((state) => state?.faq);

    const handleBack = () => router?.push(ROUTES?.ADMIN?.SUPPORT?.FAQ?.LIST);

    useEffect(() => {
        if (isEdit && id) {
            dispatch(getFaq(id)).then((resp) => {
                if (!resp?.data) {
                    handleBack();
                    enqueueSnackbar("Selected record not found", { variant: 'error' });
                }
            }).catch((rejectedValueOrSerializedError) => {
                console.log('rejectedValueOrSerializedError', rejectedValueOrSerializedError);
            });
        }
    }, [id]);

    const serviceData = services?.data || [];


    return (
        <PageWrapper title={isEdit ? "Edit FAQ" : "Create FAQ"}>
            <Box sx={{ py: 1 }}>
                {isLoading && <LinearProgress sx={{ color: "#4e96fe" }} color="inherit" />}
            </Box>
            <Form isEdit={isEdit} currentRecord={id ? faq : {}} activeServices={serviceData} onBack={handleBack} />
        </PageWrapper>
    );
}

