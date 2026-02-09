"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import { FlexBetween } from "components/flex-box";
import { useLayout } from "sections/dashboard/common/layout/layout-context";
import { getContactInquiryCount, getAppointmentInquiryCount, resetCounts } from "store/slices/inquiries/dashboardInquiry";
import { format } from "date-fns";

export default function InquiryStatCard({ type = "contact" }) {
    const dispatch = useDispatch();
    const { selectedStoreId } = useSelector((state) => state.store);
    const { user } = useSelector((state) => state?.auth);
    const { contactInquiryCount, appointmentInquiryCount, isLoading, startDate, endDate } = useSelector((state) => state.dashboardInquiry);
    const { stores } = useLayout();

    let selectedStore = stores?.find((store) => store?.id === selectedStoreId);

    if (!selectedStore && stores?.length > 0 && user?.store_id) {
        const userStoreId = typeof user.store_id === 'string' ? parseInt(user.store_id, 10) : user.store_id;
        selectedStore = stores.find((store) => {
            const storeId = typeof store.id === 'string' ? parseInt(store.id, 10) : store.id;
            return storeId === userStoreId;
        });
    }

    if (!selectedStore && stores?.length > 0) {
        selectedStore = stores[0];
    }

    const hasContactFormConfig = selectedStore?.highlevel_api_key && selectedStore?.settings?.contact_form_id;
    const hasAppointmentConfig = selectedStore?.highlevel_api_key && selectedStore?.settings?.appointment_calendar_form_id;

    const isContact = type === "contact";
    const hasConfig = isContact ? hasContactFormConfig : hasAppointmentConfig;

    const effectiveStoreId = selectedStoreId || (selectedStore?.id) || (user?.store_id ? (typeof user.store_id === 'string' ? parseInt(user.store_id, 10) : user.store_id) : null);

    useEffect(() => {
        if (effectiveStoreId && selectedStore && hasConfig) {
            // Don't make API call if dates are missing
            if (!startDate || !endDate) {
                return;
            }

            if (isContact && hasContactFormConfig) {
                const params = {
                    storeId: effectiveStoreId,
                };
                if (startDate && endDate) {
                    params.startAt = format(new Date(startDate), "yyyy-MM-dd");
                    params.endAt = format(new Date(endDate), "yyyy-MM-dd");
                }
                dispatch(getContactInquiryCount(params));
            }

            if (!isContact && hasAppointmentConfig) {
                const params = {
                    storeId: effectiveStoreId,
                };
                if (startDate && endDate) {
                    params.startDate = new Date(startDate).getTime();
                    params.endDate = new Date(endDate).getTime();
                }
                dispatch(getAppointmentInquiryCount(params));
            }
        } else if (!effectiveStoreId) {
            dispatch(resetCounts());
        }
    }, [effectiveStoreId, startDate, endDate, hasConfig, isContact, selectedStore, dispatch]);

    const count = isContact ? contactInquiryCount : appointmentInquiryCount;
    const title = isContact ? "Contact Inquiries" : "Appointments";
    const color = isContact ? "info.main" : "warning.main";

    return (
        <Card className="p-1">
            <Typography variant="h6" sx={{ mb: 1, color: "grey.600" }}>
                {title}
            </Typography>

            {isLoading ? (
                <Skeleton animation="wave" height={50} width={80} />
            ) : (
                <Typography variant="h3" sx={{ mb: 0.3 }}>
                    {hasConfig ? count.toLocaleString() : "-"}
                </Typography>
            )}

            <FlexBetween>
                <Typography variant="h6" sx={{ color: "grey.500" }}>
                    {hasConfig ? "Total" : "Not configured"}
                </Typography>

                {hasConfig && (
                    <Image
                        src="/backend-assets/sso-logins/highlevel.png"
                        alt="HighLevel"
                        width={80}
                        height={24}
                        style={{ objectFit: "contain" }}
                    />
                )}
            </FlexBetween>
        </Card>
    );
}

