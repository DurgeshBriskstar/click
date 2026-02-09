"use client";

import React from "react";
import { Controller } from "react-hook-form";
import { Autocomplete, TextField, Box } from "@mui/material";
import FormField from "./FormField";

const CSelectField = ({ name, control, label, placeholder, options = [], rules = {}, error, autoFocus = false, returnObject = false, multiple = false, disabled = false, ...rest }) => {
    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field: { onChange, value } }) => (
                <Box sx={{ width: "100%" }}>
                    <Autocomplete
                        value={
                            returnObject
                                ? value || null
                                : options.find(opt => opt.value === value) || null
                        }
                        multiple={multiple}
                        options={options}
                        getOptionLabel={(opt) => opt?.label || ""}
                        onChange={(_, newValue) => {
                            if (returnObject) onChange(newValue);
                            else onChange(multiple
                                ? newValue?.map(i => i.value)
                                : newValue?.value ?? ""
                            );
                        }}
                        isOptionEqualToValue={(opt, val) =>
                            returnObject ? opt?.value === val?.value : opt?.value === val
                        }
                        disabled={disabled}
                        autoFocus={autoFocus}
                        renderInput={(params) => (
                            <FormField
                                {...params}
                                label={label}
                                placeholder={placeholder}
                                error={!!error}
                                helperText={error ? error.message : null}
                                {...rest}
                            />
                        )}
                        {...rest}
                    />
                </Box>
            )}
        />
    );
};

export default CSelectField;
