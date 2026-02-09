/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Container, Accordion } from "react-bootstrap";

export default function FAQSection({ data, faqs, isStore = true, serviceId = null }) {
  const [expandedKey, setExpandedKey] = useState(0);

  if (!data) return null;
  const faqData = faqs?.data || [];

  let filteredFaqData = isStore ? faqData?.filter(faq => faq?.show_on_stores) : [];
  if (serviceId) {
    filteredFaqData = faqData?.filter(faq => faq?.service_id === parseInt(serviceId));
  }

  if (!filteredFaqData?.length) return null;

  return (
    <section className="section faq-shape-bg">
      <Container>
        <div className="text-left">
          <div className="insights-section" data-aos="fade-up">
            <h2 className="insights-section-title">
              {data?.title}
              <img src="/images/icons/title-underline.svg" alt="Title underline" fill="true" className="insights-underline" />
            </h2>
          </div>
        </div>

        <Accordion activeKey={expandedKey} onSelect={(key) => setExpandedKey(key)}>
          {
            filteredFaqData?.length > 0 &&
            filteredFaqData?.map((faq, index) => (
              <Accordion.Item key={index} eventKey={index} className="" data-aos="fade-up" data-aos-delay={index * 150}>
                <Accordion.Header>
                  <span className="fw-medium">{faq?.question}</span>
                  <div className="arrow-bottom">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 1L1 15ZM1 15L13.6 15ZM1 15L1 2.4Z" fill="white" />
                      <path d="M15 1L1 15M1 15L13.6 15M1 15L1 2.4" stroke="#CBCBCB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <p className="mb-0">{faq?.answer}</p>
                </Accordion.Body>
              </Accordion.Item>
            ))}
        </Accordion>
      </Container>
    </section>
  );
}
