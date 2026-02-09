"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import LocationOnOutlined from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlined from "@mui/icons-material/PhoneOutlined";
import AccessTimeOutlined from "@mui/icons-material/AccessTimeOutlined";
import Facebook from "@mui/icons-material/Facebook";
import LinkedIn from "@mui/icons-material/LinkedIn";
import Instagram from "@mui/icons-material/Instagram";
import Google from "@mui/icons-material/Google";
import MailOutline from "@mui/icons-material/MailOutline";
import ArrowOutward from "@mui/icons-material/ArrowOutward";
import X from "@mui/icons-material/X";
import LocationOn from "@mui/icons-material/LocationOn";
import { useDispatch, useSelector } from "react-redux";
import { useLayout } from "sections/dashboard/common/layout/layout-context";
import FlexBox from "components/flex-box/flex-box";
import { formatPhoneNumber } from "utils/formats";
import { YouTube } from "@mui/icons-material";
import { setSelectedStoreId } from "store/slices/storeSlice";

export default function WelcomeCard() {
  const dispatch = useDispatch();
  const { selectedStoreId } = useSelector((state) => state.store);
  const { stores } = useLayout();
  const { user } = useSelector((state) => state?.auth);

  // Set selectedStoreId if not set and stores are available
  // Note: This is a backup - DashboardLayout should set it first
  useEffect(() => {
    if (selectedStoreId === null && stores?.length > 0 && user) {
      // For store admin, use their store_id
      if (user?.store_id) {
        // Convert to number if it's a string
        const storeId = typeof user.store_id === 'string' ? parseInt(user.store_id, 10) : user.store_id;
        const userStore = stores.find((store) => store?.id === storeId);
        if (userStore) {
          dispatch(setSelectedStoreId(storeId));
        } else if (stores.length > 0) {
          // Fallback to first store
          dispatch(setSelectedStoreId(stores[0]?.id));
        }
      } else if (stores.length > 0) {
        // For super admin or if no store_id, use first store
        dispatch(setSelectedStoreId(stores[0]?.id));
      }
    }
  }, [selectedStoreId, stores, user, dispatch]);

  // Find the selected store from the stores array
  // If selectedStoreId is null but stores array has items, use the first store
  // (especially useful for store admin where there's only one store)
  let selectedStore = stores?.find((store) => store?.id === selectedStoreId);

  // Fallback: if no selectedStoreId but stores exist, use first store
  // For store admin, also check user's store_id
  if (!selectedStore && stores?.length > 0) {
    if (user?.store_id) {
      // Convert to number if it's a string
      const userStoreId = typeof user.store_id === 'string' ? parseInt(user.store_id, 10) : user.store_id;
      selectedStore = stores.find((store) => store?.id === userStoreId);
    }
    // If still not found, use first store
    if (!selectedStore) {
      selectedStore = stores[0];
    }
  }

  // Get store details
  const storeName = selectedStore?.store_name || "";
  const storePhone = selectedStore?.contact_us?.store_phone ? formatPhoneNumber(selectedStore?.contact_us?.store_phone) : "";
  const storeAddress = selectedStore?.contact_us?.store_address || "-";
  const storeHours = selectedStore?.contact_us?.store_hours || "-";
  const storeSlug = selectedStore?.store_slug || "";

  // Get social links
  const socialLinks = selectedStore?.social_links || {};

  const socialIcons = [
    { icon: X, link: socialLinks.twitter_link, label: "X" },
    { icon: MailOutline, link: socialLinks.email_address ? `mailto:${socialLinks.email_address}` : null, label: "Email" },
    { icon: Facebook, link: socialLinks.facebook_link, label: "Facebook" },
    { icon: LinkedIn, link: socialLinks.linkedin_link, label: "LinkedIn" },
    { icon: LocationOn, link: socialLinks.location_link, label: "Location" },
    { icon: Instagram, link: socialLinks.instagram_link, label: "Instagram" },
    { icon: Google, link: socialLinks.google_plus_link, label: "Google" },
    { icon: YouTube, link: socialLinks.youtube_link, label: "YouTube" },
  ];

  return (
    <Card sx={{ p: 3, height: "100%", display: "flex", position: "relative", flexDirection: "column", justifyContent: "flex-start" }}>
      {/* Store Name */}
      <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }} color="#4E97FD">{storeName}</Typography>

      {/* Address */}
      <FlexBox alignItems="flex-start" gap={1.5} sx={{ mb: 1.5, zIndex: 1 }}>
        <LocationOnOutlined sx={{ color: "grey.600", fontSize: 20, mt: 0.3 }} />
        <Typography variant="body2" color="grey.700" sx={{ lineHeight: 1.6 }}>
          {storeAddress}
        </Typography>
      </FlexBox>

      {/* Phone */}
      <FlexBox alignItems="center" gap={1.5} sx={{ mb: 1.5, zIndex: 1 }}>
        <PhoneOutlined sx={{ color: "grey.600", fontSize: 20 }} />
        <Typography component={Link} href={`tel:${storePhone}`} variant="body2" color="grey.700">{storePhone}</Typography>
      </FlexBox>

      {/* Business Hours */}
      <FlexBox alignItems="center" gap={1.5} sx={{ mb: 2.5, zIndex: 1 }}>
        <AccessTimeOutlined sx={{ color: "grey.600", fontSize: 20 }} />
        <Typography variant="body2" color="grey.700">{storeHours}</Typography>
      </FlexBox>

      {/* Social Links */}
      <FlexBox alignItems="center" gap={0.5} sx={{ mb: 2.5, zIndex: 1 }}>
        {socialIcons.map((social, index) => {
          const IconComponent = social.icon;
          if (!social.link) return null;
          return (
            <IconButton key={index} component="a" href={social.link} target="_blank" rel="noopener noreferrer" size="small" sx={{ color: "grey.700", zIndex: 1, "&:hover": { color: "primary.main" } }} aria-label={social.label}>
              <IconComponent sx={{ fontSize: 20 }} />
            </IconButton>
          );
        })}
      </FlexBox>

      {/* View Store Button */}
      {storeSlug && (
        <Box>
          <Button component={Link} href={`/stores/${storeSlug}`} target="_blank" variant="outlined" size="small" endIcon={<ArrowOutward sx={{ fontSize: 16 }} />}
            sx={{ borderRadius: 5, textTransform: "none", fontWeight: 500, px: 2, borderColor: "grey.400", color: "grey.800", "&:hover": { borderColor: "grey.600", bgcolor: "grey.50", }, }}
          >
            View Store Landing Page
          </Button>
        </Box>
      )}

      <Box sx={{ right: 24, bottom: 0, position: "absolute", display: { xs: "none", sm: "block" } }}>
        <Image width={300} height={250} alt="Welcome" src="/backend-assets/dashboard/store.svg" />
      </Box>
    </Card>
  );
}