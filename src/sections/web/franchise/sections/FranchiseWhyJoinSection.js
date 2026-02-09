"use client";

import { Container, Row, Col } from "react-bootstrap";
import Image from "next/image";
import { getFileFullPath } from "utils/formats";

export default function FranchiseWhyJoinSection({ data }) {
  if (!data) return null;

  return (
    <section className="section gray-bg franchise-why-join-section">
      <Container>
        <Row className="align-items-center">
          <Col lg={6} data-aos="fade-right">
            <div className="franchise-why-join-content">
              {data?.title && (
                <div className="insights-section mb-4">
                  <h2 className="insights-section-title">
                    {data.title}
                    <img src="/images/icons/title-underline.svg" alt="Title underline" fill="true" className="insights-underline" />
                  </h2>
                </div>
              )}

              {data?.subtitle && (
                <p className="m-0" data-aos="fade-up" data-aos-delay="200">
                  {data.subtitle}
                </p>
              )}

              {
                data?.highlights?.length > 0 &&
                <ul className="franchise-why-join-list">
                  {
                    data?.highlights?.map((highlight, index) => (
                      <li key={`high_${index}`}>
                        <img src="/images/sections/franchise/check-mark.svg" alt="check-mark" />
                        <div className="pillar-details">
                          <h5>{highlight?.title}</h5>
                          <p>{highlight?.description}</p>
                        </div>
                      </li>
                    ))
                  }
                </ul>
              }
            </div>
          </Col>

          <Col lg={6} data-aos="fade-left">
            <div className="franchise-why-join-image">
              <img src={getFileFullPath(data?.background_image || "/")} alt="FranchiseWhyJoinSection" />
            </div>
          </Col>

        </Row>
      </Container>
    </section>
  );
}

