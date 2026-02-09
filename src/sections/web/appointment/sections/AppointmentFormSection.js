"use client";

import { useState } from "react";
import { Container } from "react-bootstrap";
import { MenuItem, TextField, Button } from "@mui/material";
import { Box } from "@mui/system";
import ClientIframe from "components/custom/common/ClientIframe";

export default function AppointmentFormSection({ data, stores }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [defaultLocation, setDefaultLocation] = useState("");

  const availableForms = stores?.filter(store => store?.settings?.appointment_calendar_form_iframe) || [];

  const validForms = availableForms.filter(f => typeof f?.settings?.appointment_calendar_form_iframe === "string" && f?.settings?.appointment_calendar_form_iframe?.trim() !== "");

  const selectedForm = validForms.find(form => form.id === defaultLocation);

  const iframe = selectedForm?.settings?.appointment_calendar_form_iframe || "";

  const handleStoreChange = (value) => {
    setDefaultLocation(value);
  };

  const handleContinue = () => {
    if (defaultLocation && iframe) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => setCurrentStep(1);

  return (
    <section className="appointment-form-section">
      <Container>
        <div className="appointment-form-wrapper">

          <Box className="appointment-form-content">
            <Box className="appointment-steps-container">
              {/* Step Indicator Sidebar */}
              <Box className="appointment-steps-sidebar">
                <Box className="appointment-step-item" data-active={(currentStep === 1) || (defaultLocation !== "")}>
                  <Box className="appointment-step-number" data-active={(currentStep === 1) || (defaultLocation !== "")}>1</Box>
                  <Box className="appointment-step-content">
                    <Box className="appointment-step-title">Select Store</Box>
                    <Box className="appointment-step-subtitle">Tell us for which store you want to book an appointment.</Box>
                  </Box>
                </Box>

                <Box className="appointment-step-connector"></Box>

                <Box className="appointment-step-item" data-active={currentStep === 2}>
                  <Box className="appointment-step-number" data-active={currentStep === 2}>2</Box>
                  <Box className="appointment-step-content">
                    <Box className="appointment-step-title">Appointment Details</Box>
                    <Box className="appointment-step-subtitle">Enter all the necessary details to proceed.</Box>
                  </Box>
                </Box>
              </Box>

              {/* Step Content Area */}
              <Box className="appointment-step-content-area">
                {currentStep === 1 && (
                  <Box className="appointment-step-1-content">
                    <Box className="appointment-step-header">
                      <h3 className="appointment-step-heading">{data?.title || ""}</h3>
                    </Box>

                    <Box className="appointment-step-form">
                      <TextField
                        select
                        color="info"
                        sx={{ width: "100%", "& .MuiOutlinedInput-root": { borderRadius: "14px", backgroundColor: "#fff", border: "1px solid #D9DBE9", } }}
                        size="medium"
                        name="location"
                        label="Select Store"
                        required
                        value={defaultLocation}
                        onChange={(e) => handleStoreChange(e.target.value)}
                        fullWidth
                      >
                        {validForms?.map((store, index) => (
                          <MenuItem value={store?.id} key={index}>
                            {store?.store_name}
                          </MenuItem>
                        ))}
                      </TextField>

                      {defaultLocation && (
                        <Button variant="contained" onClick={handleContinue} className="btn-click mt-4">
                          Continue
                        </Button>
                      )}
                    </Box>
                  </Box>
                )}

                {currentStep === 2 && iframe && (
                  <Box className="appointment-step-2-content">
                    <Button variant="text" onClick={handleBack} className="small-btn" sx={{ mb: 0, textTransform: "none", color: "text.secondary", "&:hover": { backgroundColor: "transparent", }, }}>
                      <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_3299_46)">
                          <path d="M25 12.5C25 5.59644 19.4036 0 12.5 0C5.59644 0 0 5.59644 0 12.5C0 19.4036 5.59644 25 12.5 25C19.4036 25 25 19.4036 25 12.5Z" fill="#F58027" />
                          <path d="M18.3131 12.6569L6.9994 12.6569M6.9994 12.6569L12.0906 17.748M6.9994 12.6569L12.0906 7.5657" stroke="white" strokeWidth="2" />
                        </g>
                        <defs>
                          <clipPath id="clip0_3299_46">
                            <rect width="25" height="25" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>

                      Back
                    </Button>

                    <Box className="appointment-iframe-wrapper">
                      <ClientIframe html={iframe} />
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </div>
      </Container>
    </section>
  );
}