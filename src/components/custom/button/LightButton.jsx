"use client";

import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { themeColors } from "theme/theme-colors";

export const LightButton = styled(Button)(() => ({
    backgroundColor: themeColors?.lBlue,
    color: "#000",
    fontWeight: 600,
    textTransform: "none",

    "&:hover": {
        backgroundColor: themeColors?.lBlue,
        opacity: 0.9,
    },

    "&:disabled": {
        backgroundColor: "#cfdff1",
        color: "#777",
    },
}));