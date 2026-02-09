"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { Box, LinearProgress, Typography } from "@mui/material";
import { ROUTES } from "utils/routes";
import { getStore } from "store/slices/storeSlice";
import PageWrapper from "sections/dashboard/common/layout/PageWrapper";
import Form from "sections/dashboard/admin/stores/sections/form";

export default function StoreWebPageFormPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { user } = useSelector((state) => state?.auth);
    const { store, isLoading } = useSelector((state) => state?.store);

    const storeId = user?.store_id ? (typeof user.store_id === "string" ? parseInt(user.store_id, 10) : user.store_id) : null;

    const handleBack = () => router?.push(ROUTES?.STORE?.DASHBOARD);

    useEffect(() => {
        if (storeId) {
            dispatch(getStore(storeId))
                .then((resp) => {
                    if (!resp?.data) {
                        enqueueSnackbar("Store not found", { variant: "error" });
                        handleBack();
                    }
                })
                .catch(() => {
                    enqueueSnackbar("Access denied or store not found", { variant: "error" });
                    handleBack();
                });
        }
    }, [storeId]);

    if (!storeId) {
        return (
            <PageWrapper title="Store web page">
                <Typography variant="body2" color="text.secondary">
                    You don&apos;t have a store assigned to your account. Please contact the administrator.
                </Typography>
            </PageWrapper>
        );
    }

    if (isLoading && !store) {
        return (
            <PageWrapper title="Store web page">
                <Box sx={{ py: 1 }}>
                    <LinearProgress sx={{ color: "#4e96fe" }} color="inherit" />
                </Box>
            </PageWrapper>
        );
    }

    if (!store?.id) {
        return null;
    }

    return (
        <PageWrapper title="Store web page">
            <Box sx={{ py: 1 }}>
                {isLoading && <LinearProgress sx={{ color: "#4e96fe" }} color="inherit" />}
            </Box>
            <Form
                isEdit
                currentRecord={store}
                onBack={handleBack}
                isStoreAdminEdit
            />
        </PageWrapper>
    );
}
