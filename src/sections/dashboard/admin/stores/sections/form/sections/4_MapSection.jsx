"use client";
import { Grid, Typography } from "@mui/material";

export default function MapSection({ control, sectionKey, errors }) {
    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
                <Typography fontWeight={400}><b>Note: </b>Map will render here automatically, based on store address.</Typography>
            </Grid>
        </Grid>
    );
};