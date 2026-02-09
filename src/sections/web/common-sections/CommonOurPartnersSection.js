/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import { getFileFullPath } from "utils/formats";

export default function OurPartnersSection({ data, partners }) {
  const sliderRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  const partnerData = partners?.data || [];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider && partnerData && partnerData?.length > 0) {
      let position = 0;
      const speed = 0.8; // Sliding speed
      const logoWidth = 120; // Logo width
      const gap = 135; // Gap between logos
      const itemWidth = logoWidth + gap; // Total width per item
      const singleSetWidth = itemWidth * partnerData.length; // Width of one complete set

      const animate = () => {
        position += speed;
        if (position >= singleSetWidth) {
          position = position - singleSetWidth;
        }
        slider.style.transform = `translateX(-${position}px)`;
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      animate();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [partnerData]);

  if (!data) return null;

  const duplicatedPartners = [...partnerData, ...partnerData];

  return (
    <section className="section">
      <div className="text-center">
        <div className="insights-section" {...(isMounted && { "data-aos": "zoom-out-left" })}>
          <h2 className="insights-section-title">
            {data.title}
            <img
              src="/images/icons/title-underline.svg"
              alt="Title underline"
              fill="true"
              className="insights-underline"
            />
          </h2>
        </div>
        {/* {data.subtitle && (
          <p className="m-0" data-aos="zoom-out-left" data-aos-delay="200">
            {data.subtitle}
          </p>
        )} */}
      </div>
      <Container>
        <div
          style={{
            overflow: "hidden",
            width: "100%",
            position: "relative",
            maxWidth: "100%",
            margin: "0 auto",
          }}
        >
          <div
            ref={sliderRef}
            className="Partners-logo"
            style={{
              display: "flex",
              gap: "135px",
              alignItems: "center",
              justifyContent: "space-between",
              width: "max-content",
              willChange: "transform",
            }}
          >
            {duplicatedPartners.map((partner, index) => (
              <div
                key={`partner-${index}`}
                style={{
                  flexShrink: 0,
                  width: "120px",
                  height: "100px",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={partner?.image ? getFileFullPath(partner?.image) : null}
                  alt={partner?.partner_name}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    width: "auto",
                    height: "auto",
                    objectFit: "contain"
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
