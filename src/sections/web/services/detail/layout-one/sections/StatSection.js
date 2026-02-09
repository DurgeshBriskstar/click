/* eslint-disable @next/next/no-img-element */
// @ts-nocheck
"use client";

import { Container } from "react-bootstrap";
import { getFileFullPath } from "utils/formats";

export default function StatSection({ data }) {
  if (!data) return null;

  return (
    <section className="stat-section-bg">
      {data?.background_image && (<img src={getFileFullPath(data.background_image)} alt="Statistics Background" className="stat-bg-image" />)}

      <Container>
        <div className="stat-section-content">
          {data?.video_link && (
            <div className="stat-video-play" data-aos="zoom-in" suppressHydrationWarning>
              <a href={data.video_link} target="_blank" rel="noopener noreferrer" className="video-play-btn">
                <img src="/images/sections/services/video-icon.svg" alt="video Icon" className="video-icon" />
                <div className="waves wave-1"></div>
                <div className="waves wave-2"></div>
                <div className="waves wave-3"></div>
              </a>
              {data?.title && <p className="m-0 text-white">{data.title}</p>}
            </div>
          )}

          {data?.highlights && data.highlights.length > 0 && (
            <div className="stat-card-wrapper">
              {data.highlights.map((stat, index) => (
                <div className="stat-card" key={index} data-aos="flip-up" data-aos-delay={index * 100} suppressHydrationWarning>
                  {stat?.number && <div className="stat-number">{stat.number}</div>}
                  {stat?.title && <div className="stat-title">{stat.title}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
