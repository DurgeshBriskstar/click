import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Divider, Stack, Grid, IconButton, } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { formatDateTime } from "utils/formats";

export default function ViewDetailsDialog({ open, onClose, record }) {
    if (!record) return null;

    const { full_name, email, phone, createdAt, ...otherFields } = record;

    // Get all other fields from the record (dynamic form fields)
    const otherFieldsArray = Object.entries(otherFields)
        .filter(([key]) => key !== 'id' && key !== 'createdAt')
        .map(([key, value]) => ({ key, value }));

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2, }, }}>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" component="div" fontWeight={600}>
                        Franchise Request Details
                    </Typography>
                    <IconButton aria-label="close" onClick={onClose} sx={{ color: (theme) => theme.palette.grey[500], }}>
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

                    {/* Dynamic Form Fields */}
                    {otherFieldsArray.length > 0 && (
                        <>
                            {otherFieldsArray.map((field, index) => (
                                <Box key={index}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        {field.key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                    </Typography>
                                    <Typography variant="body1" fontWeight={500}>
                                        {typeof field.value === 'object' ? JSON.stringify(field.value) : (field.value || "-")}
                                    </Typography>
                                    {index < otherFieldsArray.length - 1 && <Divider sx={{ mt: 2 }} />}
                                </Box>
                            ))}
                            <Divider />
                        </>
                    )}

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

