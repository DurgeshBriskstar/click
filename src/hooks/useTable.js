import { useState } from 'react';

const rowPerPageOptions = [5, 10, 15, 25, 50];

export default function useTable(props) {
    const [orderBy, setOrderBy] = useState(props?.defaultOrderBy || 'name');
    const [order, setOrder] = useState(props?.defaultOrder || 'desc');
    const [page, setPage] = useState(props?.defaultCurrentPage || 0);
    const [rowsPerPage, setRowsPerPage] = useState(props?.defaultRowsPerPage || 10);

    const onSort = (id) => {
        if (!id || id === "disabled") return;
        setOrder(orderBy === id && order === 'asc' ? 'desc' : 'asc');
        setOrderBy(id);
    };

    const onChangePage = (_, newPage) => setPage(newPage);

    const onChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return {
        page,
        order,
        orderBy,
        rowsPerPage,
        setPage,
        onSort,
        onChangePage,
        rowPerPageOptions,
        onChangeRowsPerPage,
    };
}
