import Link from "next/link";
import Avatar from "@mui/material/Avatar";
import { useSelector } from "react-redux";
import { useSiteSettings } from "contexts/SiteContext";
import { useLayout } from "../layout-context";
import { ChevronLeftIcon } from "./styles";
import { ROUTES } from "utils/routes";
import FlexBetween from "components/flex-box/flex-between";
import { STORE_ADMIN_ROLE, SUPER_ADMIN_ROLE } from "utils/constants";

export default function LogoArea() {
  const siteSettings = useSiteSettings();
  const { TOP_HEADER_AREA, COMPACT, sidebarCompact, handleSidebarCompactToggle } = useLayout();
  const { user, loading } = useSelector(state => state?.auth);

  const userRole = user?.role || null;

  const redirectUrl = (userRole === SUPER_ADMIN_ROLE) ? ROUTES?.ADMIN?.DASHBOARD : (userRole === STORE_ADMIN_ROLE) ? ROUTES?.STORE?.DASHBOARD : ROUTES?.HOMEPAGE;


  return (
    <FlexBetween p={2} maxHeight={TOP_HEADER_AREA} justifyContent={COMPACT ? "center" : "space-between"}>
      <Link href={redirectUrl}>
        <Avatar alt="ClickITCo Logo" src={siteSettings?.site_logo || "/assets/imagess/logo.png"} sx={{ borderRadius: 0, height: '60px', width: "auto", marginLeft: COMPACT ? 0 : 10 }} />
      </Link>
      <ChevronLeftIcon color="disabled" compact={COMPACT} onClick={handleSidebarCompactToggle} sidebar_compact={sidebarCompact ? 1 : 0} />
    </FlexBetween>
  );
}