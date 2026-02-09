"use client";

import { useState, useEffect } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ROUTES } from "utils/routes";
import { useSiteSettings } from "contexts/SiteContext";
import { getFileFullPath } from "utils/formats";

const STATIC_NAV_ITEMS = {
  about: { label: "About Us", href: ROUTES.ABOUT },
  stores: { label: "Stores", href: ROUTES.STORES },
  contact: { label: "Contact Us", href: ROUTES.CONTACT },
};

export default function Header({ services = [] }) {
  const siteSettings = useSiteSettings();
  const pathname = usePathname();
  const logoSrc = siteSettings?.site_logo || "/images/logo/logo.svg";
  const siteName = siteSettings?.site_name || "ClickITCo";
  const [hoveredDropdown, setHoveredDropdown] = useState(null);
  const [clickedDropdown, setClickedDropdown] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Generate navigation items with dynamic services
  const NAV_ITEMS = [
    STATIC_NAV_ITEMS.about,
    {
      label: "Services",
      href: ROUTES.SERVICES,
      type: "dropdown",
      items: services.map((service) => ({
        label: service.service_name || "",
        href: service.service_slug
          ? `${ROUTES.SERVICES}/${service.service_slug}`
          : ROUTES.SERVICES,
      })),
    },
    STATIC_NAV_ITEMS.stores,
    STATIC_NAV_ITEMS.contact,
  ];

  // Detect mobile/tablet devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 992); // Bootstrap lg breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle scroll for sticky header effects with throttling
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollState = () => {
      const scrollPosition = window.scrollY || window.pageYOffset;
      setIsScrolled(scrollPosition > 200);
      lastScrollY = scrollPosition;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollState);
        ticking = true;
      }
    };

    // Check initial scroll position
    updateScrollState();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if a route is active
  const isActiveRoute = (href) => {
    if (href === ROUTES.HOMEPAGE) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // Close dropdown when clicking outside on mobile/tablet
  useEffect(() => {
    if (!isMobile || clickedDropdown === null) return;

    const handleClickOutside = (event) => {
      const dropdownElement = document.getElementById(
        `dropdown-${clickedDropdown}`
      );
      if (dropdownElement && !dropdownElement.contains(event.target)) {
        setClickedDropdown(null);
      }
    };

    // Small delay to avoid immediate closing when opening
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMobile, clickedDropdown]);

  return (
    <Navbar
      expand="lg"
      bg="white"
      className={`header-nav ${isScrolled ? "scrolled" : ""}`}
      sticky="top"
    >
      <Container>
        <Navbar.Brand className="d-flex align-items-center m-0 p-0" href="/">
          <div className="logo-box position-relative">
            {logoSrc && logoSrc !== "/images/logo/logo.svg" ? (
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
            ) : (
              <img
                src={logoSrc}
                alt={`${siteName} Logo`}
                className="logo-image"
              />
            )}
          </div>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            {NAV_ITEMS.map((item, index) => {
              if (item.type === "dropdown") {
                const isDropdownOpen = isMobile
                  ? clickedDropdown === index
                  : hoveredDropdown === index;

                const isActive = isActiveRoute(item.href) || item.items?.some(sub => isActiveRoute(sub.href));
                return (
                  <div
                    key={index}
                    className={`nav-link-custom dropdown d-flex align-items-center gap-2 ${isActive ? 'active' : ''}`}
                    onMouseEnter={() => !isMobile && setHoveredDropdown(index)}
                    onMouseLeave={() => !isMobile && setHoveredDropdown(null)}
                  >
                    <Nav.Link
                      href={item.href}
                      className="fw-medium p-0"
                      onClick={() => {
                        if (isMobile) setClickedDropdown(null);
                      }}
                    >
                      {item.label}
                    </Nav.Link>
                    <NavDropdown
                      title={
                        <span className="d-flex align-items-center gap-2">
                          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="dropdown-arrow"
                            style={{ transform: isMobile && isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease", }}
                          >
                            <path d="M11.7225 0.319566C12.0924 0.745515 12.0925 1.43631 11.7225 1.8623L6.66974 7.68046C6.49209 7.88502 6.25114 8 5.99982 8C5.74853 8 5.50758 7.88511 5.3299 7.68046L0.277381 1.8623C0.0925293 1.6493 0 1.37007 0 1.09089C0 0.811702 0.0925283 0.53247 0.277503 0.319566C0.647491 -0.106476 1.24732 -0.106476 1.61734 0.319566L5.99994 5.36626L10.3829 0.319566C10.7527 -0.106523 11.3526 -0.106523 11.7225 0.319566Z" fill="#0C0E11" />
                          </svg>
                        </span>
                      }
                      id={`dropdown-${index}`}
                      className="fw-medium services-dropdown"
                      show={isDropdownOpen}
                      onToggle={(isOpen, event) => {
                        if (isMobile && event) {
                          setClickedDropdown(
                            clickedDropdown === index ? null : index
                          );
                        }
                      }}
                    >
                      <div className="dropdown-menu-scroll">
                        {item.items.map((sub, subIndex) => {
                          const isSubActive = isActiveRoute(sub.href);
                          return (
                            <NavDropdown.Item
                              key={subIndex}
                              href={sub.href}
                              className={isSubActive ? 'active' : ''}
                              onClick={() => {
                                if (isMobile) {
                                  setClickedDropdown(null);
                                }
                              }}
                            >
                              {sub.label}
                            </NavDropdown.Item>
                          );
                        })}
                      </div>
                    </NavDropdown>
                  </div>
                );
              }

              const isActive = isActiveRoute(item.href);
              return (
                <Nav.Link
                  key={index}
                  href={item.href}
                  className={`fw-medium nav-link-custom ${isActive ? 'active' : ''}`}
                >
                  {item.label}
                </Nav.Link>
              );
            })}
          </Nav>

          <a href={ROUTES?.FRANCHISE} className="btn-click">
            Franchise Partner
            <svg
              width="35"
              height="35"
              viewBox="0 0 35 35"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="35" height="35" rx="17.5" fill="#F58027" />
              <path
                d="M13.5 21.5L21.5 13.5M21.5 13.5H14.3M21.5 13.5V20.7"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
