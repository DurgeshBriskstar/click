import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import OverlayScrollbar from "components/overlay-scrollbar";
import SidebarAccordion from "./sidebar-accordion";
import { useLayout } from "../layout-context";
import { AdminNavigation, storeNavigation } from "../dashboard-navigation";
import { ListLabel, BadgeValue, StyledText, BulletIcon, ExternalLink, NavItemButton, ListIconWrapper } from "./styles";
import { SUPER_ADMIN_ROLE, STORE_ADMIN_ROLE } from "utils/constants";

export default function MultiLevelMenu() {
  const pathname = usePathname();
  const { COMPACT, TOP_HEADER_AREA, handleCloseMobileSidebar } = useLayout();
  const { user, loading } = useSelector(state => state?.auth);

  if (!user) return null;

  const activeRoute = path => pathname === path ? 1 : 0;

  const renderLevels = data => {
    return data?.map((item, index) => {
      if (item.type === "label") {
        return (
          <ListLabel key={index} compact={COMPACT}>
            {item.label}
          </ListLabel>
        );
      }
      if (item.children) {
        return (
          <SidebarAccordion key={index} item={item}>
            {renderLevels(item.children)}
          </SidebarAccordion>
        );
      }
      if (item.type === "extLink") {
        return (
          <ExternalLink key={index} href={item.path} rel="noopener noreferrer" target="_blank">
            <NavItemButton key={item.name} name="child" active={0}>
              {item.icon ? <ListIconWrapper><item.icon /></ListIconWrapper> : <span className="item-icon icon-text">{item.iconText}</span>}

              <StyledText compact={COMPACT}>{item.name}</StyledText>

              {item.badge ? <BadgeValue compact={COMPACT}>{item.badge.value}</BadgeValue> : null}
            </NavItemButton>
          </ExternalLink>
        );
      }
      return (
        <Link key={index} href={item.path} passHref>
          <NavItemButton className="navItem" active={activeRoute(item.path)} onClick={handleCloseMobileSidebar}>
            {item?.icon ? <ListIconWrapper><item.icon /></ListIconWrapper> : <BulletIcon active={activeRoute(item.path)} />}

            <StyledText compact={COMPACT}>{item.name}</StyledText>

            {item.badge ? <BadgeValue compact={COMPACT}>{item.badge.value}</BadgeValue> : null}
          </NavItemButton>
        </Link>
      );
    });
  };
  return (
    <OverlayScrollbar sx={{ px: 2, overflowX: "hidden", maxHeight: `calc(100vh - ${TOP_HEADER_AREA}px)` }}>
      {user?.role === SUPER_ADMIN_ROLE && renderLevels(AdminNavigation)}
      {user?.role === STORE_ADMIN_ROLE && renderLevels(storeNavigation)}
    </OverlayScrollbar>
  );
}