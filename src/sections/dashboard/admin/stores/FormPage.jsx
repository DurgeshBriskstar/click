"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { Box, LinearProgress } from "@mui/material";
import { ROUTES } from "utils/routes";
import { getStore } from "store/slices/storeSlice";
import PageWrapper from "sections/dashboard/common/layout/PageWrapper";
import Form from "./sections/form";

export default function FormPage({ isEdit = false }) {
    const { id } = useParams();
    const dispatch = useDispatch();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { store, isLoading } = useSelector((state) => state?.store);

    const handleBack = () => router?.push(ROUTES?.ADMIN?.STORE?.LIST);

    useEffect(() => {
        if (isEdit && id) {
            dispatch(getStore(id)).then((resp) => {
                if (!resp?.data) {
                    handleBack();
                    enqueueSnackbar("Selected record not found", { variant: 'error' });
                }
            }).catch((rejectedValueOrSerializedError) => {
                console.log('rejectedValueOrSerializedError', rejectedValueOrSerializedError);
            });
        }
    }, [id]);


    return (
        <PageWrapper title={isEdit ? "Edit Store" : "Create Store"}>
            <Box sx={{ py: 1 }}>
                {isLoading && <LinearProgress sx={{ color: "#4e96fe" }} color="inherit" />}
            </Box>
            <Form isEdit={isEdit} currentRecord={id ? store : {}} onBack={handleBack} />
        </PageWrapper>
    );
}

