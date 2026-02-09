"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { Box, LinearProgress, Stack, TablePagination, Card, Table, TableBody, TableContainer, Typography } from "@mui/material";
import { getQuickBooksCustomers } from "store/slices/quickbooksCustomerSlice";
import PageWrapper from "sections/dashboard/common/layout/PageWrapper";
import { TableHeader } from "components/data-table";
import OverlayScrollbar from "components/overlay-scrollbar";
import Row from "./sections/list/Row";

const TABLE_HEAD = [
    { id: "Id", label: "ID", align: "left" },
    { id: "DisplayName", label: "Display Name", align: "left" },
    { id: "CompanyName", label: "Company", align: "left" },
    { id: "email", label: "Email", align: "left" },
    { id: "phone", label: "Phone", align: "left" },
    { id: "actions", label: "Actions", align: "center" },
];

const ListPage = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const [tableData, setTableData] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const { count, customers, isLoading } = useSelector((state) => state?.quickbooksCustomer);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        dispatch(getQuickBooksCustomers({ minorversion: 65 }))
            .then()
            .catch((rejectedValueOrSerializedError) => {
                enqueueSnackbar(rejectedValueOrSerializedError?.message || "Something went wrong!", { variant: "error" });
                console.log("rejectedValueOrSerializedError", rejectedValueOrSerializedError);
            });
    }, [refresh, dispatch]);

    useEffect(() => {
        if (customers?.length) {
            setTableData(customers);
        } else {
            setTableData([]);
        }
    }, [customers]);

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
        <PageWrapper title="QuickBooks Customers">
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
                                    <Row key={record?.Id ?? record?.id ?? record?.DisplayName} record={record} />
                                ))}
                            </TableBody>
                        </Table>
                        {isNotFound && <Typography textAlign="center" my={2}>No Records Found! Connect QuickBooks to view customers.</Typography>}
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
        </PageWrapper>
    );
};

export default ListPage;
