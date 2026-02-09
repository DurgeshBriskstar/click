"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { styled, alpha, keyframes } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import LinkIcon from "@mui/icons-material/Link";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { themeColors } from "theme/theme-colors";

const platforms = [
  { name: "Atera", logo: "/backend-assets/sso-logins/atera.png", login: "https://app.atera.com/", type: "link" },
  { name: "HighLevel CRM", logo: "/backend-assets/sso-logins/highlevel.png", login: "https://app.gohighlevel.com/", type: "link" },
  { name: "QuickBooks", logo: "/backend-assets/sso-logins/Intuit.png", login: "/api/quickbooks/oauth", type: "quickbooks" },
  { name: "Office 365 Portal", logo: "/backend-assets/sso-logins/office-365.png", login: "https://www.office.com/", type: "link" },
  { name: "Dash Backup", logo: "/backend-assets/sso-logins/dash.png", login: "https://dash.backupops.com/account/login/", type: "link" },
  { name: "Pax8 Marketplace", logo: "/backend-assets/sso-logins/pax8.png", login: "https://app.pax8.com/", type: "link" },
  { name: "Webroot Management", logo: "/backend-assets/sso-logins/webroot.png", login: "https://my.webrootanywhere.com/", type: "link" },
  { name: "Wasabi Cloud Storage", logo: "/backend-assets/sso-logins/wasabisys.png", login: "https://console.wasabisys.com/", type: "link" },
  { name: "Gillware Data Recovery", logo: "/backend-assets/sso-logins/gillware.png", login: "https://case.gillware.com/login/", type: "link" }
];

const STORAGE_KEY = "sso-button-position";

