/* eslint-disable @next/next/no-img-element */
"use client";

import { Container, Row, Col } from "react-bootstrap";
import { getFileFullPath } from "utils/formats";

export default function DetailSection2({ data }) {
  if (!data) return null;

  return (
    <section className="section gray-bg">
      <Container>
        <div className="" data-aos="fade-up">
          <h3 className="mb-0">{data.title}</h3>
          <div className="divider"></div>
        </div>
        <Row>
          <Col xs={12} md={12} lg={5} className="order-1 order-md-2" data-aos="fade-right">
            {data?.highlights && data.highlights.length > 0 && (
              <ul className="points-list black-text">
                {data.highlights.map((highlight, index) => (
                  <li key={index} data-aos="fade-right" data-aos-delay={index * 100}>
                    <img src="/images/icons/right.svg" alt="" fill="true" />
                    <span>{highlight?.value || highlight?.title}</span>
                  </li>
                ))}
              </ul>
            )}
          </Col>
          <Col xs={12} md={12} lg={7} className="order-2 order-md-1" data-aos="fade-up">
            {data?.image && (
              <div className="box-management-img">
                <img src={getFileFullPath(data.image)} alt={data?.title || "Service Detail"} />
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </section>
  );
}

