import { Fragment } from "react";
import { FlexBox } from "components/flex-box";
import BoxLink from "./BoxLink";

export default function LoginBottom() {
    return (
        <Fragment>
            <FlexBox gap={1} mt={2} py={2} borderRadius={1} justifyContent="center" bgcolor="white.200">
                Forgot your password?
                <BoxLink title="Reset It" href="/forgot-password" />
            </FlexBox>
        </Fragment>
    );
}