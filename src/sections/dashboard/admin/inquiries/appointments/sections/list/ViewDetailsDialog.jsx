import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Divider, Stack, Grid, IconButton, Chip, CircularProgress, Alert, } from "@mui/material";
import { Close as CloseIcon, Visibility as VisibilityIcon } from "@mui/icons-material";
import { formatDateTime } from "utils/formats";
import { useState } from "react";
import { useSnackbar } from "notistack";
import secureAxiosInstance from "lib/secureAxiosInstance";

export default function ViewDetailsDialog({ open, onClose, record, storeId }) {
    if (!record) return null;

    const { contact, appointmentStatus, startTime, endTime, createdAt, formSubmissionId } = record;
    const formData = record?.formData || record?.data || {};
    const name = contact ? `${contact?.firstName || ""} ${contact?.lastName || ""}`.trim() : "-";
    const { enqueueSnackbar } = useSnackbar();

    const [submissionData, setSubmissionData] = useState(null);
    const [loadingSubmission, setLoadingSubmission] = useState(false);
    const [submissionError, setSubmissionError] = useState(null);

    const handleFetchSubmission = async () => {
        if (!formSubmissionId || !storeId) {
            enqueueSnackbar("Form Submission ID or Store ID is missing", { variant: "error" });
            return;
        }

        setLoadingSubmission(true);
        setSubmissionError(null);

        try {
            const response = await secureAxiosInstance.get("/inquiries/appointments/submission", {
                params: {
                    storeId,
                    submissionId: formSubmissionId,
                },
            });

            if (response?.data?.success) {
                setSubmissionData(response.data.data);
            } else {
                setSubmissionError(response?.data?.message || "Failed to fetch submission data");
                enqueueSnackbar(response?.data?.message || "Failed to fetch submission data", { variant: "error" });
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to fetch submission data";
            setSubmissionError(errorMessage);
            enqueueSnackbar(errorMessage, { variant: "error" });
        } finally {
            setLoadingSubmission(false);
        }
    };

    // Reset submission data when dialog closes
    const handleClose = () => {
        setSubmissionData(null);
        setSubmissionError(null);
        onClose();
    };

    // Get status color
    const getStatusColor = (status) => {
        if (!status) return "default";
        const lowerStatus = status.toLowerCase();
        if (lowerStatus === "confirmed" || lowerStatus === "completed") return "success";
        if (lowerStatus === "pending" || lowerStatus === "scheduled") return "warning";
        if (lowerStatus === "cancelled" || lowerStatus === "no-show") return "error";
        return "default";
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2, }, }}>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" component="div" fontWeight={600}>
                        Appointment Inquiry Details
                    </Typography>
                    <IconButton aria-label="close" onClick={handleClose} sx={{ color: (theme) => theme.palette.grey[500], }}>
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
                                    {name || "-"}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Email
                                </Typography>
                                <Typography variant="body1" fontWeight={500}>
                                    {contact?.email || "-"}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Phone
                                </Typography>
                                <Typography variant="body1" fontWeight={500}>
                                    {contact?.phone || "-"}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    <Divider />

                    {/* Appointment Status */}
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Appointment Status
                        </Typography>
                        <Chip label={appointmentStatus || "-"} color={getStatusColor(appointmentStatus)} sx={{ textTransform: "capitalize" }} />
                    </Box>

                    <Divider />

                    {/* Appointment Time */}
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Start Time
                                </Typography>
                                <Typography variant="body1" fontWeight={500}>
                                    {startTime ? formatDateTime(startTime) : "-"}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    End Time
                                </Typography>
                                <Typography variant="body1" fontWeight={500}>
                                    {endTime ? formatDateTime(endTime) : "-"}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    <Divider />

                    {/* Form Submission ID */}
                    {/* {formSubmissionId && (
                        <>
                            <Box>
                                <Box display="flex" alignItems="center" gap={2} mb={1}>
                                    <Typography variant="subtitle2" color="text.secondary">Form Submission ID</Typography>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        startIcon={loadingSubmission ? <CircularProgress size={16} /> : <VisibilityIcon />}
                                        onClick={handleFetchSubmission}
                                        disabled={loadingSubmission || !storeId}
                                        sx={{ minWidth: 160 }}
                                    >
                                        {loadingSubmission ? "Loading..." : "View Submission Data"}
                                    </Button>
                                </Box>
                                <Typography variant="body1" fontWeight={500}>{formSubmissionId}</Typography>
                            </Box>

                            {submissionError && (<Alert severity="error" sx={{ mt: 2 }}>{submissionError}</Alert>)}

                            {submissionData && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Form Submission Data
                                    </Typography>
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 1,
                                            backgroundColor: "grey.50",
                                            maxHeight: "400px",
                                            overflowY: "auto",
                                            border: "1px solid",
                                            borderColor: "divider",
                                        }}
                                    >
                                        <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: "0.875rem" }}>
                                            {JSON.stringify(submissionData, null, 2)}
                                        </pre>
                                    </Box>
                                </Box>
                            )}

                            <Divider />
                        </>
                    )} */}

                    {/* Additional Form Data */}
                    {formData && Object.keys(formData).length > 0 && (
                        <>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Additional Information
                                </Typography>
                                <Box sx={{ p: 2, borderRadius: 1, backgroundColor: "grey.50", maxHeight: "300px", overflowY: "auto", border: "1px solid", borderColor: "divider", }}>
                                    {Object.entries(formData).map(([key, value]) => (
                                        <Box key={key} sx={{ mb: 1.5 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: "capitalize" }}>
                                                {key.replace(/([A-Z])/g, " $1").trim()}:
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                                                {typeof value === "object" ? JSON.stringify(value, null, 2) : String(value || "-")}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
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
                <Button onClick={handleClose} variant="contained" color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

