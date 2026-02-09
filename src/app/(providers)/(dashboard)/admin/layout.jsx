import { cookies } from 'next/headers';
import { jwtVerify } from "jose";
import { SUPER_ADMIN_ROLE } from 'utils/constants';
import DashboardLayout from "sections/dashboard/common/layout";
import AccessDenied from 'components/custom/common/AccessDenied';
import { getActiveStoreRecords } from 'server/services/store.service';

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

  const storeData = await getActiveStoreRecords();

  const activeStores = storeData?.data?.filter(store => store?.highlevel_api_key) || [];

  const allowedRoles = [SUPER_ADMIN_ROLE];
  if (!allowedRoles.includes(user?.role)) {
    return <AccessDenied />;
  }

  return <DashboardLayout stores={activeStores}>{children}</DashboardLayout>;
}