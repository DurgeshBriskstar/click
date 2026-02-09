/* eslint-disable @next/next/no-img-element */
"use client";

import { Container, Row, Col } from "react-bootstrap";
import { getFileFullPath } from "utils/formats";

export default function ProductisedCategoriesSection({ data }) {
  if (!data) return null;

  return (
    <section className="section shape-bg">
      <Container>
        <div className="text-center">
          <div className="insights-section" data-aos="flip-up">
            <h2 className="insights-section-title">
              {data?.title || ""}
              <img
                src="/images/icons/title-underline.svg"
                alt="Title underline"
                fill="true"
                className="insights-underline"
              />
            </h2>
          </div>
          <div className="sub-title" data-aos="flip-up" data-aos-delay="200">
            <p className="m-0">{data?.subtitle}</p>
          </div>
        </div>
        <div className="card-list">
          <Row>
            {
              data?.highlights?.length && data?.highlights?.map((highlight, index) => (
                <Col xs={12} md={6} lg={3} key={index} data-aos="flip-up" data-aos-delay={index * 150}>
                  <div className="card-custom">
                    <img
                      src={getFileFullPath(highlight?.image || "/images/sections/blog/blog-01.jpg")}
                      alt={highlight?.title}
                    />
                    <h5>{highlight?.title}</h5>
                    <p className="m-0">{highlight?.description}</p>
                  </div>
                </Col>
              ))}
          </Row>
        </div>
      </Container>
    </section>
  );
}
