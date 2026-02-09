import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import LogoArea from "./logo-area";
import MultiLevelMenu from "./multi-level-menu";
import SSOPopup from "./sso-popup";
import { useLayout } from "../layout-context";
import { SidebarWrapper } from "./styles";
import LayoutDrawer from "../layout-drawer";

export default function DashboardSidebar() {
  const { sidebarCompact, TOP_HEADER_AREA, showMobileSideBar, handleSidebarHover, handleCloseMobileSidebar } = useLayout();
  const downLg = useMediaQuery(theme => theme.breakpoints.down("lg"));

  if (downLg) {
    return (
      <>
        <LayoutDrawer open={showMobileSideBar ? true : false} onClose={handleCloseMobileSidebar}>
          <Box p={2} maxHeight={TOP_HEADER_AREA}>
            <LogoArea />
          </Box>
          <MultiLevelMenu />
        </LayoutDrawer>
        {/* SSO Button - Draggable, renders via portal */}
        <SSOPopup />
      </>
    );
  }
  return (
    <>
      <SidebarWrapper compact={sidebarCompact ? 1 : 0} onMouseEnter={() => handleSidebarHover(true)} onMouseLeave={() => sidebarCompact && handleSidebarHover(false)}>
        <LogoArea />
        <MultiLevelMenu />
      </SidebarWrapper>
      {/* SSO Button - Draggable, renders via portal */}
      <SSOPopup />
    </>
  );
}