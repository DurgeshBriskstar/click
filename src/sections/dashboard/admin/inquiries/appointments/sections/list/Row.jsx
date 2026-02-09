import { IconButton, Tooltip } from "@mui/material";
import { Visibility as VisibilityIcon } from "@mui/icons-material";
import { StyledTableRow, StyledTableCell } from "components/custom/common/commonStyles";
import { useState } from "react";
import { formatDateTime } from "utils/formats";
import ViewDetailsDialog from "./ViewDetailsDialog";

export default function Row({ record, storeId }) {
    const [open, setOpen] = useState(false);
    const { contact, appointmentStatus, startTime, endTime, createdAt, formSubmissionId } = record;
    const formData = record?.formData || record?.data || {};

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <StyledTableRow tabIndex={-1}>
                <StyledTableCell align="left">{`${contact?.firstName} ${contact?.lastName}`}</StyledTableCell>
                <StyledTableCell align="left">{contact?.email || ""}</StyledTableCell>
                <StyledTableCell align="left">{contact?.phone || ""}</StyledTableCell>
                <StyledTableCell align="left" sx={{ textTransform: "capitalize" }}>{appointmentStatus || ""}</StyledTableCell>
                <StyledTableCell align="left">{startTime ? formatDateTime(startTime) : "-"}</StyledTableCell>
                <StyledTableCell align="left">{endTime ? formatDateTime(endTime) : "-"}</StyledTableCell>
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

            <ViewDetailsDialog open={open} onClose={handleClose} record={record} storeId={storeId} />
        </>
    );
}

