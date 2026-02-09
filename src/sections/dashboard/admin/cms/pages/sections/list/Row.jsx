import { Edit, Delete } from "@mui/icons-material";
import { StyledTableRow, StyledTableCell, StyledIconButton, StyledTableTextCell, StatusWrapper } from "components/custom/common/commonStyles";

export default function Row({ record, onEditRow, onDeleteRow }) {

    const { title, status } = record;

    return (
        <StyledTableRow tabIndex={-1} role="checkbox">
            <StyledTableCell align="left">{title || ""} </StyledTableCell>
            <StyledTableCell align="left"><StatusWrapper status={status} align="left">{status || ""} </StatusWrapper> </StyledTableCell>


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