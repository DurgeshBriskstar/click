"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { Box, LinearProgress, Stack, TablePagination, Card, Table, TableBody, TableContainer, Typography, FormControl, InputLabel, Select, MenuItem, Chip, FormHelperText } from "@mui/material";
import { Business as BusinessIcon } from "@mui/icons-material";
import { getQuickBooksProducts } from "store/slices/quickbooksProductSlice";
import PageWrapper from "sections/dashboard/common/layout/PageWrapper";
import { TableHeader } from "components/data-table";
import OverlayScrollbar from "components/overlay-scrollbar";
import { FlexBox } from "components/flex-box";
import secureAxiosInstance from "lib/secureAxiosInstance";
import Row from "./sections/list/Row";

const QB_SELECTED_REALM_KEY = "quickbooks_selected_realm_id";

const TABLE_HEAD = [
    { id: "Id", label: "ID", align: "left" },
    { id: "Name", label: "Name", align: "left" },
    { id: "Type", label: "Type", align: "left" },
    { id: "Sku", label: "SKU", align: "left" },
    { id: "QtyOnHand", label: "Qty On Hand", align: "right" },
    { id: "UnitPrice", label: "Unit Price", align: "right" },
    { id: "actions", label: "Actions", align: "center" },
];

const ListPage = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const [tableData, setTableData] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [companiesLoading, setCompaniesLoading] = useState(true);
    const [selectedRealmId, setSelectedRealmId] = useState("");
    const { count, products, isLoading } = useSelector((state) => state?.quickbooksProduct);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        secureAxiosInstance.get("/quickbooks/status").then((res) => {
            if (res?.data?.success && res?.data?.data?.companies?.length) {
                setCompanies(res.data.data.companies);
                const saved = typeof window !== "undefined" ? sessionStorage.getItem(QB_SELECTED_REALM_KEY) : null;
                const first = res.data.data.companies[0];
                if (saved && res.data.data.companies.some((c) => c.realmId === saved)) {
                    setSelectedRealmId(saved);
                } else if (first) {
                    setSelectedRealmId(first.realmId);
                    if (typeof window !== "undefined") sessionStorage.setItem(QB_SELECTED_REALM_KEY, first.realmId);
                }
            }
        }).catch(() => setCompanies([])).finally(() => setCompaniesLoading(false));
    }, []);

    useEffect(() => {
        if (selectedRealmId) {
            if (typeof window !== "undefined") sessionStorage.setItem(QB_SELECTED_REALM_KEY, selectedRealmId);
            dispatch(getQuickBooksProducts({ realmId: selectedRealmId, minorversion: 65 }))
                .then()
                .catch((rejectedValueOrSerializedError) => {
                    enqueueSnackbar(rejectedValueOrSerializedError?.message || "Something went wrong!", { variant: "error" });
                });
        }
    }, [selectedRealmId, refresh, dispatch]);

    useEffect(() => {
        if (products?.length) {
            setTableData(products);
        } else {
            setTableData([]);
        }
    }, [products]);

    const handleCompanyChange = (event) => {
        setSelectedRealmId(event.target.value);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isNotFound = !isLoading && (!tableData || tableData.length === 0);
    const loading = isLoading;

    const paginatedData = tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <PageWrapper title="QuickBooks Products">
            <FlexBox mb={2} gap={2} justifyContent="space-between" flexWrap="wrap" alignItems="center">
                {selectedRealmId && <Chip label={`Total: ${count} products`} color="info" variant="outlined" />}
                <FormControl sx={{ minWidth: 300 }} size="small" disabled={companiesLoading}>
                    <InputLabel id="qb-company-select-label">Select Company</InputLabel>
                    <Select
                        labelId="qb-company-select-label"
                        id="qb-company-select"
                        value={selectedRealmId}
                        label="Select Company"
                        onChange={handleCompanyChange}
                        startAdornment={<BusinessIcon sx={{ mr: 1, color: "text.secondary" }} />}
                    >
                        <MenuItem value="" disabled><em>Select a company to view products</em></MenuItem>
                        {companies.map((c) => (
                            <MenuItem key={c.realmId} value={c.realmId}>
                                {c.companyName || c.realmId}
                            </MenuItem>
                        ))}
                    </Select>
                    {companies.length === 0 && !companiesLoading && (
                        <FormHelperText>Connect QuickBooks to add companies.</FormHelperText>
                    )}
                </FormControl>
            </FlexBox>

            {!selectedRealmId && !companiesLoading && (
                <Card sx={{ p: 4, textAlign: "center" }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>Select a Company</Typography>
                    <Typography variant="body2" color="text.secondary">Please select a QuickBooks company from the dropdown above to view products.</Typography>
                    {companies.length === 0 && (
                        <Typography variant="body2" color="error" sx={{ mt: 2 }}>No QuickBooks companies connected. Connect QuickBooks from the dashboard first.</Typography>
                    )}
                </Card>
            )}

            {selectedRealmId && (
                <>
                    <Box sx={{ py: 1 }}>
                        {loading && <LinearProgress sx={{ color: "#4e96fe" }} color="inherit" />}
                    </Box>
                    <Card>
                        <OverlayScrollbar>
                            <TableContainer sx={{ minWidth: 900 }}>
                                <Table>
                                    <TableHeader order="asc" orderBy="" heading={TABLE_HEAD} onRequestSort={() => { }} />

                                    <TableBody>
                                        {paginatedData.map((record) => (
                                            <Row key={record?.Id ?? record?.id ?? record?.Name} record={record} />
                                        ))}
                                    </TableBody>
                                </Table>
                                {isNotFound && <Typography textAlign="center" my={2}>No Records Found! Connect QuickBooks to view products.</Typography>}
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
                                rowsPerPageOptions={[5, 10, 25, 50]}
                            />
                        </Stack>
                    </Card>
                </>
            )}
        </PageWrapper>
    );
};

export default ListPage;
