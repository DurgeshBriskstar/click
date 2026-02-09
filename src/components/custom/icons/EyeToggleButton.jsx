import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function EyeToggleButton({
    show,
    onClick
}) {
    return <IconButton size="small" onClick={onClick}>
        {show ? <Visibility fontSize="small" sx={{
            color: "grey.600"
        }} /> : <VisibilityOff fontSize="small" sx={{
            color: "grey.400"
        }} />}
    </IconButton>;
}