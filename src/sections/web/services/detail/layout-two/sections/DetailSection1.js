/* eslint-disable @next/next/no-img-element */
"use client";

import { Container } from "react-bootstrap";
import { getFileFullPath } from "utils/formats";

export default function DetailSection1({ data }) {
  if (!data) return null;

  return (
    <section className="section pb-0 shape-top-bg">
      <Container>
        <div className="click-it-band-section">
          <div className="click-it-band-section-content" data-aos="fade-right">
            <div className="text-left">
              <div className="insights-section" data-aos="fade-up">
                <h2 className="insights-section-title">
                  {data.title}
                  <img src="/images/icons/title-underline.svg" alt="Title underline" fill="true" className="insights-underline" />
                </h2>
              </div>
              {data?.description && (<p className="m-0" data-aos="fade-up" data-aos-delay="200">{data.description}</p>)}
            </div>
          </div>
          <div className="click-it-band-section-image" data-aos="fade-up">
            {data?.image1 && (
              <div className="click-it-band-section-img">
                <img src={getFileFullPath(data.image1)} alt={data?.title || "Service Detail"} />
              </div>
            )}
          </div>
        </div>

        <div className="click-it-wrapper">
          <div className="click-it-image-band" data-aos="fade-right">
            {data?.image2 && (
              <div className="Backup-management-img">
                <img src={getFileFullPath(data.image2)} alt={data?.second_title || "Service Detail"} />
              </div>
            )}
          </div>
          <div className="click-it-image-content" data-aos="fade-up">
            {data?.second_title && (<h3 className="mb-4">{data.second_title}</h3>)}

            {data?.highlights && data.highlights.length > 0 && (
              <ul className="points-list black-text m-0">
                {data.highlights.map((highlight, index) => (
                  <li key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                    <img src="/images/icons/right.svg" alt="" fill="true" />
                    <span>{highlight?.value || highlight?.title}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

