import { cookies } from 'next/headers';
import { jwtVerify } from "jose";
import { STORE_ADMIN_ROLE } from 'utils/constants';
import DashboardLayout from "sections/dashboard/common/layout";
import AccessDenied from 'components/custom/common/AccessDenied';
import { getRecord as getStoreRecord } from 'server/services/store.service';

export default async function Layout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return <AccessDenied />;
  }

  let user = null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    user = payload;
  } catch (error) {
    return <AccessDenied />;
  }

  const allowedRoles = [STORE_ADMIN_ROLE];

  if (!allowedRoles.includes(user?.role)) {
    return <AccessDenied />;
  }

  let userStore = null;
  const storeId = user?.store_id ? (typeof user.store_id === 'string' ? parseInt(user.store_id, 10) : user.store_id) : null;

  if (storeId) {
    try {
      userStore = await getStoreRecord(storeId);
      // Ensure we have a valid store object
      if (!userStore || !userStore.id) {
        console.warn('Store record not found or invalid for store_id:', storeId);
        userStore = null;
      }
    } catch (error) {
      console.error('Error fetching user store:', error);
      userStore = null;
    }
  } else {
    console.warn('User does not have a store_id assigned in JWT token');
  }

  const stores = userStore ? [userStore] : [];

  return <DashboardLayout stores={stores}>{children}</DashboardLayout>;
}