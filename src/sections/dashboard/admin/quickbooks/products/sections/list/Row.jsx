import { useState } from "react";
import { Tooltip, IconButton } from "@mui/material";
import { Visibility as VisibilityIcon } from "@mui/icons-material";
import { StyledTableRow, StyledTableCell } from "components/custom/common/commonStyles";
import ViewDetailsDialog from "./ViewDetailsDialog";

export default function Row({ record }) {
    const [open, setOpen] = useState(false);
    const id = record?.Id ?? record?.id ?? "-";
    const name = record?.Name ?? "-";
    const type = record?.Type ?? "-";
    const sku = record?.Sku ?? "-";
    const qtyOnHand = record?.QtyOnHand != null ? record.QtyOnHand : "-";
    const unitPrice = record?.UnitPrice != null ? record.UnitPrice : "-";

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <StyledTableRow tabIndex={-1}>
                <StyledTableCell align="left">{id}</StyledTableCell>
                <StyledTableCell align="left">{name}</StyledTableCell>
                <StyledTableCell align="left">{type}</StyledTableCell>
                <StyledTableCell align="left">{sku}</StyledTableCell>
                <StyledTableCell align="right">{qtyOnHand}</StyledTableCell>
                <StyledTableCell align="right">{unitPrice}</StyledTableCell>
                <StyledTableCell align="center">
                    <Tooltip title="View Details">
                        <IconButton
                            size="small"
                            onClick={handleOpen}
                            sx={{
                                color: "primary.main",
                                "&:hover": {
                                    backgroundColor: "primary.lighter",
                                },
                            }}
                        >
                            <VisibilityIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </StyledTableCell>
            </StyledTableRow>

            <ViewDetailsDialog open={open} onClose={handleClose} record={record} />
        </>
    );
}
