"use client";

import { useState, useMemo } from "react";
import ClientIframe from "components/custom/common/ClientIframe";
import { Container, Form } from "react-bootstrap";
import { formatPhoneNumber } from "utils/formats";

export default function ContactMainSection({ stores = [] }) {
  const primaryStore = useMemo(() => {
    return stores.find(store => store.is_primary_store) || stores[0] || null;
  }, [stores]);

  const [selectedStoreId, setSelectedStoreId] = useState(primaryStore?.id || "");

  const selectedStore = useMemo(() => {
    if (!selectedStoreId) return primaryStore;
    return stores.find(store => store.id === Number(selectedStoreId)) || primaryStore;
  }, [selectedStoreId, stores, primaryStore]);

  if (!stores?.length) return null;

  const contactInfo = selectedStore?.contact_us || {};
  const contactSettings = selectedStore?.settings || {};

  const iframe = contactSettings?.contact_form_iframe || "Store contact form not found!";

  const handleStoreChange = (e) => {
    setSelectedStoreId(e.target.value);
  };

  return (
    <section className="section gray-bg">
      <Container>
        <div className="contact-info-wrapper">
          <div className="contact-info-content">
            {/* Store Selection Dropdown */}
            {stores.length > 1 && (
              <div className="store-selector mb-4">
                <label htmlFor="store-select" className="store-selector-label mb-2 d-block">
                  Select a Store Location
                </label>
                <Form.Select id="store-select" className="store-select-dropdown" value={selectedStoreId} onChange={handleStoreChange}>
                  {stores.map((store) => (<option key={store.id} value={store.id}>{store.store_name} {store.is_primary_store ? "(Headquarter)" : ""}</option>))}
                </Form.Select>
              </div>
            )}
            <div className="insights-section">
              <h2 className="insights-section-title mb-0">
                {contactInfo?.title || ""}
                <img src="/images/icons/title-underline.svg" alt="Title underline" fill="true" className="insights-underline" />
              </h2>
            </div>

            <p className="contact-info-description mb-0">
              {contactInfo?.subtitle || ""}
            </p>
            <hr style={{ borderColor: "#78829D", opacity: 0.2, margin: "40px 0", padding: "0" }} />

            <div className="contact-details pt-0">
              {/* Address */}
              {contactInfo?.store_address && (
                <div className="contact-detail-item">
                  <div className="d-flex align-items-start">
                    <div className="contact-icon-wrapper me-4">
                      <img src="/images/icons/contact-address.svg" alt="Address" width={55} height={55} />
                    </div>
                    <div className="contact-detail-content">
                      <h5 className="contact-detail-title mb-2">Our Address</h5>
                      <p className="mb-1 contact-detail-text">{contactInfo.store_address}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Phone */}
              {contactInfo?.store_phone && (
                <div className="contact-detail-item">
                  <div className="d-flex align-items-start">
                    <div className="contact-icon-wrapper me-4">
                      <img src="/images/icons/contact-call.svg" alt="Phone" width={55} height={55} />
                    </div>
                    <div className="contact-detail-content">
                      <h5 className="contact-detail-title mb-2">Call Us Anytime</h5>
                      <a href={`tel:${contactInfo.store_phone.replace(/\s/g, '')}`} className="contact-detail-text text-decoration-none d-inline-block">
                        {formatPhoneNumber(contactInfo.store_phone)}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Email */}
              {contactInfo?.store_email && (
                <div className="contact-detail-item">
                  <div className="d-flex align-items-start">
                    <div className="contact-icon-wrapper me-4">
                      <img src="/images/icons/contact-email.svg" alt="Email" width={55} height={55} />
                    </div>
                    <div className="contact-detail-content">
                      <h5 className="contact-detail-title mb-2">Send E-Mail</h5>
                      <a href={`mailto:${contactInfo.store_email}`} className="contact-detail-text text-decoration-none d-inline-block">
                        {contactInfo.store_email}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Business Hours */}
              {contactInfo?.store_hours && (
                <div className="contact-detail-item">
                  <div className="d-flex align-items-start">
                    <div className="contact-icon-wrapper store-contact-icon me-4">
                      <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.5 28C21.943 28 28 21.943 28 14.5C28 7.05701 21.9431 1 14.5 1C7.05694 1 1 7.05701 1 14.5C1 21.943 7.05701 28 14.5 28ZM14.5 2.79997C20.953 2.79997 26.2 8.04695 26.2 14.5C26.2 20.953 20.953 26.2 14.5 26.2C8.04695 26.2 2.79997 20.953 2.79997 14.5C2.79997 8.04695 8.04703 2.79997 14.5 2.79997Z" fill="white" />
                        <path d="M18.4352 18.8004C18.6017 18.9354 18.7996 18.9985 18.9976 18.9985C19.2631 18.9985 19.5241 18.8814 19.6996 18.661C20.0101 18.2739 19.9471 17.7069 19.5601 17.3964L15.3976 14.0664V7.29842C15.3976 6.80342 14.9926 6.39844 14.4976 6.39844C14.0026 6.39844 13.5977 6.80342 13.5977 7.29842V14.4985C13.5977 14.773 13.7237 15.0295 13.9352 15.2004L18.4352 18.8004Z" fill="white" />
                      </svg>
                    </div>
                    <div className="contact-detail-content">
                      <h5 className="contact-detail-title mb-2">Business Hours</h5>
                      <p className="mb-1 contact-detail-text">{contactInfo.store_hours}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="contact-form-wrapper">
            <h3 className="contact-form-title">
              Let's Contact With Us
            </h3>

            <div className="contact-form">
              <ClientIframe html={iframe} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

