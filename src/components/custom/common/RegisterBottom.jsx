import FlexRowCenter from "components/flex-box/flex-row-center";
import BoxLink from "./BoxLink";
import { routes } from "utils/routes";

export default function RegisterBottom() {

    return <FlexRowCenter gap={1} mt={3}>
        Already have an account?
        <BoxLink title="Login" href={routes?.login} />
    </FlexRowCenter>;
}