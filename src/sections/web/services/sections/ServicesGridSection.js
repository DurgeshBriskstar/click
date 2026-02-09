"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";
import { SvgIcon } from "@mui/material";
import ServicesIcon from "icons/duotone/Services";
import { Globe } from "react-bootstrap-icons";
import { ROUTES } from "utils/routes";
import { getFileFullPath } from "utils/formats";

const ITEMS_PER_LOAD = 6;

export default function ServicesGridSection({ data, services = [] }) {
  const [hoveredService, setHoveredService] = useState(null);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef(null);

  const hasMoreServices = visibleCount < services.length;
  const visibleServices = services.slice(0, visibleCount);

  const loadMoreServices = useCallback(() => {
    if (isLoading || !hasMoreServices) return;

    setIsLoading(true);

    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + ITEMS_PER_LOAD, services.length));
      setIsLoading(false);
    }, 800);
  }, [isLoading, hasMoreServices, services.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMoreServices && !isLoading) {
          loadMoreServices();
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0.1,
      }
    );

    const currentLoaderRef = loaderRef.current;
    if (currentLoaderRef) {
      observer.observe(currentLoaderRef);
    }

    return () => {
      if (currentLoaderRef) {
        observer.unobserve(currentLoaderRef);
      }
    };
  }, [hasMoreServices, isLoading, loadMoreServices]);

  if (!data) return null;

  return (
    <section className="section gray-bg services-grid-section">
      <Container>
        {/* Section Header */}
        <div className="text-center">
          <div className="insights-section">
            <h2 className="insights-section-title">
              {data?.title || ""}
              <img src="/images/icons/title-underline.svg" alt="Title underline" fill="true" className="insights-underline" />
            </h2>
          </div>
          <div className="sub-title">
            <p className="m-0">{data?.subtitle || ""}</p>
          </div>
        </div>

        {
          (!services || services.length > 0)
            ? (
              <>
                <Row className="mt-5">
                  {visibleServices.map((service, index) => {
                    const isHovered = hoveredService === service.id;
                    const isFirstCard = index === 0;

                    return (
                      <Col key={service?.id || index} lg={4} md={6} sm={12} className="m-0">
                        <div className={`service-card-modern ${isHovered ? "hovered" : ""} ${isFirstCard ? "featured" : ""}`} onMouseEnter={() => setHoveredService(service?.id)} onMouseLeave={() => setHoveredService(null)}>
                          <div className="icon-top">
                            <Link href={service?.service_slug ? `${ROUTES?.SERVICES}/${service?.service_slug}` : "#"} className="service-card-corner-btn">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </Link>
                          </div>
                          <div className="service-card-modern-content">
                            <div className="service-card-header-row">
                              <div className={`service-card-icon icon-gray`}>
                                {service?.icon
                                  ? (service?.icon?.startsWith("/backend-assets") ? (
                                    <img src={getFileFullPath(service?.icon)} alt={service?.service_name || "Service"} className="service-icon" style={{ width: 40, height: 40, objectFit: "contain" }} />
                                  ) : (
                                    <Image src={service?.icon} alt={service?.service_name || "Service"} width={40} height={40} className="service-icon" />
                                  ))
                                  : <Globe size={28} />
                                }


                              </div>
                              <h3 className="service-card-modern-title">
                                {service?.service_name || "Service"}
                              </h3>
                            </div>

                            <p className="service-card-modern-description">
                              {service?.short_description?.length > 100
                                ? `${service?.short_description?.substring(0, 100)}...`
                                : service?.short_description}
                            </p>
                            <div className="service-card-thumbnail">
                              {service?.image ? (
                                service?.image?.startsWith("/backend-assets") ? (
                                  <img src={getFileFullPath(service?.image)} alt={service?.service_name || "Service"} className="service-card-thumbnail-image" style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                                ) : (
                                  <Image src={service?.image} alt={service?.service_name || "Service"} width={300} height={200} className="service-card-thumbnail-image" />
                                )
                              ) : (
                                <div className="service-card-thumbnail-placeholder">
                                  <SvgIcon component={ServicesIcon} sx={{ fontSize: 40, color: "var(--text-secondary)", }} />
                                </div>
                              )}
                            </div>
                            <div className="service-buttons gap-3 w-100 d-flex mt-4 flex-wrap">
                              <a tabIndex={0} href={`${ROUTES?.APPOINTMENT}?service_slug=${service?.service_slug}`} className="service-card-read-more m-0">
                                Book an Appointment
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M0.75 10.75L10.75 0.75M10.75 0.75H1.75M10.75 0.75V9.75" stroke="#0C0E11" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </a>
                              <Link href={service?.service_slug ? `${ROUTES?.SERVICES}/${service?.service_slug}` : "#"} className="service-card-read-more m-0">
                                Read More
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M0.75 10.75L10.75 0.75M10.75 0.75H1.75M10.75 0.75V9.75" stroke="#0C0E11" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </Link>
                            </div>


                          </div>
                        </div>
                      </Col>
                    );
                  })}
                </Row>

                {/* Lazy Load Trigger & Loading Indicator */}
                {hasMoreServices && (
                  <div ref={loaderRef} className="text-center py-5">
                    {isLoading && (
                      <div className="d-flex flex-column align-items-center gap-2">
                        <p className="mb-0" style={{ color: 'var(--orange-color)' }}>Loading...</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )
            : (
              <Row>
                <Col lg={12}>
                  <div className="text-center py-5">
                    <p className="text-secondary">No services available at the moment.</p>
                  </div>
                </Col>
              </Row>
            )
        }
      </Container>
    </section>
  );
}
