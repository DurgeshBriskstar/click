import { Controller } from "react-hook-form";
import MuiTextField from "@mui/material/TextField";

export default function TextField({ name, control, helperText, type, ...other }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <MuiTextField
          {...field}
          type={type}
          error={Boolean(error)}
          helperText={error?.message || helperText}
          {...other}
        />
      )}
    />
  );
}
