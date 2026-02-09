"use client";

import { Container, Row, Col } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "utils/routes";
import { formatPhoneNumber, SOCIAL_CONFIG } from "utils/formats";

export default function AllStoresSection({ data }) {
  if (!data || !data.length) return null;
  const stores = data || [];

  return (
    <section className="section ">
      <Container>
        <div className="all-stores-section">
          <div className="all-stores-header" data-aos="fade-up">
            <h2 className="all-stores-title">All Stores</h2>
          </div>

          <Row className="all-stores-grid">
            {
              stores?.length > 0 &&
              stores?.map((store, index) => (
                <Col lg={4} md={6} key={store?.id || index}>
                  <div className="store-card" data-aos="fade-up" data-aos-delay={index * 100}>
                    <div className="store-card-name">{store?.store_name}</div>
                    <div className="store-card-info">
                      {
                        store?.contact_us?.store_address &&
                        <div className="store-card-item">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <mask id="mask0" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20" style={{ maskType: "luminance" }}>
                              <path d="M0 0H20V20H0V0Z" fill="white" />
                            </mask>
                            <g mask="url(#mask0)">
                              <path d="M9.9984 19.3359C9.9984 19.3359 17.7741 14.7768 17.7741 8.36168C17.7741 4.06727 14.2928 0.585938 9.9984 0.585938C5.70398 0.585938 2.22266 4.06727 2.22266 8.36168C2.22266 14.7768 9.9984 19.3359 9.9984 19.3359Z" stroke="black" strokeWidth="2" strokeMiterlimit="10" />
                              <path d="M12.8274 8.24059C12.8274 9.8023 11.5614 11.0684 9.99965 11.0684C8.43789 11.0684 7.17188 9.8023 7.17188 8.24059C7.17188 6.67887 8.43789 5.41281 9.99965 5.41281C11.5614 5.41281 12.8274 6.67887 12.8274 8.24059Z" stroke="black" strokeWidth="2" strokeMiterlimit="10" />
                            </g>
                          </svg>
                          <span>{store?.contact_us?.store_address}</span>
                        </div>
                      }
                      {
                        store?.contact_us?.store_phone &&
                        <div className="store-card-item">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.6794 14.52C17.2495 13.9316 16.6036 13.5379 15.8836 13.4254C15.1636 13.3129 14.4284 13.4908 13.8394 13.92L12.7094 14.74C11.084 13.2692 9.7801 11.4784 8.87942 9.47997L9.99942 8.65997C10.59 8.2297 10.9859 7.58279 11.1003 6.86106C11.2146 6.13934 11.0381 5.40173 10.6094 4.80997L9.44942 3.19997C9.24012 2.9059 8.97378 2.65697 8.66626 2.46799C8.35874 2.27901 8.01633 2.15385 7.65942 2.09997C6.95436 1.99598 6.23657 2.17183 5.65942 2.58997L3.87942 3.84997C3.31399 4.25804 2.87391 4.81606 2.60885 5.46103C2.34379 6.106 2.26433 6.81222 2.37942 7.49997C2.88752 10.4611 4.0723 13.265 5.84148 15.6933C7.61067 18.1216 9.91651 20.1087 12.5794 21.5C13.1147 21.775 13.7076 21.9189 14.3094 21.92C15.101 21.9222 15.8723 21.6697 16.5094 21.2L18.2494 20C18.8394 19.5715 19.2351 18.9263 19.3494 18.2063C19.4638 17.4862 19.2876 16.7501 18.8594 16.16L17.6794 14.52ZM17.3694 18.77L15.6294 20C15.2911 20.2452 14.8915 20.3918 14.4749 20.4236C14.0583 20.4554 13.641 20.3711 13.2694 20.18C10.8022 18.8886 8.66828 17.0425 7.03545 14.7867C5.40263 12.5309 4.31544 9.92709 3.85942 7.17997C3.78989 6.7673 3.83735 6.34341 3.99642 5.95634C4.15549 5.56926 4.41981 5.23449 4.75942 4.98997L6.48942 3.79997C6.7061 3.64688 6.96415 3.56319 7.22942 3.55997H7.41942C7.58232 3.58513 7.73863 3.64226 7.87936 3.72807C8.02009 3.81388 8.14246 3.92668 8.23942 4.05997L9.41942 5.69997C9.61204 5.96817 9.6907 6.3017 9.63824 6.62771C9.58578 6.95372 9.40646 7.24573 9.13942 7.43997L7.51942 8.61997C7.38433 8.71907 7.28631 8.86056 7.241 9.02187C7.19569 9.18318 7.20569 9.35501 7.26942 9.50997C8.32778 12.1314 10.0138 14.4527 12.1794 16.27C12.3103 16.3738 12.4724 16.4303 12.6394 16.4303C12.8065 16.4303 12.9686 16.3738 13.0994 16.27L14.7194 15.1C14.8526 15.003 15.0035 14.9334 15.1637 14.895C15.3238 14.8566 15.49 14.8502 15.6526 14.8762C15.8152 14.9022 15.9711 14.9601 16.1113 15.0466C16.2515 15.133 16.3732 15.2463 16.4694 15.38L17.6394 17C17.7387 17.1336 17.8105 17.2856 17.8507 17.4472C17.8909 17.6088 17.8986 17.7767 17.8735 17.9413C17.8484 18.1059 17.7909 18.2638 17.7044 18.4061C17.6179 18.5483 17.504 18.672 17.3694 18.77ZM13.0894 5.90997C13.1223 5.81259 13.1752 5.72315 13.2446 5.64732C13.3139 5.57149 13.3984 5.51095 13.4924 5.46956C13.5865 5.42816 13.6882 5.40682 13.791 5.40689C13.8938 5.40696 13.9954 5.42844 14.0894 5.46997C15.2292 5.89144 16.218 6.64217 16.9302 7.6268C17.6424 8.61143 18.0459 9.78553 18.0894 11C18.0948 11.1972 18.0223 11.3887 17.8875 11.5328C17.7528 11.6769 17.5666 11.7621 17.3694 11.77C17.1756 11.7701 16.9892 11.6952 16.8494 11.561C16.7096 11.4268 16.6272 11.2436 16.6194 11.05C16.5875 10.135 16.2857 9.24987 15.7519 8.50607C15.218 7.76226 14.4761 7.19301 13.6194 6.86997C13.5197 6.84487 13.4262 6.79954 13.3447 6.73677C13.2632 6.67401 13.1955 6.59516 13.1458 6.50512C13.0961 6.41509 13.0655 6.31579 13.0558 6.21341C13.0461 6.11102 13.0575 6.00774 13.0894 5.90997ZM21.6694 10.81C21.6862 11.0085 21.6243 11.2057 21.4971 11.359C21.37 11.5124 21.1876 11.6097 20.9894 11.63H20.9194C20.7327 11.6285 20.553 11.5584 20.4147 11.433C20.2764 11.3076 20.1891 11.1357 20.1694 10.95C20.0245 9.33153 19.4441 7.78253 18.4898 6.46734C17.5356 5.15215 16.243 4.11984 14.7494 3.47997C14.5664 3.40173 14.422 3.254 14.3479 3.06927C14.2738 2.88455 14.2762 2.67797 14.3544 2.49497C14.4327 2.31197 14.5804 2.16754 14.7651 2.09347C14.9498 2.01939 15.1564 2.02173 15.3394 2.09997C17.0857 2.84059 18.5974 4.04255 19.7126 5.57696C20.8277 7.11137 21.5042 8.92036 21.6694 10.81Z" fill="black" />
                          </svg>
                          <span>{store?.contact_us?.store_phone ? formatPhoneNumber(store?.contact_us?.store_phone) : ""}</span>
                        </div>
                      }
                      {
                        store?.contact_us?.store_hours &&
                        <div className="store-card-item">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0)">
                              <path d="M13.5643 11.7659L10.7758 9.67449V5.41426C10.7758 4.9859 10.4295 4.63965 10.0012 4.63965C9.57281 4.63965 9.22656 4.9859 9.22656 5.41426V10.0618C9.22656 10.3058 9.34121 10.5359 9.53641 10.6815L12.6348 13.0053C12.7742 13.1099 12.9369 13.1602 13.0987 13.1602C13.335 13.1602 13.5674 13.0541 13.7192 12.8496C13.9764 12.508 13.9067 12.0223 13.5643 11.7659Z" fill="black" />
                              <path d="M10 0C4.48566 0 0 4.48566 0 10C0 15.5143 4.48566 20 10 20C15.5143 20 20 15.5143 20 10C20 4.48566 15.5143 0 10 0ZM10 18.4508C5.34082 18.4508 1.54918 14.6592 1.54918 10C1.54918 5.34082 5.34082 1.54918 10 1.54918C14.66 1.54918 18.4508 5.34082 18.4508 10C18.4508 14.6592 14.6592 18.4508 10 18.4508Z" fill="black" />
                            </g>
                            <defs><clipPath id="clip0"><rect width="20" height="20" fill="white" /></clipPath></defs>
                          </svg>
                          <span>{store?.contact_us?.store_hours || ""}</span>
                        </div>
                      }
                      {store?.social_links &&
                        Object.entries(store.social_links).length > 0 && (
                          <div className="social-links store-social-links">
                            {Object.entries(store.social_links).map(([key, value]) => {
                              if (!value || !SOCIAL_CONFIG[key]) return null;

                              const { icon, alt, isEmail } = SOCIAL_CONFIG[key];
                              const href = isEmail ? `mailto:${value}` : value;

                              return (
                                <a key={key} href={href} className="social-icon-btn" target="_blank" rel="noopener noreferrer">
                                  <Image src={icon} alt={alt} width={20} height={20} />
                                </a>
                              );
                            })}
                          </div>
                        )}
                    </div>

                    <Link href={store?.store_slug ? `${ROUTES?.STORES}/${store?.store_slug}` : "#"} className="btn">
                      View Store
                      <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="35" height="35" rx="17.5" fill="var(--text-primary)" />
                        <path d="M13.5 21.5L21.5 13.5M21.5 13.5H14.3M21.5 13.5V20.7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </div>
                </Col>
              ))}
          </Row>
        </div>
      </Container>
    </section >
  );
}