// Toggle this flag to enable/disable dragging functionality
const canDrag = false;

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
`;

// Styled Components
const DraggableWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isDragging" && prop !== "draggable",
})(({ theme, isDragging, draggable }) => ({
  position: "fixed",
  zIndex: 1300,
  cursor: draggable ? (isDragging ? "grabbing" : "grab") : "pointer",
  touchAction: draggable ? "none" : "auto",
  userSelect: "none",
}));

const SSOButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "compact" && prop !== "isDragging",
})(({ theme, compact, isDragging }) => ({
  width: 56,
  height: 56,
  borderRadius: "50%",
  background: "linear-gradient(135deg, #F58027 0%, #ff9642 50%, #ffad5c 100%)",
  border: "3px solid rgba(255, 255, 255, 0.4)",
  boxShadow: isDragging
    ? "0 12px 40px rgba(245, 128, 39, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.4)"
    : "0 4px 20px rgba(245, 128, 39, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
  transition: isDragging ? "none" : "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",
  transform: isDragging ? "scale(1.1)" : "scale(1)",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
    transition: "left 0.5s ease",
  },
  "&:hover": {
    transform: "scale(1.1)",
    boxShadow: "0 8px 30px rgba(245, 128, 39, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
    "&::before": {
      left: "100%",
    },
  },
  "& svg": {
    color: "#fff",
    fontSize: 26,
    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
  },
}));

const DragHandle = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: -8,
  right: -8,
  width: 22,
  height: 22,
  borderRadius: "50%",
  background: "rgba(255, 255, 255, 0.95)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
  cursor: "grab",
  transition: "all 0.2s ease",
  "&:hover": {
    transform: "scale(1.1)",
    background: "#fff",
  },
  "& svg": {
    fontSize: 14,
    color: themeColors.grey[600],
  },
}));

const PopoverWrapper = styled(Box)(({ theme }) => ({
  width: 380,
  background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)",
  borderRadius: 20,
  boxShadow: "0 25px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)",
  overflow: "hidden",
  animation: `${fadeIn} 0.25s ease-out`,
}));

const PopoverHeader = styled(Box)(({ theme }) => ({
  padding: "20px 24px 14px",
  background: "linear-gradient(180deg, rgba(245, 128, 39, 0.08) 0%, transparent 100%)",
  borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
  position: "relative",
}));

const PopoverBody = styled(Box)(({ theme }) => ({
  padding: "20px 24px 24px",
}));

const LogoGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 12,
}));

const LogoCard = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "14px 5px",
  borderRadius: 14,
  background: "#ffffff",
  border: "1px solid rgba(0, 0, 0, 0.06)",
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 24px rgba(245, 128, 39, 0.15)",
    border: "1px solid rgba(245, 128, 39, 0.3)",
    background: "rgba(245, 128, 39, 0.04)",
    "& .logo-icon": {
      animation: `${float} 1s ease-in-out infinite`,
    },
  },
}));

const LogoIconWrapper = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#f8fafc",
  marginBottom: 10,
  padding: 8,
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
}));

const LogoLabel = styled(Typography)(({ theme }) => ({
  fontSize: 10,
  fontWeight: 600,
  color: themeColors.grey[700],
  textAlign: "center",
  letterSpacing: "0.2px",
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  right: 12,
  top: 12,
  width: 28,
  height: 28,
  color: themeColors.grey[500],
  background: "rgba(0, 0, 0, 0.04)",
  "&:hover": {
    background: "rgba(0, 0, 0, 0.08)",
    color: themeColors.grey[700],
  },
}));

// Sidebar dimensions
const SIDEBAR_WIDTH = 280;
const BUTTON_SIZE = 56;

// Default position (centered at bottom of sidebar)
const getDefaultPosition = () => ({
  x: (SIDEBAR_WIDTH - BUTTON_SIZE) / 2, // Center horizontally within sidebar
  y: typeof window !== "undefined" ? window.innerHeight - 80 : 700,
});

export default function SSOPopup({ compact = false }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [position, setPosition] = useState(getDefaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef(null);

  // Load saved position from localStorage (only when dragging is enabled)
  useEffect(() => {
    setMounted(true);

    // If dragging is disabled, always use default position
    if (!canDrag) {
      setPosition(getDefaultPosition());
      return;
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Validate position is within viewport
        const maxX = window.innerWidth - 60;
        const maxY = window.innerHeight - 60;
        setPosition({
          x: Math.min(Math.max(0, parsed.x), maxX),
          y: Math.min(Math.max(0, parsed.y), maxY),
        });
      } catch (e) {
        setPosition(getDefaultPosition());
      }
    }
  }, []);

  // Save position to localStorage
  const savePosition = useCallback((pos) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pos));
  }, []);

  // Handle mouse down on drag handle
  const handleMouseDown = useCallback((e) => {
    if (!canDrag) return;
    e.preventDefault();
    e.stopPropagation();
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  }, []);

  // Handle mouse move
  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    // Constrain to viewport
    const maxX = window.innerWidth - 60;
    const maxY = window.innerHeight - 60;

    const constrainedPos = {
      x: Math.min(Math.max(0, newX), maxX),
      y: Math.min(Math.max(0, newY), maxY),
    };

    setPosition(constrainedPos);
  }, [isDragging, dragOffset]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      savePosition(position);
    }
  }, [isDragging, position, savePosition]);

  // Add/remove global event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => {
        const maxX = window.innerWidth - 60;
        const maxY = window.innerHeight - 60;
        return {
          x: Math.min(prev.x, maxX),
          y: Math.min(prev.y, maxY),
        };
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleOpen = (event) => {
    if (!isDragging) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => setAnchorEl(null);

  const open = Boolean(anchorEl);

  const handleProviderClick = (platform) => {
    if (platform.type === "quickbooks") {
      // QuickBooks OAuth flow - redirect to our API endpoint
      window.location.href = platform.login;
    } else {
      // Regular link - open in new tab
      window.open(platform.login, "_blank", "noopener,noreferrer");
    }
  };

  // Reset position to default
  const handleResetPosition = () => {
    const defaultPos = getDefaultPosition();
    setPosition(defaultPos);
    savePosition(defaultPos);
  };

  if (!mounted) return null;

  // Always use default position when dragging is disabled
  const displayPosition = canDrag ? position : getDefaultPosition();

  const buttonElement = (
    <DraggableWrapper
      isDragging={isDragging}
      draggable={canDrag}
      sx={{
        left: displayPosition.x,
        top: displayPosition.y,
      }}
    >
      <Tooltip
        title={isDragging ? "" : `Quick Access - Third Party Logins${canDrag ? " (Drag to move)" : ""}`}
        placement="right"
        arrow
        disableHoverListener={isDragging}
      >
        <SSOButton
          ref={buttonRef}
          compact={compact ? 1 : 0}
          isDragging={canDrag && isDragging}
          onClick={handleOpen}
        >
          <LinkIcon />
        </SSOButton>
      </Tooltip>

      {/* Drag Handle - only show when dragging is enabled */}
      {canDrag && (
        <DragHandle
          onMouseDown={handleMouseDown}
          title="Drag to move"
        >
          <DragIndicatorIcon />
        </DragHandle>
      )}
    </DraggableWrapper>
  );

  return (
    <>
      {createPortal(buttonElement, document.body)}

      <Popover
        open={open}
        anchorEl={buttonRef.current}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            sx: {
              background: "transparent",
              boxShadow: "none",
              overflow: "visible",
              ml: 2,
              mb: 1,
            },
          },
        }}
      >
        <PopoverWrapper>
          <PopoverHeader>
            <Typography
              variant="h6"
              sx={{
                color: themeColors.grey[800],
                fontWeight: 700,
                letterSpacing: "-0.3px",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                fontSize: 18,
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "linear-gradient(135deg, #F58027 0%, #ff9642 100%)",
                  boxShadow: "0 4px 12px rgba(245, 128, 39, 0.4)",
                }}
              >
                <LinkIcon sx={{ fontSize: 20, color: "#fff" }} />
              </Box>
              Quick Access
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: themeColors.grey[500],
                mt: 0.5,
                fontSize: 12,
              }}
            >
              Connect to your third-party accounts
            </Typography>
            {canDrag && (
              <Box sx={{ position: "absolute", right: 48, top: 12 }}>
                <Tooltip title="Reset position" arrow>
                  <IconButton
                    size="small"
                    onClick={handleResetPosition}
                    sx={{
                      width: 28,
                      height: 28,
                      color: themeColors.grey[400],
                      "&:hover": {
                        color: themeColors.grey[600],
                        background: "rgba(0,0,0,0.04)",
                      },
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
                    </svg>
                  </IconButton>
                </Tooltip>
              </Box>
            )}
            <CloseButton onClick={handleClose} size="small">
              <CloseIcon sx={{ fontSize: 16 }} />
            </CloseButton>
          </PopoverHeader>

          <PopoverBody>
            <LogoGrid>
              {platforms.map((platform) => (
                <Tooltip key={platform.name} title={platform.type === "quickbooks" ? `Connect ${platform.name}` : `Open ${platform.name}`} arrow>
                  <LogoCard
                    onClick={() => handleProviderClick(platform)}
                  >
                    <LogoIconWrapper className="logo-icon">
                      <img src={platform.logo} alt={platform.name} />
                    </LogoIconWrapper>
                    <LogoLabel>{platform.name}</LogoLabel>
                  </LogoCard>
                </Tooltip>
              ))}
            </LogoGrid>
          </PopoverBody>
        </PopoverWrapper>
      </Popover>
    </>
  );
}
