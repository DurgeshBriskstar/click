import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Divider,
    Stack,
    Grid,
    IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { formatDateTime } from "utils/formats";

export default function ViewDetailsDialog({ open, onClose, record }) {
    if (!record) return null;

    const { full_name, email, phone, createdAt, contact_service, contact_write_message } = record;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                },
            }}
        >
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" component="div" fontWeight={600}>
                        Contact Inquiry Details
                    </Typography>
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent dividers sx={{ p: 3 }}>
                <Stack spacing={3}>
                    {/* Contact Information Row */}
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Name
                                </Typography>
                                <Typography variant="body1" fontWeight={500}>
                                    {full_name || "-"}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Email
                                </Typography>
                                <Typography variant="body1" fontWeight={500}>
                                    {email || "-"}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Phone
                                </Typography>
                                <Typography variant="body1" fontWeight={500}>
                                    {phone || "-"}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    <Divider />

                    {/* Service */}
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Service
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                            {contact_service || "-"}
                        </Typography>
                    </Box>

                    <Divider />

                    {/* Message */}
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Message
                        </Typography>
                        <Box
                            sx={{
                                p: 2,
                                borderRadius: 1,
                                backgroundColor: "grey.50",
                                maxHeight: "300px",
                                overflowY: "auto",
                                border: "1px solid",
                                borderColor: "divider",
                            }}
                        >
                            <Typography
                                variant="body1"
                                sx={{
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-word",
                                    lineHeight: 1.7,
                                }}
                            >
                                {contact_write_message || "-"}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider />

                    {/* Submitted At */}
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Submitted At
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                            {createdAt ? formatDateTime(createdAt) : "-"}
                        </Typography>
                    </Box>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} variant="contained" color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

