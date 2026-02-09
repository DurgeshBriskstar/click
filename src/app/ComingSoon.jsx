"use client";

import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { DarkButton } from "components/custom/button/DarkButton";

const StyledRoot = styled("div")(({ theme }) => ({
  height: "90vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[100],

  "& .container": {
    padding: theme.spacing(6),
    maxWidth: 420,
    width: "100%",
    textAlign: "center",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },

  "& .title": {
    fontWeight: 600,
    marginBottom: theme.spacing(2),
    fontSize: "2rem",
    color: theme.palette.text.primary,
  },

  "& .subtitle": {
    marginBottom: theme.spacing(4),
    color: theme.palette.text.secondary,
  },

  "& .backBtn": {
    textTransform: "none",
    padding: "0.6rem 1.5rem",
    borderRadius: "8px",
    fontSize: "0.95rem",
  },
}));

export default function ComingSoon() {
  const router = useRouter();

  return (
    <StyledRoot>
      <Card className="container" elevation={1}>
        <Typography className="title">Coming Soon</Typography>

        <Typography className="subtitle">
          We're preparing something useful here.
          Please check back later.
        </Typography>

        <DarkButton
          variant="contained"
          className="backBtn"
          onClick={() => router.back()}
        >
          Go Back
        </DarkButton>
      </Card>
    </StyledRoot>
  );
}
