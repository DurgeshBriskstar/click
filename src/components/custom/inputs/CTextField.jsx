import React from "react";
import { Controller } from "react-hook-form";
import { Box } from "@mui/material";
import FormField from "./FormField";

const CTextField = ({ name, control, label, placeholder, error, onlyNumbers = false, max = null, rules, autoFocus = false, ...rest }) => {
    return (
        <Controller
            name={name}
            control={control}
            rules={rules || {}}
            render={({ field }) => (
                <Box sx={{ width: "100%" }}>
                    <FormField
                        label={label}
                        placeholder={placeholder}
                        inputProps={{
                            ...field,
                            autoFocus: autoFocus,
                            value: field.value ?? "",
                            onChange: (e) => {
                                if (onlyNumbers) {
                                    const value = e.target.value.replace(/[^0-9]/g, "");
                                    field.onChange(value);
                                } else {
                                    field.onChange(e);
                                }
                            },
                            maxLength: max || undefined,
                        }}
                        error={!!error}
                        helperText={error ? error.message : null}
                        {...rest}
                    />
                </Box>
            )}
        />
    );
};

export default CTextField;