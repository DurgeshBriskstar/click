import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import LeftContent from "./left-content";
import RightContent from "./right-content";
import { StyledToolBar, DashboardNavbarRoot } from "./styles";

export default function DashboardNavbar({ user, stores }) {

  return <DashboardNavbarRoot position="sticky">
    <Container maxWidth="xl">
      <StyledToolBar disableGutters>
        <LeftContent />

        <Box flexGrow={1} />

        <RightContent user={user} stores={stores} />
      </StyledToolBar>
    </Container>
  </DashboardNavbarRoot>;
}