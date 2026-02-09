"use client";
import { Grid } from "@mui/material";
import { CRichTextEditor } from "components/custom";

export default function ContentSection({ control, sectionKey, errors }) {
    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
                <CRichTextEditor
                    name={`sections.${sectionKey}.content`}
                    control={control}
                    label="Content"
                    placeholder="Write page content"
                    height="400px"
                    error={errors.sections?.[sectionKey]?.content}
                />
            </Grid>
        </Grid>
    );
};