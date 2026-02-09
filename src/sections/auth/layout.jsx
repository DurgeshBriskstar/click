
import FlexRowCenter from "components/flex-box/flex-row-center";
import LogoWithTitle from "components/custom/common/LogoWithTitle";
import SocialButtons from "components/custom/common/SocialButtons";
import { Wrapper } from "./styles";
import { Divider } from "@mui/material";

export default function AuthLayout({ children, bottomContent }) {

  return (
    <FlexRowCenter flexDirection="column" minHeight="100vh" px={2}>
      <Wrapper elevation={6}>
        <LogoWithTitle />

        {children}

        {bottomContent}
      </Wrapper>
    </FlexRowCenter>
  );
}