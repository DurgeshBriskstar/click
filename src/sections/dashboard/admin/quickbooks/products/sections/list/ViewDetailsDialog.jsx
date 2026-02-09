import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Divider, Stack, Grid, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

export default function ViewDetailsDialog({ open, onClose, record }) {
    if (!record) return null;

    const name = record?.Name ?? "-";
    const description = record?.Description ?? "-";
    const type = record?.Type ?? "-";
    const sku = record?.Sku ?? "-";
    const fullyQualifiedName = record?.FullyQualifiedName ?? "-";
    const active = record?.Active;
    const taxable = record?.Taxable;

    const unitPrice = record?.UnitPrice != null ? record.UnitPrice : "-";
    const qtyOnHand = record?.QtyOnHand != null ? record.QtyOnHand : "-";
    const purchaseCost = record?.PurchaseCost != null ? record.PurchaseCost : "-";
    const ratePercent = record?.RatePercent != null ? record.RatePercent : "-";

    const reorderPoint = record?.ReorderPoint != null ? record.ReorderPoint : "-";
    const qtyOnPurchaseOrder = record?.QtyOnPurchaseOrder != null ? record.QtyOnPurchaseOrder : "-";
    const qtyOnSalesOrder = record?.QtyOnSalesOrder != null ? record.QtyOnSalesOrder : "-";

    const incomeAccountRef = record?.IncomeAccountRef?.name ?? "-";
    const expenseAccountRef = record?.ExpenseAccountRef?.name ?? "-";
    const assetAccountRef = record?.AssetAccountRef?.name ?? "-";

    const metaCreateTime = record?.MetaData?.CreateTime ?? "-";
    const metaLastUpdated = record?.MetaData?.LastUpdatedTime ?? "-";

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" component="div" fontWeight={600}>
                        QuickBooks Product / Item Details
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
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Name</Typography>
                                <Typography variant="body1" fontWeight={500}>{name}</Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Fully Qualified Name</Typography>
                                <Typography variant="body1" fontWeight={500}>{fullyQualifiedName}</Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Type</Typography>
                                <Typography variant="body1" fontWeight={500}>{type}</Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>SKU</Typography>
                                <Typography variant="body1" fontWeight={500}>{sku}</Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Description</Typography>
                                <Typography variant="body1" fontWeight={500}>{description}</Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Active</Typography>
                                <Typography variant="body1" fontWeight={500}>{active == null ? "-" : active ? "Yes" : "No"}</Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Taxable</Typography>
                                <Typography variant="body1" fontWeight={500}>{taxable == null ? "-" : taxable ? "Yes" : "No"}</Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    <Divider />

                    <Typography variant="subtitle2" color="text.secondary">
                        Pricing & Quantity
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Unit Price</Typography>
                                <Typography variant="body1" fontWeight={500}>{unitPrice}</Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Qty On Hand</Typography>
                                <Typography variant="body1" fontWeight={500}>{qtyOnHand}</Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Purchase Cost</Typography>
                                <Typography variant="body1" fontWeight={500}>{purchaseCost}</Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Rate Percent</Typography>
                                <Typography variant="body1" fontWeight={500}>{ratePercent}</Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Reorder Point</Typography>
                                <Typography variant="body1" fontWeight={500}>{reorderPoint}</Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Qty On Purchase Order</Typography>
                                <Typography variant="body1" fontWeight={500}>{qtyOnPurchaseOrder}</Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Qty On Sales Order</Typography>
                                <Typography variant="body1" fontWeight={500}>{qtyOnSalesOrder}</Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    <Divider />

                    <Typography variant="subtitle2" color="text.secondary">
                        Account References
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Income Account</Typography>
                                <Typography variant="body1" fontWeight={500}>{incomeAccountRef}</Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Expense Account</Typography>
                                <Typography variant="body1" fontWeight={500}>{expenseAccountRef}</Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Asset Account</Typography>
                                <Typography variant="body1" fontWeight={500}>{assetAccountRef}</Typography>
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
