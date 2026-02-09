"use client";

import { Container, Button } from "react-bootstrap";

export default function TrustedPartnerSection({ data }) {
  if (!data) return null;

  return (
    <section className="section pt-0">
      <Container>
        <div className="trusted-section">
          <div className="trusted-title" data-aos="fade-up">
            <h3>{data?.title}</h3>
            <div className="sub-title">
              <p className="m-0">{data?.subtitle}</p>
            </div>
          </div>
          <Button href={data?.buttonLink || "#"} className="btn-click" data-aos="fade-up" data-aos-delay="200">
            {data?.buttonText}
            <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="35" height="35" rx="17.5" fill="#F58027" />
              <path d="M13.5 21.5L21.5 13.5M21.5 13.5H14.3M21.5 13.5V20.7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
        </div>
      </Container>
    </section>
  );
}
