"use client";

import { Container, Row, Col, Button } from "react-bootstrap";

export default function QuickTrustedSection({ data }) {
  if (!data) return null;

  return (
    <section className="quick-bg-image">
      <Container>
        <div className="quick-band">
          <h2 className="text-white m-0" data-aos="fade-up">{data?.title}</h2>
          <p className="text-white m-0" data-aos="fade-up" data-aos-delay="200">{data?.subtitle}</p>
          <Button href={data?.buttonLink} className="btn-click" data-aos="fade-up" data-aos-delay="400">
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
