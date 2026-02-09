"use client";

import ClientIframe from "components/custom/common/ClientIframe";
import { Container } from "react-bootstrap";

export default function TestimonialsSection({ data }) {
  if (!data) return null;

  return (
    <section className="testimonials-section testimonial-bg">
      <Container>
        <div className="testimonials-header">
          <div className="header-left">
            <div className="insights-section" data-aos="fade-up">
              <h2 className="insights-section-title">
                {data.title}
                <img src="/images/icons/title-underline.svg" alt="Title underline" fill="true" className="insights-underline" />
              </h2>
            </div>
            <p className="m-0" data-aos="fade-up" data-aos-delay="200">{data.subtitle}</p>
          </div>

          <div className="header-right" data-aos="fade-up" data-aos-delay="200">
            <div className="happy-customers">
              <div className="stars-rating">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="star">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.6277 0.398422L11.8641 5.15193C11.9123 5.25664 11.9855 5.34788 12.0773 5.41758C12.169 5.48728 12.2765 5.53331 12.3902 5.55161L17.402 6.31686C17.5325 6.34079 17.6539 6.39987 17.7534 6.48773C17.8528 6.5756 17.9264 6.68893 17.9663 6.81553C18.0061 6.94213 18.0108 7.07722 17.9796 7.20626C17.9485 7.33529 17.8828 7.4534 17.7897 7.54787L14.1506 11.2718C14.0703 11.3557 14.0107 11.4572 13.9765 11.5682C13.9423 11.6792 13.9344 11.7967 13.9536 11.9113L14.8056 17.1604C14.8311 17.2907 14.8192 17.4256 14.7713 17.5495C14.7235 17.6734 14.6416 17.7812 14.5352 17.8605C14.4288 17.9398 14.3021 17.9874 14.1698 17.9978C14.0375 18.0082 13.905 17.981 13.7875 17.9193L9.32312 15.4551C9.22249 15.399 9.10922 15.3696 8.99404 15.3696C8.87886 15.3696 8.76559 15.399 8.66496 15.4551L4.2006 17.9193C4.0831 17.981 3.95057 18.0082 3.81827 17.9978C3.68598 17.9874 3.55931 17.9398 3.45289 17.8605C3.34646 17.7812 3.2646 17.6734 3.21676 17.5495C3.16892 17.4256 3.15703 17.2907 3.18248 17.1604L4.03446 11.9113C4.0535 11.7966 4.04551 11.6791 4.01112 11.5681C3.97673 11.457 3.91689 11.3556 3.83638 11.2718L0.209075 7.54787C0.116247 7.45318 0.0509092 7.335 0.0200609 7.20599C-0.0107875 7.07698 -0.00598393 6.942 0.0339568 6.81551C0.0738976 6.68902 0.14747 6.57579 0.246794 6.48795C0.346117 6.40011 0.467449 6.34097 0.59779 6.31686L5.60956 5.55161C5.72443 5.5343 5.83322 5.48872 5.92615 5.41896C6.01909 5.34921 6.09327 5.25745 6.14204 5.15193L8.37849 0.398422C8.43389 0.279385 8.5221 0.178654 8.63275 0.108074C8.7434 0.0374945 8.87188 0 9.00309 0C9.13431 0 9.26279 0.0374945 9.37344 0.108074C9.48409 0.178654 9.5723 0.279385 9.6277 0.398422Z" fill="#F0C419" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
            <div className="customers-info">
              <div className="customers-text">
                <span className="happy-text">Happy Customers</span>
              </div>
            </div>
          </div>
        </div>

        {data?.iframe && (
          <div className="testimonials-body"><ClientIframe html={data?.iframe} /></div>
        )}
      </Container>
    </section>
  );
}
