"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useSnackbar } from "notistack";
import useTable from "hooks/useTable";
import { Box, LinearProgress, Stack, TablePagination, Card, Table, TableBody, TableContainer, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { ROUTES } from "utils/routes";
import { getPages, deletePage } from "store/slices/cmsSlice";
import PageWrapper from "sections/dashboard/common/layout/PageWrapper";
import { TableHeader } from "components/data-table";
import OverlayScrollbar from "components/overlay-scrollbar";
import SearchInput from "components/SearchInput";
import { FlexBox } from "components/flex-box";
import { deleteModal } from "components/custom/common/alert";
import Row from "./sections/list/Row";
import { DarkButton } from "components/custom/button/DarkButton";

const TABLE_HEAD = [
    { id: "title", label: "Title", align: "left", sort: true, width: "20%" },
    { id: "status", label: "Status", align: "left", sort: true, width: "20%" },
    { id: "id", label: "Actions", align: "right" },
];


const ListPage = ({ }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const [search, setSearch] = useState('');
    const [tableData, setTableData] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const { count, pages, isLoading } = useSelector((state) => state?.cms)

    const {
        page,
        order,
        orderBy,
        rowsPerPage,
        setPage,
        onSort,
        onChangePage,
        rowPerPageOptions,
        onChangeRowsPerPage,
    } = useTable({ defaultOrderBy: 'created_at' });

    useEffect(() => {
        dispatch(getPages({
            search: search,
            page: page + 1,
            order: order,
            orderBy: orderBy,
            rowsPerPage: rowsPerPage,
        })).then()
            .catch((rejectedValueOrSerializedError) => {
                enqueueSnackbar((rejectedValueOrSerializedError?.message || "Something went wrong!"), { variant: 'error' });
                console.log('rejectedValueOrSerializedError', rejectedValueOrSerializedError);
            });
    }, [refresh, page, search, order, orderBy, rowsPerPage]);

    useEffect(() => {
        if (pages?.length) {
            setTableData(pages);
        } else {
            setTableData([]);
        }
    }, [pages]);

    const handleSearch = (search) => {
        setSearch(search);
        setPage(0);
    };

    const handleEditRow = (id) => id ? router?.push(ROUTES?.ADMIN?.CMS?.PAGE?.EDIT(id)) : null;

    const handleDeleteRow = (recordId) => {
        if (recordId) {
            const onConfirm = () => {
                dispatch(deletePage(recordId))
                    .then((originalPromiseResult) => {
                        enqueueSnackbar(originalPromiseResult?.message, { variant: 'success' });
                        setRefresh(!refresh);
                    })
                    .catch((rejectedValueOrSerializedError) => {
                        enqueueSnackbar((rejectedValueOrSerializedError?.message || "Something went wrong!"), { variant: 'error' });
                    });
            }
            deleteModal(onConfirm);
        }
    }

    const isNotFound = count < 1;
    const loading = isLoading;

    return (
        <PageWrapper title="Page Management">
            <FlexBox mb={2} gap={2} justifyContent="space-between" flexWrap="wrap">
                <SearchInput placeholder="Search Page..." onChange={e => handleSearch(e.target.value)} />
                <DarkButton href={ROUTES?.ADMIN?.CMS?.PAGE?.ADD} variant="contained" startIcon={<Add />} LinkComponent={Link}>Add Page</DarkButton>
            </FlexBox>
            <Box sx={{ py: 1 }}>
                {loading && <LinearProgress sx={{ color: "#4e96fe" }} color="inherit" />}
            </Box>
            <Card>
                <OverlayScrollbar>
                    <TableContainer sx={{ minWidth: 900 }}>
                        <Table sx={{ tableLayout: "fixed" }}>
                            <TableHeader order={order} orderBy={orderBy} heading={TABLE_HEAD} onRequestSort={onSort} />

                            <TableBody>
                                {tableData.map((record) => <Row key={record.id} record={record} onEditRow={() => handleEditRow(record?.id)} onDeleteRow={() => handleDeleteRow(record?.id)} />)}
                            </TableBody>
                        </Table>
                        {isNotFound && <Typography textAlign="center" my={2}>No Records Found!</Typography>}
                    </TableContainer>
                </OverlayScrollbar>

                <Stack alignItems="center" my={4}>
                    <TablePagination
                        component="div"
                        count={count}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={onChangePage}
                        onRowsPerPageChange={onChangeRowsPerPage}
                        rowsPerPageOptions={rowPerPageOptions}
                        showFirstButton
                        showLastButton
                    />
                </Stack>
            </Card>
        </PageWrapper>
    );
};
export default ListPage;