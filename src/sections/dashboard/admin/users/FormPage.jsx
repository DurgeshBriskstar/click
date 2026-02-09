"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { Box, LinearProgress } from "@mui/material";
import { ROUTES } from "utils/routes";
import { getUser, getActiveStores } from "store/slices/userSlice";
import PageWrapper from "sections/dashboard/common/layout/PageWrapper";
import Form from "./sections/form";

export default function FormPage({ isEdit = false }) {
    const { id } = useParams();
    const dispatch = useDispatch();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { userRecord, activeStores, isLoading } = useSelector((state) => state?.user);

    const handleBack = () => router?.push(ROUTES?.ADMIN?.USER?.LIST);

    useEffect(() => {
        // Fetch active stores for the dropdown
        dispatch(getActiveStores());

        if (isEdit && id) {
            dispatch(getUser(id)).then((resp) => {
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
        <PageWrapper title={isEdit ? "Edit User" : "Create User"}>
            <Box sx={{ py: 1 }}>
                {isLoading && <LinearProgress sx={{ color: "#4e96fe" }} color="inherit" />}
            </Box>
            <Form isEdit={isEdit} currentRecord={id ? userRecord : {}} activeStores={activeStores || []} onBack={handleBack} />
        </PageWrapper>
    );
}

