import { Box, Typography, Button } from "@mui/material";
import { cookies } from "next/headers";
import Link from "next/link";
import { SUPER_ADMIN_ROLE, STORE_ADMIN_ROLE } from "utils/constants";
import { verifyToken } from "utils/helpers";
import { ROUTES } from "utils/routes";

export default async function AccessDenied() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    let isValidToken = false;
    let user = null;

    if (token) {
        const decoded = await verifyToken(token);
        user = decoded;
        isValidToken = !!decoded;
    }

    const userRole = user?.role || null;

    const redirectUrl = isValidToken ? ((userRole === SUPER_ADMIN_ROLE) ? ROUTES?.ADMIN?.DASHBOARD : (userRole === STORE_ADMIN_ROLE) ? ROUTES?.STORE?.DASHBOARD : ROUTES?.HOMEPAGE) : ROUTES?.HOMEPAGE;

    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#f5f5f5",
                textAlign: "center",
                px: 2,
            }}
        >
            <Typography variant="h3" fontWeight={700} color="error.main">
                Access Denied
            </Typography>

            <Typography variant="h6" sx={{ mt: 1, color: "text.secondary" }}>
                You don’t have permission to view this page.
            </Typography>

            <Link href={redirectUrl} style={{ textDecoration: "none" }}>
                <Button variant="contained" sx={{ mt: 3 }}>
                    {`Go to  ${isValidToken ? "Dashboard" : "Home"}`}
                </Button>
            </Link>
        </Box>
    );
}
