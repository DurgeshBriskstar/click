"use client";

import { Container, Row, Col } from "react-bootstrap";

export default function TermsContentSection({ data }) {
  const content = data?.content || null;

  return (
    <section className="section gray-bg">
      <Container>
        <Row>
          <Col lg={12}>
            <div className="terms-content-wrapper">
              {content && (
                <div
                  data-aos="fade-up"
                  data-aos-delay="300"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

