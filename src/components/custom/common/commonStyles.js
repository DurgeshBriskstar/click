import Box from "@mui/material/Box";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import { alpha, styled } from "@mui/material/styles";
import Clear from "@mui/icons-material/Clear";

const StyledTableCell = styled(TableCell)(({ theme }) => (
  { fontSize: 14, paddingTop: 10, fontWeight: 500, paddingBottom: 10, color: theme.palette.grey[900], borderBottom: `1px solid ${theme.palette.grey[300]}` }
));

const StyledTableTextCell = styled(TableCell)(({ theme }) => (
  { fontSize: 14, paddingTop: 10, fontWeight: 300, paddingBottom: 10, color: theme.palette.grey[900], borderBottom: `1px solid ${theme.palette.grey[300]}`, textTransform: 'capitalize' }
));

const CategoryWrapper = styled(Box)(({ theme }) => (
  { fontSize: 13, padding: "3px 12px", borderRadius: "16px", display: "inline-block", color: theme.palette.grey[900], backgroundColor: theme.palette.grey[200] }
));

const StyledTableRow = styled(TableRow)({
  ":last-child .MuiTableCell-root": { border: 0 },
  "&.Mui-selected": { backgroundColor: "transparent", ":hover": { backgroundColor: "transparent" } }
});

const StyledIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "color",
})(({ theme, color = "default" }) => {
  const palette =
    color === "info"
      ? theme.palette.info
      : color === "error"
        ? theme.palette.error
        : theme.palette.grey;

  return {
    color: palette.main,
    backgroundColor: palette.light,
    borderRadius: 8,
    padding: 6,

    "& .MuiSvgIcon-root": {
      fontSize: 19,
    },

    "&:hover": {
      backgroundColor: palette.main,
      color: theme.palette.common.white,
    },
  };
});

const StatusWrapper = styled(Box, { shouldForwardProp: prop => prop !== "status" })(({ theme, status }) => {
  let color = theme.palette.secondary.main;
  let backgroundColor = theme.palette.secondary[100];

  if (status === "Active" || status === "Accepted" || status === "Delivered" || status === "Normal" || status === "published") {
    color = theme.palette.success.main;
    backgroundColor = theme.palette.success[100];
  }

  if (status === "Rejected" || status === "Urgent" || status === "Cancelled" || status === "Inactive") {
    color = theme.palette.error.main;
    backgroundColor = theme.palette.error[100];
  }

  if (status === "Processing" || status === "draft") {
    color = theme.palette.warning.main;
    backgroundColor = theme.palette.warning[100];
  }

  if (status === "Pending") {
    color = theme.palette.info.main;
    backgroundColor = theme.palette.info[100];
  }

  return {
    color,
    fontSize: 12,
    fontWeight: 500,
    backgroundColor,
    borderRadius: "8px",
    padding: "3px 12px",
    display: "inline-flex",
    textTransform: 'capitalize'
  };
});

const UploadImageBox = styled(Box)(({
  theme
}) => ({
  width: 70,
  height: 70,
  display: "flex",
  overflow: "hidden",
  borderRadius: "8px",
  position: "relative",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: alpha(theme.palette.info.light, 0.1)
}));
const StyledClear = styled(Clear)({
  top: 5,
  right: 5,
  fontSize: 14,
  cursor: "pointer",
  position: "absolute"
});
export { CategoryWrapper, StyledIconButton, StyledTableRow, StyledTableCell, StyledTableTextCell, StatusWrapper, UploadImageBox, StyledClear };