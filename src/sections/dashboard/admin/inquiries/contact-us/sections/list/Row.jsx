import { useState } from "react";
import { Tooltip, IconButton } from "@mui/material";
import { Visibility as VisibilityIcon } from "@mui/icons-material";
import { StyledTableRow, StyledTableCell } from "components/custom/common/commonStyles";
import { formatDateTime } from "utils/formats";
import ViewDetailsDialog from "./ViewDetailsDialog";

export default function Row({ record }) {
    const [open, setOpen] = useState(false);
    const { full_name, email, phone, createdAt, contact_service, contact_write_message } = record;

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <StyledTableRow tabIndex={-1}>
                <StyledTableCell align="left">{full_name || ""}</StyledTableCell>
                <StyledTableCell align="left">{email || ""}</StyledTableCell>
                <StyledTableCell align="left">{phone || ""}</StyledTableCell>
                <StyledTableCell align="left">{contact_service || ""}</StyledTableCell>
                <StyledTableCell align="left">
                    {contact_write_message?.length > 30 ? <Tooltip title={contact_write_message}>{`${contact_write_message?.substring(0, 30)}...`}</Tooltip> : contact_write_message}
                </StyledTableCell>
                <StyledTableCell align="left">{createdAt ? formatDateTime(createdAt) : "-"}</StyledTableCell>
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

