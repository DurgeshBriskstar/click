import React from "react";
import { Controller } from "react-hook-form";
import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";

const CCheckbox = ({ name, control, label, error, rules = {}, labelPlacement = "end", ...rest }) => {
    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field }) => (
                <Box>
                    <FormControlLabel
                        labelPlacement={labelPlacement}
                        control={
                            <Checkbox
                                {...field}
                                checked={!!field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                                {...rest}
                            />
                        }
                        label={label}
                    />

                    {error && (
                        <Typography mt={0.5} component="label" variant="caption" fontWeight="regular" color="error">
                            {error.message}
                        </Typography>
                    )}
                </Box>
            )}
        />
    );
};

export default CCheckbox;
