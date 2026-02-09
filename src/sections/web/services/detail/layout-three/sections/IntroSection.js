/* eslint-disable @next/next/no-img-element */
"use client";

import { Container } from "react-bootstrap";
import { getFileFullPath } from "utils/formats";

export default function IntroSection({ data }) {
  if (!data) return null;

  return (
    <section className="section shape-top-bg">
      <Container>
        <div className="text-center">
          <div className="insights-section" data-aos="fade-up">
            <h2 className="insights-section-title">
              {data?.title}
              <img src="/images/icons/title-underline.svg" alt="Title underline" fill="true" className="insights-underline" />
            </h2>
          </div>
          {data?.subtitle && (<p className="management-content" data-aos="fade-up" data-aos-delay="200">{data.subtitle}</p>)}
        </div>

        {data?.cardTitle || data?.background_image || (data?.highlights && data.highlights.length > 0) ? (
          <div className="file-management-wrapper">
            <div className="file-management-bg">
              {data?.background_image && (
                <div className="file-management-img">
                  <img src={getFileFullPath(data.background_image)} alt={data?.cardTitle || "Service Image"} />
                </div>
              )}
            </div>
            <div className="file-management-content">
              {data?.cardTitle && (<h3 className="mb-4" data-aos="fade-left">{data.cardTitle}</h3>)}

              {data?.highlights && data.highlights.length > 0 && (
                <ul className="points-list">
                  {data.highlights.map((highlight, index) => (
                    <li key={index} data-aos="fade-left" data-aos-delay={200 + (index * 100)}>
                      <img src="/images/icons/right.svg" alt="" fill="true" />
                      <span>{highlight?.value || highlight?.title}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : null}
      </Container>
    </section>
  );
}

