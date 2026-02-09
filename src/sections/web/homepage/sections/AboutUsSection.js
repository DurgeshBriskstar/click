/* eslint-disable @next/next/no-img-element */
"use client";

import { Container, Row, Col } from "react-bootstrap";
import { People, Gear, ShieldCheck, Globe } from "react-bootstrap-icons";
import { getFileFullPath } from "utils/formats";

export default function AboutUsSection({ data }) {
  if (!data) return null;

  const getIcon = (iconName) => {
    switch (iconName) {
      case "people":
        return <People size={28} />;
      case "services":
        return <Gear size={28} />;
      case "certified":
        return <ShieldCheck size={28} />;
      case "years":
        return <Globe size={28} />;
      default:
        return <People size={28} />;
    }
  };

  return (
    <section className="section about-bg">
      <Container>
        <div className="insights-left">
          <div className="insights-section" data-aos="fade-left">
            <h2 className="insights-section-title">
              {data.title}
              <img
                src="/images/icons/title-underline.svg"
                alt="Title underline"
                fill="true"
                className="insights-underline"
              />
            </h2>
          </div>
          <p className="m-0" data-aos="fade-left" data-aos-delay="200">{data.subtitle}</p>
        </div>

        <Row>
          {data?.highlights?.map((highlight, index) => (
            <Col xs={12} md={6} lg={3} key={index} data-aos="flip-left" data-aos-delay={index * 200}>
              {index === 0 ? (
                // First card with different structure
                <div className="about-card about-card-first">
                  <div className="stat-value-large">
                    {highlight?.title}
                  </div>
                  <p className="stat-label-first m-0">{highlight?.description}</p>
                  {highlight?.buttonText && (
                    <a href={highlight?.buttonLink || "#"} className="btn-click">
                      {highlight?.buttonText}
                      <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="35" height="35" rx="17.5" fill="#F58027" />
                        <path d="M13.5 21.5L21.5 13.5M21.5 13.5H14.3M21.5 13.5V20.7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  )}
                </div>
              ) : (
                <div className="about-card">
                  {highlight?.image && (
                    <div className="icon-circle">
                      <img src={getFileFullPath(highlight?.image)} alt={highlight?.title} />
                    </div>
                  )}
                  <p className="stat-label m-0">{highlight?.title}</p>
                </div>
              )}
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
