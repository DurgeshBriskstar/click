/* eslint-disable @next/next/no-img-element */
"use client";

import { Container, Row, Col } from "react-bootstrap";
import Image from "next/image";
import { getFileFullPath } from "utils/formats";

export default function IntroSection({ data }) {
  if (!data) return null;

  return (
    <section className="section gray-bg">
      <Container>
        <Row>
          <Col xs={12} md={6} data-aos="fade-right">
            <div className="about-wrapper">
              {data?.background_image && (
                <div className="about-intro-image">
                  <img src={getFileFullPath(data?.background_image)} alt="About Us Intro Image" className="" />
                </div>
              )}
            </div>
          </Col>
          <Col xs={12} md={6} data-aos="fade-left">
            <div className="insights-center">
              <div className="insights-section">
                <h2 className="insights-section-title">
                  {data?.title}
                  <img src="/images/icons/title-underline.svg" alt="Title underline" className="insights-underline" />
                </h2>
              </div>
              <div className="">
                <p className="">{data?.subtitle}</p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

