import { Edit, Delete } from "@mui/icons-material";
import { Box, Chip, Typography } from "@mui/material";
import { StyledTableRow, StyledTableCell, StyledIconButton } from "components/custom/common/commonStyles";
import { STATUS_ACTIVE, STATUS_INACTIVE, SUPER_ADMIN_ROLE } from "utils/constants";

export default function Row({ record, onEditRow, onDeleteRow }) {

    const { first_name, last_name, email, role, status, stores } = record;

    const getStatusLabel = (status) => {
        return status === STATUS_ACTIVE ? "Active" : "Inactive";
    };

    const getStatusColor = (status) => {
        return status === STATUS_ACTIVE ? "success" : status === STATUS_INACTIVE ? "error" : "default";
    };

    const getRoleLabel = (role) => {
        return role === SUPER_ADMIN_ROLE ? "Super Admin" : "Store Admin";
    };

    const getRoleColor = (role) => {
        return role === SUPER_ADMIN_ROLE ? "primary" : "secondary";
    };

    return (
        <StyledTableRow tabIndex={-1} role="checkbox">
            <StyledTableCell align="left">
                {first_name || ""} {last_name || ""}
            </StyledTableCell>

            <StyledTableCell align="left">{email || ""}</StyledTableCell>

            <StyledTableCell align="left">
                <Chip label={getRoleLabel(role)} color={getRoleColor(role)} size="small" variant="outlined" />
            </StyledTableCell>

            <StyledTableCell align="left">{stores?.store_name || "-"}</StyledTableCell>

            <StyledTableCell align="center">
                <Chip label={getStatusLabel(status)} color={getStatusColor(status)} size="small" />
            </StyledTableCell>

            <StyledTableCell align="right">
                <Box display="flex" justifyContent="end" gap={1}>
                    <StyledIconButton color="info" onClick={() => onEditRow()}>
                        <Edit />
                    </StyledIconButton>
                    <StyledIconButton color="error" onClick={() => { onDeleteRow(); }}>
                        <Delete />
                    </StyledIconButton>
                </Box>
            </StyledTableCell>
        </StyledTableRow>
    );
}

