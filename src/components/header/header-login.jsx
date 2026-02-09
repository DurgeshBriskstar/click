import Link from "next/link";
import IconButton from "@mui/material/IconButton";
import AccountCircleOutlined from "@mui/icons-material/AccountCircleOutlined";
import { ROUTES } from "utils/routes";

export default function HeaderLogin() {
  return <IconButton LinkComponent={Link} href={ROUTES?.LOGIN}>
    <AccountCircleOutlined sx={{
      color: "grey.600"
    }} />
  </IconButton>;
}