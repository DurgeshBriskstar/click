"use client";
import Image from "next/image";
import Typography from "@mui/material/Typography";
import FlexRowCenter from "components/flex-box/flex-row-center";
import { useRouter } from "next/navigation";
import { ROUTES } from "utils/routes";

export default function LogoWithTitle() {
    const router = useRouter();
    return (
        <FlexRowCenter flexDirection="column" gap={1.5} mb={4}>
            <Image width={96} height={44} src="/assets/imagess/logo.svg" alt="logo" onClick={() => router.push(ROUTES?.HOMEPAGE)} style={{ cursor: "pointer" }} />
            {/* <Image src={"/assets/imagess/logo.png"} alt="clickitco" onClick={() => router.push(ROUTES?.HOMEPAGE)} style={{ cursor: "pointer", height: '80px', width: '80px', objectFit: 'contain' }} /> */}
            <Typography variant="h5">Welcome To ClickITCo</Typography>
        </FlexRowCenter>
    );
}