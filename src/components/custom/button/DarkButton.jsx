"use client";

import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { themeColors } from "theme/theme-colors";

// ✅ Dark Button
export const DarkButton = styled(Button)(() => ({
    backgroundColor: themeColors?.lDark,
    color: "#fff",
    fontWeight: 600,
    textTransform: "none",

    "&:hover": {
        backgroundColor: themeColors?.lDark,
        opacity: 0.9,
    },

    "&:disabled": {
        backgroundColor: "#444",
        color: "#aaa",
    },
}));