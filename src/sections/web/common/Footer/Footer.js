"use client";

import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ArrowUp } from "react-bootstrap-icons";
import Image from "next/image";
import { ROUTES } from "utils/routes";
import { useSiteSettings } from "contexts/SiteContext";
import { formatPhoneNumber, getFileFullPath } from "utils/formats";

// Default data - will be merged with site settings
const defaultFooterData = {
  quickLinks: {
    title: "Quick Links",
    links: [
      { href: ROUTES.ABOUT, text: "About Us" },
      { href: ROUTES.SERVICES, text: "Services" },
      { href: ROUTES.STORES, text: "Stores" },
      { href: ROUTES.FRANCHISE, text: "Franchise" },
      { href: ROUTES.BLOGS, text: "Blogs" },
      { href: ROUTES.CONTACT, text: "Contact Us" },
    ],
  },
  footerBottom: {
    links: [
      { href: ROUTES.PRIVACY, text: "Privacy Policy" },
      { href: ROUTES.TERMS, text: "Terms of Service" },
    ],
  },
  scrollToTop: {
    ariaLabel: "Go to top",
    iconSize: 20,
  },
};

export default function Footer() {
  const siteSettings = useSiteSettings();
  const logoSrc = siteSettings?.site_logo || "";
  const siteName = siteSettings?.site_name || "";
  const shortIntro = siteSettings?.short_intro || "";
  const copyrightContent = siteSettings?.copyright_text || "";
  const currentYear = new Date().getFullYear();
  const copyrightText = `Copyright © ${currentYear} ${copyrightContent}`;
  const primaryPhone = siteSettings?.phone || "";
  const primaryEmail = siteSettings?.email || "";

  // Build social links from site settings
  const socialLinks = [
    siteSettings?.facebook_link && { href: siteSettings.facebook_link, image: { src: "/images/icons/facebook.svg", alt: "Facebook", width: 20, height: 20 }, },
    siteSettings?.twitter_link && { href: siteSettings.twitter_link, image: { src: "/images/icons/twitter.svg", alt: "Twitter", width: 20, height: 20 }, },
    siteSettings?.linkedin_link && { href: siteSettings.linkedin_link, image: { src: "/images/icons/linkedin.svg", alt: "LinkedIn", width: 20, height: 20 }, },
    siteSettings?.instagram_link && { href: siteSettings.instagram_link, image: { src: "/images/icons/instagram.svg", alt: "Instagram", width: 20, height: 20 }, },
    siteSettings?.location_link && { href: siteSettings.location_link, image: { src: "/images/icons/map.svg", alt: "Map", width: 20, height: 20 }, },
    siteSettings?.google_plus_link && { href: siteSettings.google_plus_link, image: { src: "/images/icons/google.svg", alt: "Google", width: 20, height: 20 }, },
    siteSettings?.email_address && { href: `mailto:${siteSettings.email_address}`, image: { src: "/images/icons/envelope.svg", alt: "Email", width: 20, height: 20 }, },
    siteSettings?.youtube_link && { href: siteSettings.youtube_link, image: { src: "/images/icons/youtube.svg", alt: "Youtube", width: 20, height: 20 }, },
  ].filter(Boolean);

  // Contact details
  const contactDetails = [
    primaryPhone && {
      icon: { src: "/images/icons/call.svg", alt: "Call", width: 32, height: 32 },
      label: "To More Inquire",
      value: formatPhoneNumber(primaryPhone),
      href: `tel:${primaryPhone}`,
    },
    primaryEmail && {
      icon: { src: "/images/icons/mail.svg", alt: "Mail", width: 32, height: 32 },
      label: "To Send Mail",
      value: primaryEmail,
      href: `mailto:${primaryEmail}`,
    },
  ].filter(Boolean);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth", });
  };

  return (
    <footer className="footer">
      <Container>
        <div className="footer-top">
          <Row>
            <Col xs={12} sm={12} lg={6}>
              <div className="footer-logo">
                <a href="/" className="footer-logo-link">
                  {logoSrc && (
                    logoSrc?.startsWith("/backend-assets") ? (
                      <img
                        src={getFileFullPath(logoSrc)}
                        alt={`${siteName} Logo`}
                        className="logo-image"
                      />
                    ) : (
                      <img
                        src={logoSrc}
                        alt={`${siteName} Logo`}
                        className="logo-image"
                      />
                    )
                  )}
                </a>
                <p className="m-0">{shortIntro}</p>
              </div>
              {socialLinks.length > 0 && (
                <div className="social-links">
                  {socialLinks.map((socialLink, index) => (
                    <a
                      key={index}
                      href={socialLink.href}
                      className="social-icon-btn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src={socialLink.image.src}
                        alt={socialLink.image.alt}
                        width={socialLink.image.width}
                        height={socialLink.image.height}
                      />
                    </a>
                  ))}
                </div>
              )}
            </Col>

            <Col xs={12} sm={12} lg={6}>
              <div className="footer-links">
                <h4 className="white-title">{defaultFooterData.quickLinks.title}</h4>
                <div className="quick-link">
                  {defaultFooterData.quickLinks.links.map((link, index) => (
                    <a key={index} href={link.href} className="footer-link">
                      {link.text}
                    </a>
                  ))}
                </div>
                {contactDetails.length > 0 && (
                  <div className="contact-details">
                    {contactDetails.map((contact, index) => (
                      <div key={index} className="details-list">
                        <Image src={contact.icon.src} alt={contact.icon.alt} width={contact.icon.width} height={contact.icon.height} />
                        <div className="divider-line"></div>
                        <div className="more-inquire">
                          <p className="text-gray m-0">{contact.label}</p>
                          <a href={contact.href} className="m-0">
                            {contact.value}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </div>
        <div className="footer-bottom">
          <Row>
            <Col>
              <div className="footer-text">
                <p className="mb-0">{copyrightText}</p>
                <div className="quick-link">
                  {defaultFooterData.footerBottom?.links?.map((link, index) => (
                    <a key={index} href={link.href} target="_blank" className="footer-link">
                      {link.text}
                    </a>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
      <button
        className={`go-to-top-btn ${showScrollTop ? "show" : ""}`}
        onClick={scrollToTop}
        aria-label={defaultFooterData.scrollToTop.ariaLabel}
      >
        <ArrowUp size={defaultFooterData.scrollToTop.iconSize} />
      </button>
    </footer>
  );
}
