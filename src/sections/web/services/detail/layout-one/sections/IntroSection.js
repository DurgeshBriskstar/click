/* eslint-disable @next/next/no-img-element */
"use client";

import { Container, Button } from "react-bootstrap";
import { getFileFullPath } from "utils/formats";

export default function IntroSection({ data }) {
  if (!data) return null;

  return (
    <section className="section shape-top-white-bg">
      <Container>
        <div className="intro-wrapper">
          <div className="insights-section" data-aos="fade-up" suppressHydrationWarning>
            <h2 className="insights-section-title">
              {data?.title}
              <img src="/images/icons/title-underline.svg" alt="Title underline" fill="true" className="insights-underline" />
            </h2>
          </div>
          {data?.description && (
            <p className="m-0" data-aos="fade-up" data-aos-delay="200" suppressHydrationWarning>{data.description}</p>
          )}
        </div>

        <div className="intro-band">
          {/* Left Column */}
          {data?.leftTitle && (
            <div className="intro-first" data-aos="fade-right" suppressHydrationWarning>
              <div className="intro-left-content">
                <h3 className="m-0">{data.leftTitle}</h3>
                {data?.leftDescription && (
                  <p className="m-0">{data.leftDescription}</p>
                )}
                {data?.buttonText && (
                  <Button href={data?.buttonLink || "#"} className="btn-click">
                    {data.buttonText}
                    <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="35" height="35" rx="17.5" fill="#F58027" />
                      <path d="M13.5 21.5L21.5 13.5M21.5 13.5H14.3M21.5 13.5V20.7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Center Image */}
          {data?.background_image && (
            <div className="intro-second" data-aos="zoom-in" suppressHydrationWarning>
              <div className="intro-center-image">
                <img src={getFileFullPath(data.background_image)} alt={data?.title || "Service Introduction"} />
              </div>
            </div>
          )}

          {/* Right Column */}
          {data?.rightTitle && (
            <div className="intro-third" data-aos="fade-left" suppressHydrationWarning>
              <div className="intro-right-content">
                <h3 className="mb-3">{data.rightTitle}</h3>
                {(data?.buttonText && data?.buttonLink) && (
                  <Button href={data?.buttonLink || "#"} className="white-click">
                    {data.buttonText}
                    <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="35" height="35" rx="17.5" fill="#F58027" />
                      <path d="M13.5 21.5L21.5 13.5M21.5 13.5H14.3M21.5 13.5V20.7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

