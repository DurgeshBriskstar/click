import { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import OverlayScrollbar from "components/overlay-scrollbar";

export default function SideNav(props) {
  const {
    position = "left",
    open = false,
    width = 280,
    children,
    handler,
    toggle
  } = props;
  const [sideNavOpen, setSideNavOpen] = useState(open);
  const handleToggleSideNav = () => setSideNavOpen(!sideNavOpen);
  useEffect(() => setSideNavOpen(open), [open]);
  const handleClose = toggle || handleToggleSideNav;
  return <div>
    <Drawer anchor={position} open={sideNavOpen} onClose={handleClose} slotProps={{
      transition: {
        style: {
          width
        }
      }
    }} sx={{
      zIndex: 15001
    }}>
      <OverlayScrollbar>{children}</OverlayScrollbar>
    </Drawer>

    {handler(handleClose)}
  </div>;
}