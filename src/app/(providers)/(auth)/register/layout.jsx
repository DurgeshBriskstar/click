import RegisterBottom from "components/custom/common/RegisterBottom";
import AuthLayout from "sections/auth/layout";

export default function Layout({ children }) {

  return <AuthLayout bottomContent={<RegisterBottom />}>{children}</AuthLayout>;
}