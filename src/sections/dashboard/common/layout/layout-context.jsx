import { useState, createContext, useContext } from "react";
const TOP_HEADER_AREA = 70;
const LayoutContext = createContext({});
export const useLayout = () => useContext(LayoutContext);

export const LayoutProvider = ({ children, stores = [] }) => {
  const [isSidebarHover, setIsSidebarHover] = useState(false);
  const [sidebarCompact, setSidebarCompact] = useState(false);
  const [showMobileSideBar, setShowMobileSideBar] = useState(false);

  const handleSidebarCompactToggle = () => setSidebarCompact(!sidebarCompact);
  const handleOpenMobileSidebar = () => setShowMobileSideBar(true);
  const handleCloseMobileSidebar = () => setShowMobileSideBar(false);


  const handleSidebarHover = value => setIsSidebarHover(value);
  const COMPACT = sidebarCompact && !isSidebarHover ? 1 : 0;
  return (
    <LayoutContext.Provider value={{ COMPACT, TOP_HEADER_AREA, sidebarCompact, isSidebarHover, showMobileSideBar, stores, handleSidebarHover, handleOpenMobileSidebar, handleCloseMobileSidebar, handleSidebarCompactToggle }}>
      {children}
    </LayoutContext.Provider>
  );
};