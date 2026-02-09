import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { storeSite, updateSite } from "store/slices/siteSettingSlice";
import { Grid, Button, Typography } from "@mui/material";
import Twitter from "@mui/icons-material/Twitter";
import YouTube from "@mui/icons-material/YouTube";
import Facebook from "@mui/icons-material/Facebook";
import { Google, Instagram, LinkedIn, LocationPin, Mail, X } from "@mui/icons-material";
import { CTextField } from "components/custom";
import { DarkButton } from "components/custom/button/DarkButton";

const getInitialValues = (siteKey, currentRecord) => {
    return {
        site_key: siteKey || null,
        source: "social",
        facebook_link: currentRecord?.facebook_link || "",
        twitter_link: currentRecord?.twitter_link || "",
        linkedin_link: currentRecord?.linkedin_link || "",
        instagram_link: currentRecord?.instagram_link || "",
        location_link: currentRecord?.location_link || "",
        google_plus_link: currentRecord?.google_plus_link || "",
        email_address: currentRecord?.email_address || "",
        youtube_link: currentRecord?.youtube_link || "",
    };
};

const validationSchema = yup.object().shape({});

export default function ManageSocialLinks({ siteKey = "clickitco", currentRecord }) {
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();

    const methods = useForm({
        defaultValues: getInitialValues(siteKey, currentRecord),
        resolver: yupResolver(validationSchema)
    });

    const { handleSubmit, control, formState: { errors, isSubmitting }, reset } = methods;

    useEffect(() => {
        if (siteKey && currentRecord) {
            reset(getInitialValues(siteKey, currentRecord));
        }
    }, [siteKey, currentRecord]);


    const onSubmit = async (formData) => {
        try {
            const recordId = currentRecord?.id || null;
            const action = recordId
                ? updateSite(recordId, formData)
                : storeSite(formData);

            dispatch(action)
                .then((originalPromiseResult) => {
                    enqueueSnackbar(originalPromiseResult?.message, { variant: 'success' });
                })
                .catch((rejectedValueOrSerializedError) => {
                    enqueueSnackbar((rejectedValueOrSerializedError?.message || "Something went wrong!"), { variant: 'error' });
                    console.log('rejectedValueOrSerializedError', rejectedValueOrSerializedError);
                });
        } catch (error) {
            console.log("error", error);
            enqueueSnackbar(error?.response?.data?.message || "Something went wrong!", { variant: "error" });
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                    <Grid size={12}>
                        <Typography variant="h4">Social Links</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <CTextField
                            name="facebook_link"
                            type="text"
                            autoFocus
                            control={control}
                            label="Facebook"
                            placeholder="https://example.com"
                            slotProps={{ input: { startAdornment: <Facebook fontSize="small" color="info" sx={{ mr: 1 }} /> } }}
                            error={errors.facebook_link}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <CTextField
                            name="twitter_link"
                            type="text"
                            control={control}
                            label="X (Twitter)"
                            placeholder="https://example.com"
                            slotProps={{ input: { startAdornment: <X fontSize="small" color="info" sx={{ mr: 1 }} /> } }}
                            error={errors.twitter_link}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <CTextField
                            name="linkedin_link"
                            type="text"
                            control={control}
                            label="Linkedin"
                            placeholder="https://example.com"
                            slotProps={{ input: { startAdornment: <LinkedIn fontSize="small" color="info" sx={{ mr: 1 }} /> } }}
                            error={errors.linkedin_link}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <CTextField
                            name="instagram_link"
                            type="text"
                            control={control}
                            label="Instagram"
                            placeholder="https://example.com"
                            slotProps={{ input: { startAdornment: <Instagram fontSize="small" color="info" sx={{ mr: 1 }} /> } }}
                            error={errors.instagram_link}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <CTextField
                            name="location_link"
                            type="text"
                            control={control}
                            label="Location URL"
                            placeholder="https://example.com"
                            slotProps={{ input: { startAdornment: <LocationPin fontSize="small" color="info" sx={{ mr: 1 }} /> } }}
                            error={errors.location_link}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <CTextField
                            name="google_plus_link"
                            type="text"
                            control={control}
                            label="Google Plus"
                            placeholder="https://example.com"
                            slotProps={{ input: { startAdornment: <Google fontSize="small" color="info" sx={{ mr: 1 }} /> } }}
                            error={errors.google_plus_link}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <CTextField
                            name="email_address"
                            type="text"
                            control={control}
                            label="Email Address"
                            placeholder="test@example.com"
                            slotProps={{ input: { startAdornment: <Mail fontSize="small" color="info" sx={{ mr: 1 }} /> } }}
                            error={errors.email_address}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <CTextField
                            name="youtube_link"
                            type="text"
                            control={control}
                            label="Youtube"
                            placeholder="https://example.com"
                            slotProps={{ input: { startAdornment: <YouTube fontSize="small" color="info" sx={{ mr: 1 }} /> } }}
                            error={errors.youtube_link}
                        />
                    </Grid>

                    <Grid size={12}>
                        <DarkButton loading={isSubmitting} type="submit" color="info" variant="contained">
                            Save Changes
                        </DarkButton>
                    </Grid>
                </Grid>
            </form>
        </>
    );
}