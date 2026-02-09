"use client";

import { Container, Row, Col, Button } from "react-bootstrap";
import { getFileFullPath } from "utils/formats";

export default function FranchiseSection({ data }) {
  if (!data) return null;

  return (
    <section className="section faq-bg">
      <Container>
        <Row className="align-items-center justify-content-center">
          <Col xs={12} md={12} lg={6} data-aos="fade-right">
            <div className="text-left">
              <div className="insights-section">
                <h2 className="insights-section-title">
                  {data?.title}
                  <img src="/images/icons/title-underline.svg" alt={data?.title} fill="true" className="insights-underline" />
                </h2>
              </div>
              <p className="m-0">
                {data?.subtitle}
              </p>
            </div>
            <ul className="points-list black-text">
              {data?.highlights?.length > 0 && data?.highlights?.map((highlight, index) => (
                <li key={index} data-aos="fade-right" data-aos-delay={200 + (index * 150)}>
                  <img src="/images/icons/right.svg" alt="" fill="true" />
                  <span className="fw-medium">{highlight?.value}</span>
                </li>
              ))}
            </ul>
            <div className="franchise-button-container">
              <Button href={data?.buttonLink} className="btn-click d-inline-flex">
                {data?.buttonText}
                <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="35" height="35" rx="17.5" fill="#F58027" />
                  <path d="M13.5 21.5L21.5 13.5M21.5 13.5H14.3M21.5 13.5V20.7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Button>
            </div>
          </Col>

          <Col xs={12} md={6} data-aos="fade-left">
            <div className="faq-image">
              <div className="faq-image-container">
                <span className="faq-image-container-img">
                  <img src={getFileFullPath(data?.background_image)} alt="faq" fill="true" className="" />
                </span>

              </div>
              <a href="#" className="faq-image-container-btn" target="_blank" rel="noopener noreferrer">
                <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="35" height="35" rx="17.5" fill="#F58027" />
                  <path d="M13.5 21.5L21.5 13.5M21.5 13.5H14.3M21.5 13.5V20.7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <div className="right-side-dark-bg" style={{ backgroundImage: `url('/images/sections/faq/dark-bg.png ')` }}>
                <div className="faq-content">
                  <span>{data?.second_title}</span>
                  <img src="/images/sections/faq/faq-arrow.svg" alt="faq-arrow" fill="true" className="" />
                  <b>{data?.second_subtitle}</b>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
