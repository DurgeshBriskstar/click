"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { Box, LinearProgress } from "@mui/material";
import { ROUTES } from "utils/routes";
import { getPage } from "store/slices/cmsSlice";
import PageWrapper from "sections/dashboard/common/layout/PageWrapper";
import Form from "./sections/form";

export default function FormPage({ isEdit = false }) {
    const { id } = useParams();
    const dispatch = useDispatch();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { page, isLoading } = useSelector((state) => state?.cms);

    const handleBack = () => router?.push(ROUTES?.ADMIN?.CMS?.PAGE?.LIST);

    useEffect(() => {
        if (isEdit && id) {
            dispatch(getPage(id)).then((resp) => {
                if (!resp?.data) {
                    handleBack();
                    enqueueSnackbar("Selected record not found", { variant: 'error' });
                }
            }).catch((rejectedValueOrSerializedError) => {
                enqueueSnackbar(rejectedValueOrSerializedError?.message, { variant: 'error' });
            });
        }
    }, [id]);


    return (
        <PageWrapper title={isEdit ? "Edit Page" : "Create Page"}>
            <Box sx={{ py: 1 }}>
                {isLoading && <LinearProgress sx={{ color: "#4e96fe" }} color="inherit" />}
            </Box>
            <Form isEdit={isEdit} currentRecord={id ? page : {}} onBack={handleBack} />
        </PageWrapper>
    );
}