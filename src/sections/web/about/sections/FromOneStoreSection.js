/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Image from "next/image";
import { getFileFullPath } from "utils/formats";

export default function FromOneStoreSection({ data }) {
  const [activeTab, setActiveTab] = useState(0);

  if (!data) return null;

  const tabs = data?.highlights || [];
  const activeTabData = tabs[activeTab] || {};

  return (
    <section className="section">
      <Container>
        <div className="about-store-title">
          <h3>{data?.title} </h3>
          <p>{data?.subtitle}</p>
        </div>
        <Row className="about-wrapper-section">
          <Col xs={12} md={12} lg={6} data-aos="fade-right">
            <div className="about-store-content">
              {data?.background_image && (
                <div className="about-store">
                  <img src={getFileFullPath(data?.background_image) || "/"} alt={data?.title || "Store"} />
                </div>
              )}
            </div>
          </Col>
          <Col xs={12} md={12} lg={6} data-aos="fade-left">
            <div>
              {tabs?.length > 0 && (
                <div className="mission-vision-tabs">
                  <div className="insights-section">
                    <h2 className="insights-section-title">
                      {data?.second_title || "Our Mission"}
                      <img src="/images/icons/title-underline.svg" alt="Title underline" className="insights-underline" />
                    </h2>
                  </div>
                  <div className="tab-buttons mb-4">
                    {tabs?.map((tab, index) => (
                      <button key={index} type="button" className={`tab-button ${activeTab === index ? "active" : ""}`} onClick={() => setActiveTab(index)}>
                        {tab?.title}
                      </button>
                    ))}
                  </div>
                  <div className="tab-content">
                    <h4>{activeTabData?.title}</h4>
                    <p className="mb-4">{activeTabData?.description}</p>
                  </div>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

