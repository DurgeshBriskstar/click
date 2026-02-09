import { FlexRowCenter } from "components/flex-box";
import LogoWithTitle from "sections/sessions/components/logo-title";
import SocialButtons from "sections/sessions/components/social-buttons";
import { Wrapper } from "./styles";

export default function AuthLayout({ children, bottomContent }) {

  return (
    <FlexRowCenter flexDirection="column" minHeight="100vh" px={2}>
      <Wrapper elevation={6}>
        <LogoWithTitle />

        {children}

        <SocialButtons />

        {bottomContent}
      </Wrapper>
    </FlexRowCenter>
  );
}