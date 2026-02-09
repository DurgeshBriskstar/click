"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { Box, LinearProgress, Stack, TablePagination, Card, Table, TableBody, TableContainer, Typography, Chip, } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { startOfMonth, endOfMonth } from "date-fns";
import { getInquiries, resetInquiries } from "store/slices/inquiries/appointmentInquiry";
import PageWrapper from "sections/dashboard/common/layout/PageWrapper";
import { TableHeader } from "components/data-table";
import OverlayScrollbar from "components/overlay-scrollbar";
import { FlexBox } from "components/flex-box";
import { useLayout } from "sections/dashboard/common/layout/layout-context";
import Row from "../../../admin/inquiries/appointments/sections/list/Row";

const TABLE_HEAD = [
    { id: "name", label: "Name", align: "left" },
    { id: "email", label: "Email", align: "left" },
    { id: "phone", label: "Phone", align: "left" },
    { id: "appointmentStatus", label: "Status", align: "left" },
    { id: "startTime", label: "Start At", align: "left" },
    { id: "endTime", label: "End At", align: "left" },
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
    const [startDate, setStartDate] = useState(startOfMonth(new Date()));
    const [endDate, setEndDate] = useState(endOfMonth(new Date()));

    const { count, inquiries, meta, isLoading } = useSelector((state) => state?.appointmentInquiry);

    // Get user's store - store admin can only see their own store
    // Convert store_id to number if it's a string
    const userStoreId = user?.store_id ? (typeof user.store_id === 'string' ? parseInt(user.store_id, 10) : user.store_id) : null;
    const userStore = stores?.find(store => store?.id === userStoreId);
    const syncedStore = userStore?.highlevel_api_key && userStore?.settings?.appointment_calendar_form_id && userStore?.settings?.appointment_calendar_form_iframe ? userStore : null;

    useEffect(() => {
        if (userStoreId && syncedStore) {
            // Don't make API call if dates are missing
            if (!startDate || !endDate) {
                return;
            }

            const params = {
                storeId: userStoreId,
                page: page + 1,
                limit: rowsPerPage,
            };
            if (startDate) {
                params.startDate = startDate.getTime();
            }
            if (endDate) {
                params.endDate = endDate.getTime();
            }
            dispatch(getInquiries(params)).then()
                .catch((rejectedValueOrSerializedError) => {
                    enqueueSnackbar(rejectedValueOrSerializedError?.message || "Something went wrong!", { variant: "error" });
                    console.log("rejectedValueOrSerializedError", rejectedValueOrSerializedError);
                });
        } else {
            dispatch(resetInquiries());
        }
    }, [userStoreId, page, rowsPerPage, startDate, endDate, syncedStore, dispatch]);

    const handleStartDateChange = (date) => {
        setStartDate(date);
        setPage(0);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
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
        <PageWrapper title="Appointment Inquiries">
            <FlexBox mb={2} gap={2} justifyContent="space-between" flexWrap="wrap" alignItems="center">
                {userStoreId && syncedStore && (<Chip label={`Total: ${count} inquiries`} color="info" variant="outlined" />)}
                <FlexBox gap={2} flexWrap="wrap" alignItems="flex-start">
                    <Box sx={{ minWidth: 160 }}>
                        <DatePicker
                            label="Start Date"
                            value={startDate}
                            onChange={handleStartDateChange}
                            slotProps={{
                                textField: {
                                    size: "small",
                                    sx: { minWidth: 160 },
                                    error: !startDate,
                                    helperText: !startDate ? "Start date is required" : ""
                                },
                                field: { clearable: true }
                            }}
                            maxDate={endDate || undefined}
                        />
                    </Box>
                    <Box sx={{ minWidth: 160 }}>
                        <DatePicker
                            label="End Date"
                            value={endDate}
                            onChange={handleEndDateChange}
                            slotProps={{
                                textField: {
                                    size: "small",
                                    sx: { minWidth: 160 },
                                    error: !endDate,
                                    helperText: !endDate ? "End date is required" : ""
                                },
                                field: { clearable: true }
                            }}
                            minDate={startDate || undefined}
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
                    <Typography variant="h6" color="text.secondary" gutterBottom>Appointment Calendar Not Configured</Typography>
                    <Typography variant="body2" color="text.secondary">Your store's appointment calendar is not configured with HighLevel API. Please contact the administrator.</Typography>
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
                                            <Row key={record.id || index} record={record} storeId={userStoreId} />
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

