"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { Box, LinearProgress, Stack, TablePagination, Card, Table, TableBody, TableContainer, Typography, Chip, } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { getInquiries, resetInquiries } from "store/slices/inquiries/contactInquiry";
import PageWrapper from "sections/dashboard/common/layout/PageWrapper";
import { TableHeader } from "components/data-table";
import OverlayScrollbar from "components/overlay-scrollbar";
import { FlexBox } from "components/flex-box";
import { useLayout } from "sections/dashboard/common/layout/layout-context";
import Row from "../../../admin/inquiries/contact-us/sections/list/Row";

const TABLE_HEAD = [
    { id: "name", label: "Name", align: "left" },
    { id: "email", label: "Email", align: "left" },
    { id: "phone", label: "Phone", align: "left" },
    { id: "service", label: "Service", align: "left" },
    { id: "message", label: "Message", align: "left" },
    { id: "createdAt", label: "Submitted At", align: "left" },
    { id: "actions", label: "Actions", align: "center" },
];

const ListPage = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { stores = [] } = useLayout();
    const { user } = useSelector((state) => state?.auth);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [startAt, setStartAt] = useState(startOfMonth(new Date()));
    const [endAt, setEndAt] = useState(endOfMonth(new Date()));

    const { count, inquiries, meta, isLoading } = useSelector((state) => state?.contactInquiry);
    const userStoreId = user?.store_id ? (typeof user.store_id === 'string' ? parseInt(user.store_id, 10) : user.store_id) : null;

    const userStore = stores?.find(store => {
        const storeId = typeof store.id === 'string' ? parseInt(store.id, 10) : store.id;
        return storeId === userStoreId;
    });

    const syncedStore = userStore?.highlevel_api_key && userStore?.settings?.contact_form_id && userStore?.settings?.contact_form_iframe ? userStore : null;

    useEffect(() => {
        if (userStoreId && syncedStore) {
            // Don't make API call if dates are missing
            if (!startAt || !endAt) {
                return;
            }

            const params = {
                storeId: userStoreId,
                page: page + 1,
                limit: rowsPerPage,
            };
            if (startAt) {
                params.startAt = format(startAt, "yyyy-MM-dd");
            }
            if (endAt) {
                params.endAt = format(endAt, "yyyy-MM-dd");
            }
            dispatch(getInquiries(params)).then()
                .catch((rejectedValueOrSerializedError) => {
                    enqueueSnackbar(rejectedValueOrSerializedError?.message || "Something went wrong!", { variant: "error" });
                    console.log("rejectedValueOrSerializedError", rejectedValueOrSerializedError);
                });
        } else {
            dispatch(resetInquiries());
        }
    }, [userStoreId, page, rowsPerPage, startAt, endAt, syncedStore, dispatch]);

    const handleStartAtChange = (date) => {
        setStartAt(date);
        setPage(0);
    };

    const handleEndAtChange = (date) => {
        setEndAt(date);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isNotFound = !isLoading && (!inquiries || inquiries.length === 0);
    const loading = isLoading;

    return (
        <PageWrapper title="Contact Us Inquiries">
            <FlexBox mb={2} gap={2} justifyContent="space-between" flexWrap="wrap" alignItems="center">
                {userStoreId && syncedStore && (<Chip label={`Total: ${count} inquiries`} color="info" variant="outlined" />)}
                <FlexBox gap={2} flexWrap="wrap" alignItems="flex-start">
                    <Box sx={{ minWidth: 160 }}>
                        <DatePicker
                            label="Start Date"
                            value={startAt}
                            onChange={handleStartAtChange}
                            slotProps={{
                                textField: {
                                    size: "small",
                                    sx: { minWidth: 160 },
                                    error: !startAt,
                                    helperText: !startAt ? "Start date is required" : ""
                                },
                                field: { clearable: true }
                            }}
                            maxDate={endAt || undefined}
                        />
                    </Box>
                    <Box sx={{ minWidth: 160 }}>
                        <DatePicker
                            label="End Date"
                            value={endAt}
                            onChange={handleEndAtChange}
                            slotProps={{
                                textField: {
                                    size: "small",
                                    sx: { minWidth: 160 },
                                    error: !endAt,
                                    helperText: !endAt ? "End date is required" : ""
                                },
                                field: { clearable: true }
                            }}
                            minDate={startAt || undefined}
                        />
                    </Box>
                </FlexBox>
            </FlexBox>

            {!userStoreId && (
                <Card sx={{ p: 4, textAlign: "center" }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>No Store Assigned</Typography>
                    <Typography variant="body2" color="text.secondary">You don't have a store assigned to your account. Please contact the administrator.</Typography>
                </Card>
            )}

            {userStoreId && !syncedStore && (
                <Card sx={{ p: 4, textAlign: "center" }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>Contact Form Not Configured</Typography>
                    <Typography variant="body2" color="text.secondary">Your store's contact form is not configured with HighLevel API. Please contact the administrator.</Typography>
                </Card>
            )}

            {userStoreId && syncedStore && (
                <>
                    <Box sx={{ py: 1 }}>
                        {loading && <LinearProgress sx={{ color: "#4e96fe" }} color="inherit" />}
                    </Box>
                    <Card>
                        <OverlayScrollbar>
                            <TableContainer sx={{ minWidth: 900 }}>
                                <Table>
                                    <TableHeader heading={TABLE_HEAD} />

                                    <TableBody>
                                        {inquiries.map((record, index) => (
                                            <Row key={record.id || index} record={record} />
                                        ))}
                                    </TableBody>
                                </Table>
                                {isNotFound && (
                                    <Typography textAlign="center" my={2}>
                                        No inquiries found!
                                    </Typography>
                                )}
                            </TableContainer>
                        </OverlayScrollbar>

                        <Stack alignItems="center" my={4}>
                            <TablePagination
                                component="div"
                                count={count}
                                page={page}
                                rowsPerPage={rowsPerPage}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                rowsPerPageOptions={[10, 20, 50, 100]}
                            />
                        </Stack>
                    </Card>
                </>
            )}
        </PageWrapper>
    );
};

export default ListPage;

