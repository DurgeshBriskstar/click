/* eslint-disable @next/next/no-img-element */
"use client";
import { Container, Row, Col, Button } from "react-bootstrap";
import { formatDate, getFileFullPath } from "utils/formats";
import { ROUTES } from "utils/routes";

export default function InsightsSection({ data, blogs }) {
  if (!data) return null;

  const blogData = blogs?.data || [];

  return (
    <section className="section gray-bg">
      <Container>
        <div className="blog-section">
          <div className="text-left">
            <div className="insights-section" data-aos="flip-up">
              <h2 className="insights-section-title">
                {data?.title || ""}
                <img src="/images/icons/title-underline.svg" alt="Title underline" fill="true" className="insights-underline" />
              </h2>
            </div>
          </div>
          <Button href={data?.buttonLink} variant="primary" className="btn-click">
            <span>{data?.buttonText}</span>
            <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="35" height="35" rx="17.5" fill="#F58027" />
              <path d="M13.5 21.5L21.5 13.5M21.5 13.5H14.3M21.5 13.5V20.7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
        </div>
        <Row className="justify-content-center">
          {blogData?.length > 0
            && blogData?.map((blog, index) => {
              const isFirstCard = index === 0;

              const imageNumber = String(index + 1).padStart(2, "0");
              const imagePath = blog?.image ? blog?.image.startsWith("/") ? getFileFullPath(blog?.image) : `/images/sections/blog/blog-${imageNumber}.jpg` : `/images/sections/blog/blog-${imageNumber}.jpg`;

              return (
                <Col xs={12} md={6} lg={4} key={blog?.id} data-aos="flip-right" data-aos-delay={index * 150}>
                  <div className="blog-item">
                    <div className="blog-item-img">
                      {
                        imagePath
                          ? (<img src={imagePath} alt={blog?.title} style={{ objectFit: "cover" }} />)
                          : (
                            <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-primary-custom" style={{ color: "#FFFFFF" }}>
                              Blog Image
                            </div>
                          )
                      }
                      <div className="blog-date">
                        <span className="date-dot"></span>
                        <span>{blog?.created_at ? formatDate(blog?.created_at) : ""}</span>
                      </div>
                    </div>
                    <div className="blog-item-content">
                      <h4>{blog?.title}</h4>
                      <div className="d-flex align-items-center gap-2">
                        <Button href={blog?.slug ? `${ROUTES?.BLOGS}/${blog?.slug}` : ""} variant="primary" className="btn">
                          Read More
                          <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="35" height="35" rx="17.5" fill="var(--text-primary)" />
                            <path d="M13.5 21.5L21.5 13.5M21.5 13.5H14.3M21.5 13.5V20.7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Col>
              );
            })}
        </Row>
      </Container>
    </section>
  );
}
