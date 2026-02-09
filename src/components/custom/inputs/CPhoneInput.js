import React, { useState } from "react";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { Box, FormHelperText, FormLabel, Typography } from "@mui/material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

const CSoftPhoneInput = ({ name, control, label, error, autoFocus = false, rules, ...rest }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field: { onChange, value, ref } }) => (
                <Box sx={{ width: "100%" }}>
                    <Box mb={0.5} ml={0.5} lineHeight={0} display="block">
                        {label && (<FormLabel sx={{ mb: 1.8, fontSize: 13, fontWeight: 500, display: "block", color: "text.secondary" }}>{label}</FormLabel>)}
                    </Box>
                    <PhoneInput
                        country="ca"
                        preferredCountries={["ca"]}
                        countryCodeEditable={true}
                        value={value}
                        onChange={(phone) => onChange(phone)}
                        inputProps={{
                            name,
                            ref,
                            autoFocus,
                            required: !!rules?.required,
                            onFocus: () => setIsFocused(true),
                            onBlur: () => setIsFocused(false),
                        }}
                        containerStyle={{ width: "100%" }}
                        inputStyle={{
                            width: "100%", height: "40px", fontSize: "16px", borderRadius: "8px",
                            borderColor: error ? "#d32f2f" : isFocused ? "#81e3f4ff" : "#ccc",
                            boxShadow: isFocused ? "0 0 0 0.125rem #81e3f4ff" : "none", marginTop: "-2px"
                        }}
                        specialLabel={""}
                        {...rest}
                    />
                    {error && (<FormHelperText sx={{ color: "#d32f2f", mt: 0.5 }}>{error.message}</FormHelperText>)}
                </Box>
            )}
        />
    );
};

CSoftPhoneInput.propTypes = {
    name: PropTypes.string.isRequired,
    control: PropTypes.object.isRequired,
    label: PropTypes.string,
    error: PropTypes.object,
    rules: PropTypes.object,
    defaultCountry: PropTypes.string,
    autoFocus: PropTypes.bool,
};

export default CSoftPhoneInput;
