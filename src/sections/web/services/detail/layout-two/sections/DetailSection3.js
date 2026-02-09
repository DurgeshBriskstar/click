/* eslint-disable @next/next/no-img-element */
"use client";

import { Container, Row, Col } from "react-bootstrap";
import { getFileFullPath } from "utils/formats";

export default function DetailSection3({ data }) {
  if (!data) return null;

  return (
    <section className="section">
      <Container>
        <Row className="align-items-center">
          <Col xs={12} md={12} lg={7} data-aos="fade-right">
            <div className="insights-section" data-aos="fade-up">
              <h2 className="insights-section-title">
                {data?.title}
                <img src="/images/icons/title-underline.svg" alt="Title underline" fill="true" className="insights-underline" />
              </h2>
            </div>
            {data?.description && (<p className="m-0" data-aos="fade-up" data-aos-delay="200">{data.description}</p>)}
          </Col>
          <Col xs={12} md={12} lg={5} data-aos="fade-up">
            {data?.background_image && (
              <div className="Backup-management-img">
                <img src={getFileFullPath(data.background_image)} alt={data?.title || "Service Detail"} className="mover-img" />
              </div>
            )}
          </Col>
        </Row>

        {data?.cardTitle || (data?.highlights && data.highlights.length > 0) ? (
          <div className="file-management-card">
            {data?.cardTitle && (
              <h3 className="mb-4">{data.cardTitle}</h3>
            )}
            {data?.highlights && data.highlights.length > 0 && (
              <ul className="points-list black-text">
                {data.highlights.map((highlight, index) => (
                  <li key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                    <img src="/images/icons/right.svg" alt="" fill="true" />
                    <span>{highlight?.value || highlight?.title}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}
      </Container>
    </section>
  );
}

