"use client";

import ClientIframe from "components/custom/common/ClientIframe";
import { Container, Row, Col } from "react-bootstrap";
import { getFileFullPath } from "utils/formats";

export default function FranchiseIntroFormSection({ data }) {
  if (!data) return null;

  const iframe = data?.form_iframe || "";

  return (
    <section className="section franchise-intro-form-section">
      <Container>
        <Row className="align-items-center">
          <Col lg={12} data-aos="fade-right">
            <div className="franchise-intro-content">
              {data?.title && (
                <div className="insights-section">
                  <h2 className="insights-section-title">
                    {data.title}
                    <img src="/images/icons/title-underline.svg" alt="Title underline" fill="true" className="insights-underline" />
                  </h2>
                </div>
              )}

              {data?.subtitle && (
                <p className="franchise-intro-subtitle">
                  {data.subtitle}
                </p>
              )}
              {data?.description && (
                <p className="mb-5" data-aos="fade-up" data-aos-delay="300">
                  {data.description}
                </p>
              )}
              <div className="franchise-pillars-wrapper" data-aos="fade-up" data-aos-delay="400">
                <h4>{data?.second_title}</h4>
                {
                  data?.highlights?.length > 0 &&
                  <ul>
                    {
                      data?.highlights?.map((highlight, index) => (
                        <li key={`high${index}`} data-aos="fade-up" data-aos-delay={500 + (index * 100)}>
                          <img src={getFileFullPath(highlight?.image || "/")} alt="investment" />
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
            </div>
          </Col>

          <Col lg={12} data-aos="fade-left">
            <div className="franchise-form-wrapper">
              <div className="franchise-form-card">
                <ClientIframe html={iframe} />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

