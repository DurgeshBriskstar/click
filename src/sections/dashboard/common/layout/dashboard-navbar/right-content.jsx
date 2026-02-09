import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import Globe from "icons/Globe";
import { MenuItem, TextField, Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { setSelectedStoreId } from "store/slices/storeSlice";
import { setStartDate, setEndDate } from "store/slices/inquiries/dashboardInquiry";
import { SUPER_ADMIN_ROLE, STORE_ADMIN_ROLE } from "utils/constants";
import FlexBox from "components/flex-box/flex-box";
import AccountPopover from "./account-popover";
import { CustomButton } from "./styles";
import { ROUTES } from "utils/routes";

export default function RightContent({ user, stores }) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { selectedStoreId } = useSelector((state) => state.store);
  const { startDate, endDate } = useSelector((state) => state.dashboardInquiry);

  const isAdminDashboard = pathname === "/admin/dashboard";
  const isStoreDashboard = pathname === "/store/dashboard";
  const isSuperAdmin = user?.role === SUPER_ADMIN_ROLE;
  const isStoreAdmin = user?.role === STORE_ADMIN_ROLE;

  const startDateValue = startDate ? new Date(startDate) : null;
  const endDateValue = endDate ? new Date(endDate) : null;

  useEffect(() => {
    if (selectedStoreId === null && user && stores?.length > 0) {
      if (isStoreAdmin && user?.store_id) {
        const storeId = typeof user.store_id === 'string' ? parseInt(user.store_id, 10) : user.store_id;
        const userStore = stores.find((store) => store?.id === storeId);
        if (userStore) {
          dispatch(setSelectedStoreId(storeId));
        } else if (stores.length > 0) {
          dispatch(setSelectedStoreId(stores[0]?.id));
        }
      } else if (isSuperAdmin && isAdminDashboard) {
        const defaultStoreId = user?.store_id
          ? (typeof user.store_id === 'string' ? parseInt(user.store_id, 10) : user.store_id)
          : stores[0]?.id;
        if (defaultStoreId) {
          dispatch(setSelectedStoreId(defaultStoreId));
        }
      }
    }
  }, [isAdminDashboard, isStoreAdmin, isSuperAdmin, stores, user, selectedStoreId, dispatch]);

  const handleStoreChange = (event) => {
    dispatch(setSelectedStoreId(event.target.value));
  };

  const handleStartDateChange = (date) => {
    dispatch(setStartDate(date ? date.toISOString() : null));
  };

  const handleEndDateChange = (date) => {
    dispatch(setEndDate(date ? date.toISOString() : null));
  };

  const showStoreSelector = isSuperAdmin && isAdminDashboard && stores?.length > 0;
  const showDatePickers = (isAdminDashboard || isStoreDashboard);

  return (
    <FlexBox alignItems="flex-start" gap={2}>
      {showStoreSelector && (
        <TextField select color="info" size="small" name="franchise" placeholder="Franchise" label="Select Franchise" value={selectedStoreId || ""} onChange={handleStoreChange} sx={{ minWidth: "220px" }}>
          {stores?.map((store) => (<MenuItem value={store?.id} key={store?.id}>{store?.store_name}</MenuItem>))}
        </TextField>
      )}
      {showDatePickers && (
        <>
          <Box sx={{ minWidth: 150 }}>
            <DatePicker
              label="Start Date"
              value={startDateValue}
              onChange={handleStartDateChange}
              slotProps={{
                textField: {
                  size: "small",
                  sx: { minWidth: 150 },
                  error: !startDateValue,
                  helperText: !startDateValue ? "Start date is required" : ""
                },
                field: { clearable: true }
              }}
              maxDate={endDateValue || undefined}
            />
          </Box>
          <Box sx={{ minWidth: 150 }}>
            <DatePicker
              label="End Date"
              value={endDateValue}
              onChange={handleEndDateChange}
              slotProps={{
                textField: {
                  size: "small",
                  sx: { minWidth: 150 },
                  error: !endDateValue,
                  helperText: !endDateValue ? "End date is required" : ""
                },
                field: { clearable: true }
              }}
              minDate={startDateValue || undefined}
            />
          </Box>
        </>
      )}
      <CustomButton LinkComponent={Link} href={ROUTES?.HOMEPAGE} target="_blank" startIcon={<Globe sx={{ color: "white" }} />}>
        Browse Website
      </CustomButton>
      <AccountPopover user={user} />
    </FlexBox>
  );
}