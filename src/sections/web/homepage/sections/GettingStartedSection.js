/* eslint-disable @next/next/no-img-element */
"use client";

import { Container, Row, Col } from "react-bootstrap";
import { getFileFullPath } from "utils/formats";

export default function GettingStartedSection({ data }) {
  if (!data) return null;

  return (
    <section className="section">
      <Container>
        <div className="text-center">
          <div className="insights-section" data-aos="zoom-in">
            <h2 className="insights-section-title">
              {data?.title}
              <img
                src="/images/icons/title-underline.svg"
                alt="Title underline"
                fill="true"
                className="insights-underline"
              />
            </h2>
          </div>
          <p className="m-0" data-aos="zoom-in" data-aos-delay="200">{data?.subtitle}</p>
        </div>
        <div className="getting-wrapper dotted-line-bg">
          <Row className="justify-content-center">
            {data?.highlights?.map((highlight, index) => (
              <Col
                xs={12}
                md={6}
                lg={4}
                key={index}
                className="d-flex justify-content-center"
                data-aos="zoom-in-up"
                data-aos-delay={index * 200}
              >
                <div className="getting-item">
                  <div className="step-image">
                    <img
                      src={getFileFullPath(highlight?.image || "/images/sections/blog/blog-01.jpg")}
                      alt={highlight?.title}
                    />
                    <div className="step-circle">{index + 1}</div>
                  </div>
                  <div className="step-content">
                    <h5 className="step-title">{highlight?.title}</h5>
                    <p className="mb-0">{highlight?.description}</p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </section>
  );
}
