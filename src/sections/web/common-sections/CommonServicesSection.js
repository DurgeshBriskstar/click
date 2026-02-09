"use client";

import { useState, useEffect, useRef } from "react";
import { Container } from "react-bootstrap";
import Image from "next/image";
import { CircleExpand } from "utils/circleExpand";
import { ROUTES } from "utils/routes";
import { getFileFullPath } from "utils/formats";

export default function ServicesSection({ data, services }) {
  const circleExpandRef = useRef(null);

  if (!data) return null;
  const serviceData = services?.data || [];

  const totalServices = serviceData.length;

  const [activeService, setActiveService] = useState(
    serviceData.find((item) => item.expanded)?.id || serviceData[0]?.id || null
  );

  const handleMouseEnter = (serviceId) => {
    setActiveService(serviceId);
  };

  const handleMouseLeave = () => {
    setActiveService(null);
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 992) {
      const circleExpand = new CircleExpand({
        wrapper: ".circle-expand-wrapper",
        circle: ".circle-expand",
        content: ".circle-expand-content",
        minSize: 600,
        easing: "easeOutCubic",
      });

      circleExpandRef.current = circleExpand;

      return () => {
        if (circleExpandRef.current) {
          circleExpandRef.current.destroy();
        }
      };
    }
  }, []);

  return (
    <section className="circle-expand-wrapper">
      <div className="circle-sticky">
        <div className="circle-expand">
          <div className="circle-expand-content">
            <div className="services-section">
              <Container>
                {/* Header */}
                <div className="services-header">
                  <div className="text-center">
                    <div className="insights-section">
                      <h2 className="insights-section-title text-white">
                        {data?.title}
                        <img src="/images/sections/services/title-underline-shape.svg" alt="Title underline" fill="true" className="insights-underline" />
                      </h2>
                    </div>
                  </div>
                  <div className="services-count">
                    <span className="count-dot"></span>
                    <span className="count-text">{totalServices} Services</span>
                  </div>
                </div>

                {/* Services List */}
                <div className="services-list">
                  {serviceData?.map((service, index) => {
                    const isActive = activeService === service?.id;
                    return (
                      <div 
                        key={service?.id} 
                        className={`service-item ${isActive ? "active" : ""}`} 
                        data-service={service?.id}
                        onMouseEnter={() => handleMouseEnter(service?.id)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="service-header">
                          <div className="service-info">
                            <span className="service-number">{index + 1}</span>
                            <h3 className="service-name">
                              {service?.service_name}
                            </h3>
                          </div>
                          <div className="service-band">
                            <div className="service-content">
                              <div className="service-image">
                                {service?.image && (
                                  service?.image?.startsWith("/backend-assets") ? (
                                    <img 
                                      src={getFileFullPath(service?.image)} 
                                      alt={service?.service_name} 
                                      style={{ width: "100%", height: "200px", objectFit: "cover" }} 
                                    />
                                  ) : (
                                    <Image src={service?.image} alt={service?.service_name} width={280} height={200} style={{ objectFit: "cover" }} />
                                  )
                                )}
                              </div>
                              <div className="service-features">
                                {service?.highlights?.length > 0 && (
                                  <ul>
                                    {service?.highlights.map(
                                      (highlight, index) => (
                                        <li key={index}>
                                          <img alt="" fill="true" src="/images/icons/right.svg" />
                                          <span>{highlight?.title}</span>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                )}
                                <div className="service-buttons gap-2 w-100 d-flex" onClick={(e) => e.stopPropagation()}>
                                  <a tabIndex={0} href={`${ROUTES?.APPOINTMENT}?service_slug=${service?.service_slug}`} className="btn-click btn-sm d-inline-flex btn btn-secondary">
                                    Book an Appointment
                                  </a>
                                  <a tabIndex={0} href={service?.service_slug ? `${ROUTES?.SERVICES}/${service?.service_slug}` : "#"} className="btn-click btn-sm d-inline-flex btn btn-primary">
                                    Learn More
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className={`service-arrow ${isActive ? "active" : ""}`}>
                              <svg width="16" height="16" style={{ transform: isActive ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 1s cubic-bezier(0.4, 0, 0.2, 1)", }} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 15L15 1M15 1H2.4M15 1V13.6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Container>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
