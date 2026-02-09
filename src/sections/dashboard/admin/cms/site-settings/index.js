"use client";

import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { LinearProgress, Box, Tab, Card, Typography } from "@mui/material";
import { TabList, TabPanel, TabContext } from "@mui/lab";
import { styled } from "@mui/material/styles";
import General from "./sections/General";
import ManageSocialLinks from "./sections/SocialLinks";
import { getSite, getSiteByKey, resetSite } from "store/slices/siteSettingSlice";

const StyledTabPanel = styled(TabPanel)({
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0
});

const StyledTabList = styled(TabList)(({ theme }) => ({
    "& .MuiTab-root.Mui-selected": {
        color: theme.palette.info.main
    },
    "& .MuiTabs-indicator": {
        background: theme.palette.info.main
    }
}));

const siteKey = process.env.NEXT_PUBLIC_SITE_KEY || "clickitco";

export default function SiteSettings() {
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const { site, isLoading } = useSelector(state => state?.siteSetting);
    const [tabKey, setTabKey] = useState("");

    useEffect(() => {
        const hash = window.location.hash.replace("#", "");
        if (hash) { setTabKey(hash) }
        else { setTabKey("general") }
    }, []);

    useEffect(() => {
        if (tabKey && siteKey) {
            dispatch(getSiteByKey(siteKey)).then((response) => {
                if (!response?.data) {
                    enqueueSnackbar((response?.message || "Content not found!!"), { variant: 'warning' });
                }

            }).catch((rejectedValueOrSerializedError) => {
                enqueueSnackbar((rejectedValueOrSerializedError?.data?.message || "Something went wrong!"), { variant: 'error' });
                console.log('rejectedValueOrSerializedError', rejectedValueOrSerializedError);
            });
        }
    }, [dispatch, tabKey]);

    const handleChange = (_, newValue) => {
        dispatch(resetSite());
        setTabKey(newValue);
        router.replace(`#${newValue}`);
    };


    return (
        <Box py={4}>
            <Card sx={{ px: 3, py: 2 }}>
                <TabContext value={tabKey || "general"}>
                    <Box sx={{ borderBottom: 1, borderColor: "grey.300" }}>
                        <StyledTabList onChange={handleChange} variant="scrollable">
                            <Tab label="General" value="general" disableRipple />
                            {/* <Tab label="Social Links" value="social" disableRipple /> */}
                        </StyledTabList>
                    </Box>
                    <Box sx={{ py: 2 }}>
                        {isLoading && <LinearProgress sx={{ color: "#4e96fe" }} color="inherit" />}
                        <Typography sx={{ fontSize: '14px', fontWeight: 500, lineHeight: 1.43, textAlign: 'left', color: '#00489A' }}>
                            Note: All contact information and social media links across the website are sourced from the primary store.
                        </Typography>
                    </Box>

                    <StyledTabPanel value="general"><General currentRecord={site || {}} /></StyledTabPanel>
                    {/* <StyledTabPanel value="social"><ManageSocialLinks currentRecord={site || {}} /></StyledTabPanel> */}
                </TabContext>
            </Card>
        </Box>
    );
}