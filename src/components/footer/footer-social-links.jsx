
// GLOBAL CUSTOM COMPONENT
import FlexBox from "components/flex-box/flex-box";
import IconComponent from "components/IconComponent";

// STYLED COMPONENTS
import { StyledIconButton } from "./styles";


// ==============================================================


// ==============================================================

export default function FooterSocialLinks({
  variant = "light",
  links
}) {
  const {
    twitter,
    facebook,
    instagram,
    youtube,
    google
  } = links;
  return <FlexBox className="flex" mx={-0.625}>
      {twitter ? <LinkItem variant={variant} icon="Twitter" url={twitter} /> : null}
      {facebook ? <LinkItem variant={variant} icon="Facebook" url={facebook} /> : null}
      {instagram ? <LinkItem variant={variant} icon="Instagram" url={instagram} /> : null}
      {youtube ? <LinkItem variant={variant} icon="Youtube" url={youtube} /> : null}
      {google ? <LinkItem variant={variant} icon="Google" url={google} /> : null}
    </FlexBox>;
}
function LinkItem({
  url,
  icon,
  variant
}) {
  return <a href={url} target="_blank" rel="noreferrer noopenner">
      <StyledIconButton variant={variant}>
        <IconComponent icon={icon} fontSize="inherit" className="icon" />
      </StyledIconButton>
    </a>;
}