"use client";

import { Container, Row, Col } from "react-bootstrap";
import Image from "next/image";
import { getFileFullPath } from "utils/formats";

export default function MeetManagerSection({ data }) {
  if (!data) return null;

  return (
    <section className="section">
      <Container>
        <div className="meet-manager-content">
          <div data-aos="fade-right" data-aos-delay="200">
            {data?.title && (
              <div className="text-left" data-aos="fade-up">
                <div className="insights-section">
                  <h2 className="insights-section-title">
                    {data.title}
                    <img src="/images/icons/title-underline.svg" alt="Title underline" fill="true" className="insights-underline" />
                  </h2>
                </div>
              </div>
            )}
            <div className="manager-bio">
              {data?.short_intro && (
                <div className="manager-description">
                  {data.short_intro.split("\n").map((paragraph, index) => (
                    <p className="m-0" key={index}>{paragraph}</p>
                  ))}
                </div>
              )}
              {data?.name && (
                <div className="manager-title">
                  <div className="manager-name">{data.name}</div>
                  <p className="mb-0">{data.designation}</p>
                </div>
              )}
            </div>
          </div>
          <div data-aos="fade-left" data-aos-delay="300">
            {data?.background_image && (
              <div className="manager-image-wrapper">
                {data.background_image?.startsWith("/backend-assets") ? (
                  <img
                    src={getFileFullPath(data.background_image)}
                    alt={data.name || "Store Manager"}
                    className="manager-image"
                    style={{ objectFit: "cover", width: "100%", height: "auto" }}
                  />
                ) : (
                  <Image
                    src={data.background_image}
                    alt={data.name || "Store Manager"}
                    width={500}
                    height={600}
                    className="manager-image"
                    style={{ objectFit: "cover" }}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

