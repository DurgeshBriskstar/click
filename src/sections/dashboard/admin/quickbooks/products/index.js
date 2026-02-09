"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { Box, LinearProgress, Stack, TablePagination, Card, Table, TableBody, TableContainer, Typography } from "@mui/material";
import { getQuickBooksProducts } from "store/slices/quickbooksProductSlice";
import PageWrapper from "sections/dashboard/common/layout/PageWrapper";
import { TableHeader } from "components/data-table";
import OverlayScrollbar from "components/overlay-scrollbar";
import Row from "./sections/list/Row";

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
    const { count, products, isLoading } = useSelector((state) => state?.quickbooksProduct);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        dispatch(getQuickBooksProducts({ minorversion: 65 }))
            .then()
            .catch((rejectedValueOrSerializedError) => {
                enqueueSnackbar(rejectedValueOrSerializedError?.message || "Something went wrong!", { variant: "error" });
                console.log("rejectedValueOrSerializedError", rejectedValueOrSerializedError);
            });
    }, [refresh, dispatch]);

    useEffect(() => {
        if (products?.length) {
            setTableData(products);
        } else {
            setTableData([]);
        }
    }, [products]);

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
        </PageWrapper>
    );
};

export default ListPage;
