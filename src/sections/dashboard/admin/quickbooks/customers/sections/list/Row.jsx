import { useState } from "react";
import { Tooltip, IconButton } from "@mui/material";
import { Visibility as VisibilityIcon } from "@mui/icons-material";
import { StyledTableRow, StyledTableCell } from "components/custom/common/commonStyles";
import ViewDetailsDialog from "./ViewDetailsDialog";

export default function Row({ record }) {
    const [open, setOpen] = useState(false);
    const displayName = record?.DisplayName ?? record?.FullyQualifiedName ?? "-";
    const companyName = record?.CompanyName ?? "-";
    const email = record?.PrimaryEmailAddr?.Address ?? "-";
    const phone = record?.PrimaryPhone?.FreeFormNumber ?? "-";
    const id = record?.Id ?? record?.id ?? "-";

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <StyledTableRow tabIndex={-1}>
                <StyledTableCell align="left">{id}</StyledTableCell>
                <StyledTableCell align="left">{displayName}</StyledTableCell>
                <StyledTableCell align="left">{companyName}</StyledTableCell>
                <StyledTableCell align="left">{email}</StyledTableCell>
                <StyledTableCell align="left">{phone}</StyledTableCell>
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
