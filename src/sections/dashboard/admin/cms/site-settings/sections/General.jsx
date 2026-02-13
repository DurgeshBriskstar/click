import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Grid, Tooltip } from "@mui/material";
import { Info } from "@mui/icons-material";
import { storeSite, updateSite } from "store/slices/siteSettingSlice";
import { CTextField } from "components/custom";
import { DarkButton } from "components/custom/button/DarkButton";
import CImageUpload from "components/custom/inputs/CImageUpload";

const getInitialValues = (siteKey, currentRecord) => {
    return {
        site_key: siteKey || null,
        source: "general",
        site_name: currentRecord?.site_name || "",
        site_logo: currentRecord?.site_logo || "",
        site_favicon: currentRecord?.site_favicon || "",
        short_intro: currentRecord?.short_intro || "",
        copyright_text: currentRecord?.copyright_text || "",
    };
};

const validationSchema = yup.object().shape({
    site_name: yup.string().trim().required("Site name is required!"),
});

export default function General({ siteKey = "clickitco", currentRecord }) {
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
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <CTextField
                                name="site_name"
                                type="text"
                                autoFocus
                                control={control}
                                label="Site Name*"
                                placeholder="Site Name"
                                error={errors.site_name}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <CTextField
                                name="short_intro"
                                type="text"
                                control={control}
                                label={<>Short intro <Tooltip title="This text will display in footer beside the logo."><Info fontSize="10px" /></Tooltip></>}
                                placeholder="Short Intro"
                                multiline
                                rows={3.5}
                                error={errors.short_intro}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <CTextField
                                name="copyright_text"
                                type="text"
                                control={control}
                                label="Copyright text"
                                placeholder="Copyright text"
                                multiline
                                rows={3.5}
                                error={errors.copyright_text}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <CImageUpload
                                control={control}
                                name={`site_logo`}
                                label="Site Logo"
                                maxFiles={1}
                                multiple={false}
                                error={errors?.site_logo}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <CImageUpload
                                control={control}
                                name={`site_favicon`}
                                label="Site Favicon"
                                maxFiles={1}
                                multiple={false}
                                error={errors?.site_favicon}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Grid container spacing={3} mt={3}>




                <Grid size={12}>

                </Grid>

                <Grid size={12}>
                    <DarkButton loading={isSubmitting} type="submit" color="info" variant="contained">
                        Save Changes
                    </DarkButton>
                </Grid>
            </Grid>
        </form>
    );
}