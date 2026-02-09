import { usePathname, useRouter, useSearchParams } from "next/navigation";

// MUI
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownOutlined from "@mui/icons-material/KeyboardArrowDownOutlined";

// GLOBAL CUSTOM COMPONENT
import ClickITCoMenu from "components/ClickITCoMenu";

// STYLED COMPONENT
import { DropDownHandler } from "./styles";

// CUSTOM DATA MODEL


// ==============================================================


// ==============================================================

export default function CategoryDropdown({
  categories
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selected = searchParams.get("category") || "";
  const handleSelect = value => {
    const params = new URLSearchParams(searchParams);
    if (value === "") params.delete("category"); else params.set("category", value);
    router.push(`${pathname}?${params.toString()}`);
  };
  return <ClickITCoMenu direction="left" sx={{
    zIndex: {
      md: 1502,
      xs: 99999
    }
  }} handler={e => <DropDownHandler onClick={e}>
    {categories.find(item => item.value === selected)?.title}
    <KeyboardArrowDownOutlined fontSize="small" color="inherit" />
  </DropDownHandler>} options={onClose => {
    return categories.map(item => <MenuItem key={item.value} onClick={() => {
      handleSelect(item.value);
      onClose();
    }}>
      {item.title}
    </MenuItem>);
  }} />;
}