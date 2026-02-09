"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Box, Card, Table, TableBody, TableContainer, Typography, LinearProgress, Button } from "@mui/material";
import ArrowForward from "@mui/icons-material/ArrowForward";
import { TableHeader } from "components/data-table";
import OverlayScrollbar from "components/overlay-scrollbar";
import { FlexBetween } from "components/flex-box";
import { useLayout } from "sections/dashboard/common/layout/layout-context";
import { StyledTableRow, StyledTableCell } from "components/custom/common/commonStyles";
import { formatDateTime } from "utils/formats";
import secureAxiosInstance from "lib/secureAxiosInstance";
import { format } from "date-fns";
import { ROUTES } from "utils/routes";

// Table headers for contact inquiries
const CONTACT_TABLE_HEAD = [
    { id: "name", label: "Name", align: "left" },
    { id: "email", label: "Email", align: "left" },
    { id: "phone", label: "Phone", align: "left" },
    { id: "createdAt", label: "Submitted At", align: "left" },
];

// Table headers for appointment inquiries
const APPOINTMENT_TABLE_HEAD = [
    { id: "name", label: "Name", align: "left" },
    { id: "email", label: "Email", align: "left" },
    { id: "status", label: "Status", align: "left" },
    { id: "createdAt", label: "Submitted At", align: "left" },
];

// Contact Row Component
function ContactRow({ record }) {
    const { full_name, email, phone, createdAt } = record;
    return (
        <StyledTableRow tabIndex={-1}>
            <StyledTableCell align="left">{full_name || "-"}</StyledTableCell>
            <StyledTableCell align="left">{email || "-"}</StyledTableCell>
            <StyledTableCell align="left">{phone || "-"}</StyledTableCell>
            <StyledTableCell align="left">{createdAt ? formatDateTime(createdAt) : "-"}</StyledTableCell>
        </StyledTableRow>
    );
}

// Appointment Row Component
function AppointmentRow({ record }) {
    const { contact, appointmentStatus, createdAt } = record;
    const name = contact ? `${contact?.firstName || ""} ${contact?.lastName || ""}`.trim() : "-";
    return (
        <StyledTableRow tabIndex={-1}>
            <StyledTableCell align="left">{name || "-"}</StyledTableCell>
            <StyledTableCell align="left">{contact?.email || "-"}</StyledTableCell>
            <StyledTableCell align="left" sx={{ textTransform: "capitalize" }}>{appointmentStatus || "-"}</StyledTableCell>
            <StyledTableCell align="left">{createdAt ? formatDateTime(createdAt) : "-"}</StyledTableCell>
        </StyledTableRow>
    );
}

