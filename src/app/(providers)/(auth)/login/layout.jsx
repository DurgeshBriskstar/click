export const dynamic = "force-dynamic";
export const revalidate = 0;
import LoginBottom from "components/custom/common/LoginBottom";
import AuthLayout from "sections/auth/layout";

export default function Layout({ children }) {
  return <AuthLayout bottomContent={<LoginBottom />}>{children}</AuthLayout>;
}