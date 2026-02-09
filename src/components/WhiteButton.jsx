import Button from "@mui/material/Button";


// ==================================================


// ==================================================

const STYLE = {
  color: "dark.main",
  backgroundColor: "white",
  ":hover": {
    color: "#fff",
    backgroundColor: "dark.main"
  }
};
export default function WhiteButton({
  children,
  ...props
}) {
  return <Button color="dark" variant="contained" sx={STYLE} {...props}>
      {children}
    </Button>;
}