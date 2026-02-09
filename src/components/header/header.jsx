"use client";

import Link from "next/link";
import clsx from "clsx";

// GLOBAL CUSTOM COMPONENTS
import LazyImage from "components/LazyImage";
import FlexBox from "components/flex-box/flex-box";

// LOCAL CUSTOM COMPONENT
import HeaderCategoryDropdown from "./header-category-dropdown";

// STYLED COMPONENTS
import { HeaderWrapper, StyledContainer } from "./styles";
import { ROUTES } from "utils/routes";


// ==============================================================


// ==============================================================

export default function Header({
  className,
  children,
  mobileHeader
}) {
  return <HeaderWrapper className={clsx(className)}>
    <StyledContainer>
      <div className="main-header">{children}</div>
      <div className="mobile-header">{mobileHeader}</div>
    </StyledContainer>
  </HeaderWrapper>;
}
function HeaderLeft({
  children
}) {
  return <FlexBox minWidth={100} alignItems="center">
    {children}
  </FlexBox>;
}
Header.Logo = ({
  url
}) => {
  return <HeaderLeft>
    <Link href={ROUTES?.HOMEPAGE}>
      <LazyImage src={url} alt="logo" width={105} height={50} />
    </Link>
  </HeaderLeft>;
};
Header.CategoryDropdown = ({
  children
}) => {
  return <HeaderLeft>
    <HeaderCategoryDropdown>{children}</HeaderCategoryDropdown>
  </HeaderLeft>;
};
Header.Mid = ({
  children
}) => {
  return children;
};
Header.Right = ({
  children
}) => {
  return <div>{children}</div>;
};