"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { styled } from "@mui/material/styles";
import clsx from "clsx";
import { ROUTES } from "utils/routes";


// STYLED COMPONENT
const StyledLink = styled(Link, {
  shouldForwardProp: prop => prop !== "active"
})(({
  theme,
  active
}) => ({
  position: "relative",
  transition: "color 150ms ease-in-out",
  color: active ? theme.palette.primary.main : "inherit",
  "&:hover": {
    color: `${theme.palette.primary.main} !important`
  }
}));


// ==============================================================


// ==============================================================

export default function NavLink({
  href,
  children,
  style,
  className,
  ...props
}) {
  const pathname = usePathname();


  // CHECK CURRENT ROUTE
  const isActive = () => {
    if (href === ROUTES?.HOMEPAGE) return pathname === href;
    return pathname.includes(href);
  };
  return <StyledLink href={href} style={style} className={clsx(className)} active={isActive() ? 1 : 0} {...props}>
    {children}
  </StyledLink>;
}