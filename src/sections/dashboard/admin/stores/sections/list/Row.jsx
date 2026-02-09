import { Edit, Delete, Star, StarBorder, Sync } from "@mui/icons-material";
import { Button, Chip, Box } from "@mui/material";
import { StyledTableRow, StyledTableCell, StyledIconButton } from "components/custom/common/commonStyles";
import { STATUS_ACTIVE } from "utils/constants";

export default function Row({ record, onEditRow, onDeleteRow, onDuplicateRow, onMakePrimary }) {

    const { store_name, is_primary_store, highlevel_api_key, highlevel_location_id, status } = record;
    const isActive = status === STATUS_ACTIVE;
    const isPrimary = is_primary_store === true;
    const isSyncedWithHighlevel = (Boolean(highlevel_location_id) && Boolean(highlevel_api_key));

    return (
        <StyledTableRow
            tabIndex={-1}
            role="checkbox"
            sx={{
                "&:hover .action-btn": { opacity: 1, visibility: "visible", },
                ...(isPrimary && {
                    bgcolor: "info.lighter",
                    borderLeft: "4px solid",
                    borderLeftColor: "info.main",
                }),
            }}
        >
            <StyledTableCell align="left">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {store_name || ""}
                    {isPrimary && (
                        <Chip
                            icon={<Star sx={{ fontSize: 16 }} />}
                            label="Primary Store"
                            size="small"
                            color="info"
                            sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                        />
                    )}
                    {isSyncedWithHighlevel && (
                        <Chip
                            icon={<Sync sx={{ fontSize: 16 }} />}
                            label="Synced with Highlevel"
                            size="small"
                            color="success"
                            sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                        />
                    )}
                </Box>
            </StyledTableCell>

            <StyledTableCell align="right" sx={{ display: "flex", gap: 1 }}>

                <StyledIconButton color="error" onClick={() => { onDeleteRow(); }}>
                    <Delete />
                </StyledIconButton>

                <StyledIconButton color="info" onClick={() => onEditRow()} sx={{ mr: 1 }}>
                    <Edit />
                </StyledIconButton>

                <Button type="button" className="action-btn" variant="outlined" color="info" size="small" onClick={() => onDuplicateRow()} sx={{ opacity: 0, visibility: "hidden", transition: "opacity 0.2s ease", }}>
                    Duplicate Store
                </Button>

                {!isPrimary && (
                    <Button
                        type="button"
                        className="action-btn"
                        variant="outlined"
                        color="info"
                        size="small"
                        disabled={!isActive}
                        startIcon={<StarBorder />}
                        onClick={() => onMakePrimary()}
                        sx={{ opacity: 0, visibility: "hidden", transition: "opacity 0.2s ease", }}
                    >
                        Make Primary
                    </Button>
                )}
            </StyledTableCell>
        </StyledTableRow>
    );
}

