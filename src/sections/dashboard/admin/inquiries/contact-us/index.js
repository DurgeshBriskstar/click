"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { Box, LinearProgress, Stack, TablePagination, Card, Table, TableBody, TableContainer, Typography, FormControl, InputLabel, Select, MenuItem, Chip, FormHelperText, Button } from "@mui/material";
import { Refresh, Store as StoreIcon } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { getInquiries, resetInquiries } from "store/slices/inquiries/contactInquiry";
import { syncGhlCustomFields } from "store/slices/ghlCustomFieldsSlice";
import PageWrapper from "sections/dashboard/common/layout/PageWrapper";
import { TableHeader } from "components/data-table";
import OverlayScrollbar from "components/overlay-scrollbar";
import { FlexBox } from "components/flex-box";
import { useLayout } from "sections/dashboard/common/layout/layout-context";
import Row from "./sections/list/Row";

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

    const [selectedStoreId, setSelectedStoreId] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [initialized, setInitialized] = useState(false);
    const [startAt, setStartAt] = useState(startOfMonth(new Date()));
    const [endAt, setEndAt] = useState(endOfMonth(new Date()));

    const { count, inquiries, meta, isLoading } = useSelector((state) => state?.contactInquiry);
    const { user } = useSelector((state) => state?.auth);
    const { isLoading: isSyncLoading } = useSelector((state) => state?.ghlCustomFields);

    const syncedStores = stores.filter(store => (store?.highlevel_location_id && store?.highlevel_api_key) && (store?.settings?.contact_form_id && store?.settings?.contact_form_iframe));

    useEffect(() => {
        if (!initialized && syncedStores.length > 0 && user) {
            if (user?.store_id) {
                const userStore = syncedStores.find(store => store.id === user.store_id);
                if (userStore) {
                    setSelectedStoreId(user.store_id);
                }
            }
            setInitialized(true);
        }
    }, [user, syncedStores, initialized]);

    useEffect(() => {
        if (selectedStoreId) {
            const params = {
                storeId: selectedStoreId,
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
    }, [selectedStoreId, page, rowsPerPage, startAt, endAt, dispatch]);

    const handleStoreChange = (event) => {
        setSelectedStoreId(event.target.value);
        setPage(0);
    };

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

    const handleSyncGhlCustomFields = () => {
        dispatch(syncGhlCustomFields())
            .then((result) => {
                enqueueSnackbar(result?.message || "GHL custom fields synced successfully.", { variant: "success" });
            })
            .catch((rejectedValueOrSerializedError) => {
                enqueueSnackbar(rejectedValueOrSerializedError?.message || "Something went wrong!", { variant: "error" });
            });
    };

    const isNotFound = !isLoading && (!inquiries || inquiries.length === 0);
    const loading = isLoading;

    return (
        <PageWrapper title="Contact Us Inquiries">
            <FlexBox mb={2} gap={2} justifyContent="space-between" flexWrap="wrap" alignItems="center">
                {selectedStoreId && (<Chip label={`Total: ${count} inquiries`} color="info" variant="outlined" />)}
                <FlexBox gap={2} flexWrap="wrap" alignItems="flex-start">
                    <FormControl sx={{ minWidth: 300 }} size="small">
                        <InputLabel id="store-select-label">Select Store</InputLabel>
                        <Select labelId="store-select-label" id="store-select" value={selectedStoreId} label="Select Store" onChange={handleStoreChange} startAdornment={<StoreIcon sx={{ mr: 1, color: "text.secondary" }} />}>
                            <MenuItem value="" disabled><em>Select a store to view inquiries</em></MenuItem>
                            {syncedStores.map((store) => (
                                <MenuItem key={store.id} value={store.id}>
                                    {store.store_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
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
                    <Button
                        variant="outlined"
                        color="primary"
                        size="medium"
                        onClick={handleSyncGhlCustomFields}
                        disabled={isSyncLoading}
                        sx={{ minHeight: 40, alignSelf: "flex-start" }}
                        title="Sync GHL Custom Fields"
                        loading={isSyncLoading}
                    >
                        Sync GHL Custom Fields
                    </Button>
                </FlexBox>
            </FlexBox>

            {!selectedStoreId && (
                <Card sx={{ p: 4, textAlign: "center" }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>Select a Store</Typography>
                    <Typography variant="body2" color="text.secondary">Please select a store from the dropdown above to view contact form submissions.</Typography>

                    {syncedStores.length === 0 && (
                        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                            No stores with HighLevel API key configured. Please add a HighLevel API key to a store first.
                        </Typography>
                    )}
                </Card>
            )}

            {selectedStoreId && (
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

