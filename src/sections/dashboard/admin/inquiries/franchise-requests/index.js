"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { Box, LinearProgress, Stack, TablePagination, Card, Table, TableBody, TableContainer, Typography, Chip, } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { getInquiries, resetInquiries } from "store/slices/inquiries/franchiseInquiry";
import PageWrapper from "sections/dashboard/common/layout/PageWrapper";
import { TableHeader } from "components/data-table";
import OverlayScrollbar from "components/overlay-scrollbar";
import { FlexBox } from "components/flex-box";
import Row from "./sections/list/Row";

const TABLE_HEAD = [
    { id: "name", label: "Name", align: "left" },
    { id: "email", label: "Email", align: "left" },
    { id: "phone", label: "Phone", align: "left" },
    { id: "createdAt", label: "Submitted At", align: "left" },
    { id: "actions", label: "Actions", align: "center" },
];

const ListPage = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [initialized, setInitialized] = useState(false);
    const [startAt, setStartAt] = useState(startOfMonth(new Date()));
    const [endAt, setEndAt] = useState(endOfMonth(new Date()));

    const { count, inquiries, meta, isLoading } = useSelector((state) => state?.franchiseInquiry);
    const { user } = useSelector((state) => state?.auth);

    useEffect(() => {
        if (!initialized && user) {
            setInitialized(true);
        }
    }, [user, initialized]);

    // Use primitive deps (not `user` object) so effect doesn't re-run when Redux returns a new object reference
    const hasConfig = user?.highlevel_franchise_access_token && user?.highlevel_franchise_form_id;

    useEffect(() => {
        if (hasConfig) {
            // Don't make API call if dates are missing
            if (!startAt || !endAt) {
                return;
            }

            const params = {
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
    }, [page, rowsPerPage, startAt, endAt, hasConfig]);

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
        <PageWrapper title="Franchise Requests">
            <FlexBox mb={2} gap={2} justifyContent="space-between" flexWrap="wrap" alignItems="center">
                {hasConfig && (<Chip label={`Total: ${count} requests`} color="info" variant="outlined" />)}
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

            {!hasConfig && (
                <Card sx={{ p: 4, textAlign: "center" }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>Configuration Required</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Please configure HighLevel Franchise Access Token and Form Id in your profile settings to view franchise requests.
                    </Typography>
                </Card>
            )}

            {hasConfig && (
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
                                        No franchise requests found!
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

