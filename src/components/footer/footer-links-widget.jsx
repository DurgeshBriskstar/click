import { Fragment } from "react";

// STYLED COMPONENTS
import { Heading, StyledLink } from "./styles";


// ==============================================================


// ==============================================================

export default function FooterLinksWidget({
  isDark,
  links,
  title
}) {
  return <Fragment>
      <Heading>{title}</Heading>

      {links.map((item, ind) => <StyledLink isDark={isDark} href={item.url} key={ind}>
          {item.title}
        </StyledLink>)}
    </Fragment>;
}