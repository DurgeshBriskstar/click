import PropTypes from "prop-types";
import { Box, FormLabel, TextField, Typography } from "@mui/material";

function FormField({ label = " ", helperText, ...rest }) {
  return (
    <Box display="flex" flexDirection="column" justifyContent="flex-end">
      <Box mb={0.5} ml={0.5} lineHeight={0} display="block">
        <FormLabel sx={{
          mb: 1,
          fontSize: 13,
          fontWeight: 500,
          display: "block",
          color: "text.secondary"
        }}>
          {label}
        </FormLabel>
      </Box>
      <TextField {...rest} />
      {helperText &&
        <Typography mt={0.5} component="label" variant="caption" fontWeight="regular" color="error">
          {helperText}
        </Typography>
      }
    </Box>
  );
}

export default FormField;
