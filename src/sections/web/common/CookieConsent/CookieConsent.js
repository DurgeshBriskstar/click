"use client";

import { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { X } from "react-bootstrap-icons";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (!cookieConsent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookieConsent", "declined");
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="cookie-consent-banner">
      <Container>
        <div className="cookie-consent-content">
          <div className="cookie-consent-text">
            <h5 className="cookie-consent-title">We use cookies</h5>
            <p className="cookie-consent-description">
              We use cookies to enhance your browsing experience, serve
              personalized content, and analyze our traffic. By clicking
              "Accept All", you consent to our use of cookies.
            </p>
          </div>
          <div className="cookie-consent-actions">
            <Button
              variant="outline-light"
              className="cookie-btn cookie-btn-decline"
              onClick={declineCookies}
            >
              Decline
            </Button>
            <Button
              className="cookie-btn cookie-btn-accept"
              onClick={acceptCookies}
            >
              Accept All
            </Button>
            <button
              className="cookie-close-btn"
              onClick={acceptCookies}
              aria-label="Close cookie banner"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
}

