import { Edit, Delete } from "@mui/icons-material";
import { Chip } from "@mui/material";
import { StyledTableRow, StyledTableCell, StyledIconButton } from "components/custom/common/commonStyles";

export default function Row({ record, onEditRow, onDeleteRow }) {

    const { question, service_name, show_on_stores } = record;

    return (
        <StyledTableRow tabIndex={-1} role="checkbox">
            <StyledTableCell align="left">{question || ""}</StyledTableCell>

            <StyledTableCell align="left">{service_name || "-"}</StyledTableCell>

            <StyledTableCell align="center">
                <Chip
                    label={show_on_stores ? "Yes" : "No"}
                    color={show_on_stores ? "success" : "default"}
                    size="small"
                />
            </StyledTableCell>

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

