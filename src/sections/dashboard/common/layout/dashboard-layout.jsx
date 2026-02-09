"use client";
import { useEffect } from "react";
import Container from "@mui/material/Container";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { loadUser } from "store/slices/authSlice";
import { setSelectedStoreId } from "store/slices/storeSlice";
import { SUPER_ADMIN_ROLE, STORE_ADMIN_ROLE } from "utils/constants";
import BodyWrapper from "./dashboard-body-wrapper";
import DashboardNavbar from "./dashboard-navbar/dashboard-navbar";
import DashboardSidebar from "./dashboard-sidebar/dashboard-sidebar";
import { LayoutProvider } from "./layout-context";
import FullScreenLoader from "components/custom/common/FullScreenLoader";

export default function DashboardLayout({ stores, children }) {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { user, isLoading } = useSelector((state) => state.auth);
  const { selectedStoreId } = useSelector((state) => state.store);

  const isAdminDashboard = pathname === "/admin/dashboard";
  const isStoreDashboard = pathname === "/store/dashboard";
  const isSuperAdmin = user?.role === SUPER_ADMIN_ROLE;
  const isStoreAdmin = user?.role === STORE_ADMIN_ROLE;

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  // Set selectedStoreId early when user and stores are available
  useEffect(() => {
    if (selectedStoreId === null && user && stores?.length > 0) {
      if (isStoreAdmin && user?.store_id) {
        // Store admin: always use their own store
        // Convert to number if it's a string
        const storeId = typeof user.store_id === 'string' ? parseInt(user.store_id, 10) : user.store_id;
        const userStore = stores.find((store) => {
          // Handle both string and number comparison
          const sId = typeof store.id === 'string' ? parseInt(store.id, 10) : store.id;
          return sId === storeId;
        });

        if (userStore) {
          dispatch(setSelectedStoreId(userStore.id)); // Use the actual store.id from the found store
        } else if (stores.length > 0) {
          // Fallback to first store
          dispatch(setSelectedStoreId(stores[0]?.id));
        }
      } else if (isSuperAdmin && isAdminDashboard) {
        // Super admin: use first store or user's store_id if available
        const defaultStoreId = user?.store_id
          ? (typeof user.store_id === 'string' ? parseInt(user.store_id, 10) : user.store_id)
          : stores[0]?.id;
        if (defaultStoreId) {
          dispatch(setSelectedStoreId(defaultStoreId));
        }
      } else if (stores.length > 0) {
        // Fallback: use first store
        dispatch(setSelectedStoreId(stores[0]?.id));
      }
    }
  }, [user, stores, selectedStoreId, isStoreAdmin, isSuperAdmin, isAdminDashboard, dispatch]);

  return (
    <LayoutProvider stores={stores}>
      {isLoading && <FullScreenLoader />}
      <DashboardSidebar />

      <BodyWrapper>
        <DashboardNavbar user={user} stores={stores} />
        <Container maxWidth="xl">{children}</Container>
      </BodyWrapper>
    </LayoutProvider>
  );
}