export default function RecentInquiriesTable({ type = "contact" }) {
    const { selectedStoreId } = useSelector((state) => state.store);
    const { user } = useSelector((state) => state?.auth);
    const { startDate, endDate } = useSelector((state) => state.dashboardInquiry);
    const { stores } = useLayout();

    const [inquiries, setInquiries] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Find selected store, with fallback to user's store_id for store admin
    let selectedStore = stores?.find((store) => {
        const sId = typeof store.id === 'string' ? parseInt(store.id, 10) : store.id;
        const selId = typeof selectedStoreId === 'string' ? parseInt(selectedStoreId, 10) : selectedStoreId;
        return sId === selId;
    });

    // Fallback: if no selectedStore but stores exist and user has store_id, use that
    if (!selectedStore && stores?.length > 0 && user?.store_id) {
        const userStoreId = typeof user.store_id === 'string' ? parseInt(user.store_id, 10) : user.store_id;
        selectedStore = stores.find((store) => {
            const sId = typeof store.id === 'string' ? parseInt(store.id, 10) : store.id;
            return sId === userStoreId;
        });
    }

    // Final fallback: use first store
    if (!selectedStore && stores?.length > 0) {
        selectedStore = stores[0];
    }

    // Use selectedStore's id or fallback to user's store_id
    const effectiveStoreId = selectedStore?.id || selectedStoreId || (user?.store_id ? (typeof user.store_id === 'string' ? parseInt(user.store_id, 10) : user.store_id) : null);

    const isContact = type === "contact";
    const hasContactFormConfig = selectedStore?.highlevel_api_key && selectedStore?.settings?.contact_form_id;
    const hasAppointmentConfig = selectedStore?.highlevel_api_key && selectedStore?.settings?.appointment_calendar_form_id;
    const hasConfig = isContact ? hasContactFormConfig : hasAppointmentConfig;

    const pathname = usePathname();
    const isStoreDashboard = pathname?.includes("/store/");

    const title = isContact ? "Recent 10 Contact Inquiries" : "Recent 10 Appointments";
    const seeAllLink = isStoreDashboard
        ? (isContact ? ROUTES?.STORE?.INQUIRIES?.CONTACT?.LIST : ROUTES?.STORE?.INQUIRIES?.APPOINTMENT?.LIST)
        : (isContact ? ROUTES?.ADMIN?.INQUIRIES?.CONTACT?.LIST : ROUTES?.ADMIN?.INQUIRIES?.APPOINTMENT?.LIST);
    const tableHead = isContact ? CONTACT_TABLE_HEAD : APPOINTMENT_TABLE_HEAD;

    useEffect(() => {
        const fetchInquiries = async () => {
            if (!effectiveStoreId || !hasConfig) {
                setInquiries([]);
                return;
            }

            // Don't make API call if dates are missing
            if (!startDate || !endDate) {
                setInquiries([]);
                return;
            }

            setIsLoading(true);
            try {
                const endpoint = isContact ? "/inquiries/contact-us" : "/inquiries/appointments";
                const params = {
                    storeId: effectiveStoreId,
                    limit: 10,
                    page: 1,
                };

                if (isContact) {
                    params.startAt = format(new Date(startDate), "yyyy-MM-dd");
                    params.endAt = format(new Date(endDate), "yyyy-MM-dd");
                } else {
                    params.startDate = new Date(startDate).getTime();
                    params.endDate = new Date(endDate).getTime();
                }

                const response = await secureAxiosInstance.get(endpoint, { params });
                const data = response?.data?.data;

                // Slice to ensure only 5 records are shown (in case API returns more)
                if (isContact) {
                    setInquiries((data?.submissions || []).slice(0, 10));
                } else {
                    setInquiries((data?.appointments || []).slice(0, 10));
                }
            } catch (error) {
                console.error("Error fetching inquiries:", error);
                setInquiries([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInquiries();
    }, [effectiveStoreId, startDate, endDate, hasConfig, isContact]);

    const isNotFound = !isLoading && inquiries.length === 0;

    return (
        <Card sx={{ minHeight: "480px", height: "100%", display: "flex", flexDirection: "column" }}>
            <FlexBetween sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
                <Typography variant="h6" fontWeight={600}>{title}</Typography>
            </FlexBetween>

            {!hasConfig ? (
                <Box sx={{ p: 4, textAlign: "center", flex: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        {isContact ? "Contact form not configured for this store" : "Appointment calendar not configured for this store"}
                    </Typography>
                </Box>
            ) : (
                <>
                    <Box sx={{ height: 4 }}>
                        {isLoading && <LinearProgress sx={{ color: "#4e96fe" }} color="inherit" />}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <OverlayScrollbar>
                            <TableContainer>
                                <Table size="small">
                                    <TableHeader heading={tableHead} />
                                    <TableBody>
                                        {inquiries.map((record, index) => (
                                            isContact
                                                ? <ContactRow key={record.id || index} record={record} />
                                                : <AppointmentRow key={record.id || index} record={record} />
                                        ))}
                                    </TableBody>
                                </Table>
                                {isNotFound && (<Typography textAlign="center" my={2} color="text.secondary">No inquiries found</Typography>)}
                            </TableContainer>
                        </OverlayScrollbar>
                    </Box>

                    <Box sx={{ p: 2, textAlign: "center", borderTop: "1px solid", borderColor: "divider", mt: "auto" }}>
                        <Button component={Link} href={seeAllLink} size="small" endIcon={<ArrowForward />} sx={{ textTransform: "none" }}>
                            See All
                        </Button>
                    </Box>
                </>
            )}
        </Card>
    );
}

