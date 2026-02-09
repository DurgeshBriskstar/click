import { Fragment } from "react";
import Toggle from "icons/Toggle";
import { useLayout } from "../layout-context";

import { ToggleWrapper } from "./styles";

export default function LeftContent() {

  const { handleOpenMobileSidebar } = useLayout();

  return (
    <Fragment>
      <ToggleWrapper onClick={handleOpenMobileSidebar}>
        <Toggle />
      </ToggleWrapper>
    </Fragment>
  );
}