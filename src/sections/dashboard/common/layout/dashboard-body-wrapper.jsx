import { styled } from "@mui/material/styles";
import { useLayout } from "./layout-context";

const RootStyle = styled("div", { shouldForwardProp: prop => prop !== "compact" })(({ theme, compact }) => ({
  transition: "margin-left 0.3s",
  marginLeft: compact ? 86 : 280,
  [theme.breakpoints.down("lg")]: {
    marginLeft: 0
  }
}));

export default function BodyWrapper({ children }) {
  const { sidebarCompact } = useLayout();

  return (
    <RootStyle compact={sidebarCompact}>{children}</RootStyle>
  );
}