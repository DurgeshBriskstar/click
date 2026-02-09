/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Form, InputGroup, Button } from "react-bootstrap";
import { ROUTES } from "utils/routes";
import { getFileFullPath } from "utils/formats";

export default function HeroSection({ data, services }) {
  const router = useRouter();
  const [randomServices, setRandomServices] = useState([]);
  const [searchText, setSearchText] = useState("");

  if (!data) return null;

  const serviceData = services?.data || [];

  useEffect(() => {
    if (!serviceData?.length) return;

    const shuffled = serviceData?.slice()?.sort(() => 0.5 - Math.random())?.slice(0, 5);

    setRandomServices(shuffled);
  }, [serviceData]);

  const filteredServices = useMemo(() => {
    if (!searchText) return randomServices;

    return serviceData.filter((service) => service?.service_name?.toLowerCase().includes(searchText.toLowerCase()));

  }, [searchText, randomServices]);

  const gridRef = useRef(null);

  const column1Services = [].filter(Boolean);
  const column2Services = [].filter(Boolean);
  const column3Services = [].filter(Boolean);

  const allUsed = [...column1Services, ...column2Services, ...column3Services];
  const remaining = serviceData.filter((s) => !allUsed.includes(s));

  while (column1Services.length < 5 && remaining.length > 0) {
    column1Services.push(remaining.shift());
  }
  while (column2Services.length < 5 && remaining.length > 0) {
    column2Services.push(remaining.shift());
  }
  while (column3Services.length < 5 && remaining.length > 0) {
    column3Services.push(remaining.shift());
  }

  const renderServiceCard = (service, index) => {
    if (!service) return null;

    const imagePath = service?.image || "";
    const hasImage = imagePath && !imagePath.includes("undefined");

    return (
      <div onClick={() => service?.service_slug ? router?.push(`${ROUTES?.SERVICES}/${service?.service_slug}`) : null} key={`${service?.id}-${index}`} className="service-card">
        {hasImage ? (
          <>
            <img src={getFileFullPath(imagePath)} alt={service?.service_name} style={{ objectFit: "cover" }} />
            <div className="service-overlay">
              <span className="service-name">{service?.service_name}</span>
            </div>
          </>
        ) : (
          <div className="service-card-fallback">
            <div className="service-icon-placeholder">{service?.service_name}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="hero-section">
      <img src="/images/sections/herosection/shape.png" alt="hero-shape" fill="true" className="hero-shape" />
      <div className="hero-wrapper">
        <Container>
          <div className="hero-container">
            <div className="hero-content">
              <div className="text-left">
                <div className="insights-section" data-aos="fade-up">
                  <h1 className="m-0">
                    <div className="main-title">
                      {data?.title && data?.title || ""}
                      <img src="/images/icons/title-underline.svg" alt="Title underline" fill="true" className="insights-underline" />
                    </div>
                  </h1>
                </div>
                <p className="hero-subtitle" data-aos="fade-up" data-aos-delay="200">
                  {data.subtitle || ""}
                </p>
              </div>

              <div className="search-container" data-aos="fade-up" data-aos-delay="400">
                <InputGroup>
                  <img src="/images/sections/herosection/search.svg" alt="hero-shape" fill="true" className="search-icon" />
                  <Form.Control type="text" onChange={(e) => setSearchText(e.target.value)} placeholder={data.searchPlaceholder || "Search a service..."} className="search-input" />
                </InputGroup>
              </div>

              <div className="filter-tags" data-aos="fade-up" data-aos-delay="600">
                {filteredServices.length > 0 ? (
                  filteredServices.map((service, index) => (
                    <Button
                      key={service.id || index}
                      href={service?.service_slug ? `${ROUTES?.SERVICES}/${service?.service_slug}` : "#"}
                      variant="outline-primary"
                      className="filter-tag rounded-pill"
                    >
                      {service?.service_name}
                    </Button>
                  ))
                ) : (
                  <span className="no-results">No services found</span>
                )}
              </div>
            </div>
          </div>
        </Container>

        <div className="hero-slider" data-aos="fade-up">
          <div className="service-grid" ref={gridRef}>
            {/* Column 1 - Slides Down */}
            <div className="grid-column col-1">
              <div className="slider-track" data-direction="down">
                {[...column1Services, ...column1Services].map((service, index) =>
                  renderServiceCard(service, `col1-${index}`)
                )}
              </div>
            </div>

            {/* Column 2 - Slides Up */}
            <div className="grid-column col-2">
              <div className="slider-track" data-direction="up">
                {[...column2Services, ...column2Services].map((service, index) =>
                  renderServiceCard(service, `col2-${index}`)
                )}
              </div>
            </div>

            {/* Column 3 - Slides Down */}
            <div className="grid-column col-3">
              <div className="slider-track" data-direction="down">
                {[...column3Services, ...column3Services].map((service, index) =>
                  renderServiceCard(service, `col3-${index}`)
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
