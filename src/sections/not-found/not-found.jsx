"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { FlexBox, FlexRowCenter } from "components/flex-box";
import { ROUTES } from "utils/routes";
import { DarkButton } from "components/custom/button/DarkButton";

export default function NotFound() {
  const router = useRouter();

  return (
    <FlexRowCenter px={2} minHeight="100vh" flexDirection="column">
      <Box maxWidth={320} width="100%" mb={3}>
        <Image alt="Not Found!" src={require("../../../public/assets/images/illustrations/404.svg")} style={{
          width: "100%",
          height: "auto"
        }} />
      </Box>

      <FlexBox flexWrap="wrap" gap={2}>
        <DarkButton variant="outlined" color="primary" onClick={() => router.back()}>
          Go Back
        </DarkButton>

        <Button variant="contained" color="primary" onClick={() => router.push(ROUTES?.HOMEPAGE)}>
          Go to Home
        </Button>
      </FlexBox>
    </FlexRowCenter>
  );
}