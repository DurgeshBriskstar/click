"use client";

import { Container } from "react-bootstrap";

export default function StoreIntroductionSection({ data }) {
  if (!data) return null;

  return (
    <section className="section shape-layer">
      <Container>
        <div className="store-introduction-content" data-aos="fade-up">
          {data?.title && (
            <div className="insights-section">
              <h2 className="insights-section-title">
                {data.title}
                <img src="/images/icons/title-underline.svg" alt="Title underline" fill="true" className="insights-underline" />
              </h2>
            </div>
          )}
          {data?.subtitle && (
            <p className="store-introduction-subtitle" data-aos="fade-up" data-aos-delay="200">
              {data.subtitle}
            </p>
          )}
          {data?.description && (
            <div className="store-introduction-description" data-aos="fade-up" data-aos-delay="300">
              <span className="store-introduction-description-subtitle">Frustrated with Dropbox or other file-sharing packages? Try the Click IT Managed File Management & Sharing Solution!</span>
              <p className="m-0">{data.description}</p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

