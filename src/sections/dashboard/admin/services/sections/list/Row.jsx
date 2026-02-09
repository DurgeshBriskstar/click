import { Edit, Delete } from "@mui/icons-material";
import { moduleStatusOptions } from "utils/constants";
import { StyledTableRow, StyledTableCell, StyledIconButton, StatusWrapper } from "components/custom/common/commonStyles";

export default function Row({ record, onEditRow, onDeleteRow }) {
    const { service_name, status } = record;
    const statusLabel = moduleStatusOptions.find((item) => item.value === status)?.label || "-";

    return (
        <StyledTableRow tabIndex={-1} role="checkbox">
            <StyledTableCell align="left">{service_name || ""} </StyledTableCell>
            <StyledTableCell align="left"><StatusWrapper status={statusLabel} align="left">{statusLabel || ""} </StatusWrapper></StyledTableCell>

            <StyledTableCell align="right">
                <StyledIconButton color="info" onClick={() => onEditRow()} sx={{ mr: 1 }}>
                    <Edit />
                </StyledIconButton>

                <StyledIconButton color="error" onClick={() => { onDeleteRow(); }}>
                    <Delete />
                </StyledIconButton>
            </StyledTableCell>
        </StyledTableRow>
    );
}