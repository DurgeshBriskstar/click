import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import Collapse from "@mui/material/Collapse";

// LOCAL CUSTOM COMPONENTS
import ButtonContent from "./button-content";

// STYLED COMPONENTS
import { NavItemButton, ChevronRightIcon, NavExpandRoot } from "../styles";

// CUSTOM DATA MODEL


// ================================================================


// ================================================================

export default function SidebarAccordion({
  item,
  children
}) {
  const {
    name,
    icon
  } = item;
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const handleClick = () => setCollapsed(state => !state);
  const isActive = useMemo(() => {
    const findPath = cat => {
      if (cat.children) {
        return cat.children.some(child => child.path === pathname || findPath(child));
      }
      return false;
    };
    return findPath(item);
  }, [item, pathname]);
  useEffect(() => {
    if (isActive) setCollapsed(true);else setCollapsed(false);
  }, [isActive]);
  return <NavExpandRoot className="subMenu">
      <NavItemButton disableRipple disableTouchRipple active={isActive} onClick={handleClick} sx={{
      justifyContent: "space-between"
    }}>
        <ButtonContent name={name} icon={icon} />
        <ChevronRightIcon collapsed={collapsed ? 1 : 0} />
      </NavItemButton>

      <Collapse in={collapsed} unmountOnExit>
        <div className="expansion-panel">{children}</div>
      </Collapse>
    </NavExpandRoot>;
}