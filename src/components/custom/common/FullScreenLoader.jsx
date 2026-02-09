import { Box, CircularProgress } from "@mui/material";

export default function FullScreenLoader() {
    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                bgcolor: "rgba(0,0,0,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2000
            }}
        >
            <CircularProgress size={60} thickness={4} />
        </Box>
    );
}
