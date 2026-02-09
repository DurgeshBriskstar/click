"use client";

import Link from "next/link";
import Image from "next/image";
import Box from "@mui/material/Box";

// GLOBAL CUSTOM COMPONENTS
import { FlexBetween, FlexBox } from "components/flex-box";
import { ROUTES } from "utils/routes";
export default function MobileHeader({
  children
}) {
  return <FlexBetween width="100%">{children}</FlexBetween>;
}
MobileHeader.Left = ({
  children
}) => {
  return <Box flex={1}>{children}</Box>;
};
MobileHeader.Logo = ({
  logoUrl
}) => {
  return <Link href={ROUTES?.HOMEPAGE}>
    <Image width={60} height={44} src={logoUrl} alt="logo" />
  </Link>;
};
MobileHeader.Right = ({
  children
}) => {
  return <FlexBox justifyContent="end" flex={1}>
    {children}
  </FlexBox>;
};