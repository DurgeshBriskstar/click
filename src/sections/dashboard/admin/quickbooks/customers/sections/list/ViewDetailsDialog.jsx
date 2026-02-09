import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Divider, Stack, Grid, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

export default function ViewDetailsDialog({ open, onClose, record }) {
    if (!record) return null;

    const displayName = record?.DisplayName ?? record?.FullyQualifiedName ?? "-";
    const companyName = record?.CompanyName ?? "-";
    const primaryEmail = record?.PrimaryEmailAddr?.Address ?? "-";
    const primaryPhone = record?.PrimaryPhone?.FreeFormNumber ?? "-";
    const alternatePhone = record?.AlternatePhone?.FreeFormNumber ?? "-";
    const mobile = record?.Mobile?.FreeFormNumber ?? "-";
    const fax = record?.Fax?.FreeFormNumber ?? "-";
    const webAddr = record?.WebAddr?.URI ?? "-";
    const printOnCheckName = record?.PrintOnCheckName ?? "-";
    const active = record?.Active;
    const taxable = record?.Taxable;
    const balance = record?.Balance != null ? record.Balance : "-";
    const balanceWithJobs = record?.BalanceWithJobs != null ? record.BalanceWithJobs : "-";

    const billAddr = record?.BillAddr;
    const billAddrLines = billAddr
        ? [billAddr.Line1, billAddr.Line2, billAddr.Line3, billAddr.Line4, billAddr.Line5].filter(Boolean).join(", ")
        : "-";
    const billAddrCity = billAddr?.City ?? "-";
    const billAddrCountry = billAddr?.Country ?? "-";
    const billAddrPostalCode = billAddr?.PostalCode ?? "-";

    const metaCreateTime = record?.MetaData?.CreateTime ?? "-";
    const metaLastUpdated = record?.MetaData?.LastUpdatedTime ?? "-";

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" component="div" fontWeight={600}>
                        QuickBooks Customer Details
                    </Typography>
                    <IconButton aria-label="close" onClick={onClose} sx={{ color: (theme) => theme.palette.grey[500] }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent dividers sx={{ p: 3 }}>
                <Stack spacing={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                        Basic Information
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Display Name</Typography>
                                <Typography variant="body1" fontWeight={500}>{displayName}</Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Company Name</Typography>
                                <Typography variant="body1" fontWeight={500}>{companyName}</Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Print On Check Name</Typography>
                                <Typography variant="body1" fontWeight={500}>{printOnCheckName}</Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Active</Typography>
                                <Typography variant="body1" fontWeight={500}>{active == null ? "-" : active ? "Yes" : "No"}</Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    <Divider />

                    <Typography variant="subtitle2" color="text.secondary">
                        Contact Information
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Primary Email</Typography>
                                <Typography variant="body1" fontWeight={500}>{primaryEmail}</Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Primary Phone</Typography>
                                <Typography variant="body1" fontWeight={500}>{primaryPhone}</Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Alternate Phone</Typography>
                                <Typography variant="body1" fontWeight={500}>{alternatePhone}</Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Mobile</Typography>
                                <Typography variant="body1" fontWeight={500}>{mobile}</Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Fax</Typography>
                                <Typography variant="body1" fontWeight={500}>{fax}</Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Website</Typography>
                                <Typography variant="body1" fontWeight={500}>{webAddr}</Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    <Divider />

                    <Typography variant="subtitle2" color="text.secondary">
                        Billing Address
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Address</Typography>
                                <Typography variant="body1" fontWeight={500}>{billAddrLines}</Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>City</Typography>
                                <Typography variant="body1" fontWeight={500}>{billAddrCity}</Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Postal Code</Typography>
                                <Typography variant="body1" fontWeight={500}>{billAddrPostalCode}</Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Country</Typography>
                                <Typography variant="body1" fontWeight={500}>{billAddrCountry}</Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    <Divider />

                    <Typography variant="subtitle2" color="text.secondary">
                        Balance & Tax
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Balance</Typography>
                                <Typography variant="body1" fontWeight={500}>{balance}</Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Balance With Jobs</Typography>
                                <Typography variant="body1" fontWeight={500}>{balanceWithJobs}</Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Taxable</Typography>
                                <Typography variant="body1" fontWeight={500}>{taxable == null ? "-" : taxable ? "Yes" : "No"}</Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    <Divider />

                    <Typography variant="subtitle2" color="text.secondary">
                        Metadata
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Created (QB)</Typography>
                                <Typography variant="body1" fontWeight={500}>{metaCreateTime}</Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Last Updated (QB)</Typography>
                                <Typography variant="body1" fontWeight={500}>{metaLastUpdated}</Typography>
                            </Box>
                        </Grid>
                    </Grid>
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
