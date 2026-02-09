/* eslint-disable @next/next/no-img-element */
"use client";
import { Container, Row, Col } from "react-bootstrap";
import { getFileFullPath } from "utils/formats";

export default function DetailSection1({ data }) {
  if (!data) return null;

  return (
    <section className="gray-bg">
      <div className="detail-section-wrapper">
        {data?.background_image && (
          <div className="detail-section-image" data-aos="fade-up" suppressHydrationWarning>
            <img src={getFileFullPath(data.background_image)} alt={data?.title || "Service Detail"} />
          </div>
        )}
        <Container>
          <Row>
            <Col xs={12} md={12} lg={6}>
            </Col>
            <Col xs={12} md={12} lg={6} className="p-0">
              <div className="detail-business-content" >
                {data?.title && (
                  <div className="insights-section" data-aos="fade-up" suppressHydrationWarning>
                    <h2 className="insights-section-title">
                      {data.title}
                      <img src="/images/icons/title-underline.svg" alt="Title underline" fill="true" className="insights-underline" />
                    </h2>
                  </div>
                )}

                {data?.highlights && data.highlights.length > 0 && (
                  <ul className="detail-highlight-card">
                    {data.highlights.map((highlight, index) => (
                      <li key={index} data-aos="flip-left" data-aos-delay={index * 100} suppressHydrationWarning>
                        {highlight?.title && <h5>{highlight?.title}</h5>}
                        {highlight?.description && <p className="m-0">{highlight.description}</p>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </section>
  );
}

