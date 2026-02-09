"use client";

import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";
import { formatPhoneNumber, SOCIAL_CONFIG, getFileFullPath } from "utils/formats";

export default function StoreInfoSection({ data, store }) {
  if (!data || !store) return null;

  return (
    <section className="section">
      <Container>
        <div className="store-info-content">
          <Row>
            <Col lg={6} data-aos="fade-right" data-aos-delay="300">
              <div className="store-contact-details">
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
                <div className="store-contact-details-content">
                  {data?.subtitle && (
                    <p className="m-0" data-aos="fade-up" data-aos-delay="200">
                      {data.subtitle}
                    </p>
                  )}
                  <div className="divider-lines"></div>
                  {(data?.show_address && store?.contact_us?.store_address) && (
                    <div className="store-contact-item">
                      <div className="store-contact-icon">
                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12.5 0C7.65371 0 3.71094 3.94277 3.71094 8.78906C3.71094 10.4265 4.1645 12.0244 5.0229 13.4107L11.9997 24.6538C12.1333 24.8691 12.3688 25 12.622 25C12.624 25 12.6259 25 12.6278 25C12.8833 24.998 13.1192 24.8631 13.2504 24.6439L20.0494 13.292C20.8604 11.935 21.2891 10.3779 21.2891 8.78906C21.2891 3.94277 17.3463 0 12.5 0ZM18.7923 12.5399L12.6109 22.8606L6.26792 12.639C5.55342 11.4851 5.16602 10.1538 5.16602 8.78906C5.16602 4.75049 8.46143 1.45508 12.5 1.45508C16.5386 1.45508 19.8291 4.75049 19.8291 8.78906C19.8291 10.1133 19.4672 11.4105 18.7923 12.5399Z" fill="white" />
                          <path d="M12.5 4.39453C10.0769 4.39453 8.10547 6.36592 8.10547 8.78906C8.10547 11.1967 10.0448 13.1836 12.5 13.1836C14.9855 13.1836 16.8945 11.1703 16.8945 8.78906C16.8945 6.36592 14.9231 4.39453 12.5 4.39453ZM12.5 11.7285C10.8761 11.7285 9.56055 10.4085 9.56055 8.78906C9.56055 7.17363 10.8846 5.84961 12.5 5.84961C14.1154 5.84961 15.4346 7.17363 15.4346 8.78906C15.4346 10.3849 14.1496 11.7285 12.5 11.7285Z" fill="white" />
                        </svg>
                      </div>
                      <div className="store-contact-text">
                        <p className="mb-0 fw-medium">Our Address</p>
                        <p className="mb-0">{store?.contact_us?.store_address}</p>
                      </div>
                    </div>
                  )}
                  {(data?.show_business_hours && store?.contact_us?.store_hours) && (
                    <div className="store-contact-item">
                      <div className="store-contact-icon">
                        <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14.5 28C21.943 28 28 21.943 28 14.5C28 7.05701 21.9431 1 14.5 1C7.05694 1 1 7.05701 1 14.5C1 21.943 7.05701 28 14.5 28ZM14.5 2.79997C20.953 2.79997 26.2 8.04695 26.2 14.5C26.2 20.953 20.953 26.2 14.5 26.2C8.04695 26.2 2.79997 20.953 2.79997 14.5C2.79997 8.04695 8.04703 2.79997 14.5 2.79997Z" fill="white" />
                          <path d="M18.4352 18.8004C18.6017 18.9354 18.7996 18.9985 18.9976 18.9985C19.2631 18.9985 19.5241 18.8814 19.6996 18.661C20.0101 18.2739 19.9471 17.7069 19.5601 17.3964L15.3976 14.0664V7.29842C15.3976 6.80342 14.9926 6.39844 14.4976 6.39844C14.0026 6.39844 13.5977 6.80342 13.5977 7.29842V14.4985C13.5977 14.773 13.7237 15.0295 13.9352 15.2004L18.4352 18.8004Z" fill="white" />
                        </svg>
                      </div>
                      <div className="store-contact-text">
                        <p className="mb-0 fw-medium">Business Hours</p>
                        <p className="mb-0">{store?.contact_us?.store_hours}</p>
                      </div>
                    </div>
                  )}
                  {(data?.show_email && store?.contact_us?.store_email) && (
                    <div className="store-contact-item">
                      <div className="store-contact-icon">
                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.8027 3.71094H2.19727C0.983252 3.71094 0 4.70029 0 5.9082V19.0918C0 20.3069 0.990479 21.2891 2.19727 21.2891H22.8027C24.0066 21.2891 25 20.311 25 19.0918V5.9082C25 4.70244 24.0207 3.71094 22.8027 3.71094ZM22.495 5.17578C22.0461 5.62231 14.3205 13.3073 14.0537 13.5726C13.6387 13.9876 13.0869 14.2162 12.5 14.2162C11.9131 14.2162 11.3613 13.9876 10.9449 13.5712C10.7655 13.3928 3.12515 5.79268 2.50498 5.17578H22.495ZM1.46484 18.7937V6.20728L7.79482 12.5039L1.46484 18.7937ZM2.50591 19.8242L8.8334 13.537L9.9105 14.6084C10.6022 15.3001 11.5218 15.681 12.5 15.681C13.4782 15.681 14.3978 15.3001 15.0881 14.6098L16.1666 13.537L22.4941 19.8242H2.50591ZM23.5352 18.7937L17.2052 12.5039L23.5352 6.20728V18.7937Z" fill="white" />
                        </svg>

                      </div>
                      <div className="store-contact-text">
                        <p className="mb-0 fw-medium">Send E-Mail</p>
                        <Link href={`mailto:${store?.contact_us?.store_email}`} className="mb-0 text-decoration-none">
                          {store?.contact_us?.store_email}
                        </Link>
                      </div>
                    </div>
                  )}
                  {(data?.show_social_links && store?.social_links) && (
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
                    )
                  )}
                </div>
              </div>
            </Col>
            <Col lg={6} data-aos="fade-left" data-aos-delay="400">
              <div className="store-contact-card">
                {store?.image && (
                  <div className="store-contact-card-image-wrapper">
                    <div className="store-contact-card-image">
                      <img
                        src={getFileFullPath(store?.image)}
                        alt={store?.store_name || "Store"}
                      />
                    </div>
                  </div>
                )}
                <div className="store-contact-card-overlay">
                  <div className="store-contact-card-content">
                    <div className="store-contact-card-icon">
                      <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M33.2111 26.0176C32.3499 25.1222 31.3112 24.6435 30.2105 24.6435C29.1185 24.6435 28.0711 25.1134 27.1745 26.0086L24.3691 28.801C24.1383 28.6768 23.9075 28.5616 23.6856 28.4463C23.3661 28.2867 23.0642 28.1361 22.8068 27.9765C20.1791 26.31 17.7912 24.1382 15.5008 21.3283C14.3912 19.9277 13.6454 18.7487 13.1039 17.5521C13.8319 16.8872 14.5066 16.1957 15.1634 15.5309C15.412 15.2828 15.6606 15.0256 15.9092 14.7774C17.7734 12.9159 17.7734 10.5048 15.9092 8.6433L13.4857 6.22331C13.2104 5.94853 12.9264 5.66486 12.66 5.3812C12.1274 4.8316 11.5681 4.26429 10.9911 3.73242C10.13 2.88144 9.10025 2.42936 8.01722 2.42936C6.9342 2.42936 5.88668 2.88144 4.99894 3.73242L4.98119 3.75016L1.96291 6.79064C0.82661 7.92528 0.178568 9.30812 0.0365306 10.9126C-0.176524 13.501 0.586923 15.9121 1.17282 17.49C2.61095 21.3637 4.75925 24.9538 7.96396 28.801C11.8522 33.437 16.5305 37.0979 21.8747 39.6775C23.9165 40.6438 26.6418 41.7872 29.6867 41.9823C29.8731 41.9911 30.0684 42 30.246 42C32.2966 42 34.0189 41.2642 35.3681 39.8016C35.3771 39.7838 35.3948 39.7751 35.4036 39.7573C35.8652 39.1989 36.398 38.6936 36.9573 38.1528C37.339 37.7894 37.7295 37.4082 38.1113 37.0094C38.9901 36.0962 39.4518 35.0326 39.4518 33.9423C39.4518 32.8431 38.9812 31.7882 38.0846 30.9018L33.2111 26.0176ZM36.389 35.3517C36.3802 35.3517 36.3802 35.3606 36.389 35.3517C36.0428 35.724 35.6878 36.0608 35.3061 36.4332C34.7291 36.9827 34.1431 37.5589 33.5928 38.2061C32.6961 39.1634 31.6397 39.6155 30.2548 39.6155C30.1217 39.6155 29.9797 39.6155 29.8466 39.6067C27.21 39.4381 24.7598 38.4099 22.9222 37.5324C17.8976 35.1035 13.4857 31.6553 9.81932 27.285C6.79216 23.6418 4.76812 20.2734 3.42766 16.6567C2.60207 14.4494 2.30024 12.7298 2.4334 11.1076C2.52218 10.0705 2.92165 9.21062 3.65847 8.47487L6.68563 5.45211C7.12062 5.04436 7.58224 4.82274 8.03498 4.82274C8.59424 4.82274 9.04699 5.1596 9.33107 5.44325L9.35769 5.46985C9.89921 5.97512 10.4141 6.49811 10.9556 7.05657C11.2308 7.34024 11.5149 7.62389 11.799 7.91641L14.2224 10.3364C15.1634 11.276 15.1634 12.1447 14.2224 13.0844C13.965 13.3414 13.7165 13.5986 13.459 13.8467C12.7133 14.609 12.0031 15.3182 11.2308 16.0096C11.2131 16.0273 11.1953 16.0363 11.1864 16.054C10.423 16.8163 10.565 17.5609 10.7248 18.0662L10.7514 18.146C11.3817 19.6706 12.2694 21.1066 13.6188 22.8174L13.6276 22.8263C16.0778 25.8402 18.661 28.1892 21.5107 29.9888C21.8747 30.2193 22.2476 30.4054 22.6026 30.5827C22.9222 30.7422 23.224 30.893 23.4815 31.0524C23.517 31.0702 23.5525 31.0968 23.588 31.1145C23.8898 31.2652 24.174 31.3361 24.4668 31.3361C25.2037 31.3361 25.6653 30.8751 25.8162 30.7244L28.8522 27.6928C29.1541 27.3915 29.6335 27.0281 30.1928 27.0281C30.7431 27.0281 31.1958 27.3738 31.471 27.6751L31.4888 27.6928L36.3802 32.5772C37.2945 33.4814 37.2945 34.412 36.389 35.3517ZM22.7002 9.99069C25.0261 10.3807 27.1389 11.4799 28.8257 13.1641C30.5123 14.8483 31.6042 16.958 32.0036 19.2805C32.1013 19.8656 32.6073 20.2734 33.1844 20.2734C33.2554 20.2734 33.3175 20.2645 33.3885 20.2557C34.0454 20.1492 34.4804 19.5288 34.3739 18.8728C33.8945 16.0628 32.5629 13.501 30.5301 11.471C28.4972 9.44109 25.9316 8.11144 23.1176 7.63275C22.4606 7.52639 21.8481 7.96073 21.7327 8.60784C21.6173 9.25494 22.0433 9.88431 22.7002 9.99069ZM41.9817 18.5271C41.1916 13.8999 39.0079 9.6893 35.6523 6.33855C32.2966 2.98782 28.0799 0.807176 23.4459 0.0182461C22.7979 -0.096991 22.1854 0.346229 22.07 0.993329C21.9635 1.64929 22.3984 2.26094 23.0554 2.37618C27.1922 3.07646 30.965 5.03549 33.9655 8.02279C36.9661 11.019 38.9192 14.7864 39.6204 18.9171C39.718 19.5022 40.2241 19.91 40.8011 19.91C40.8721 19.91 40.9343 19.901 41.0053 19.8923C41.6533 19.7947 42.0971 19.1742 41.9817 18.5271Z" fill="white" />
                      </svg>
                    </div>
                    <img
                      src="/images/sections/stores/down-arrow.png"
                      alt="down-arrow"
                      className="down-arrow-icon"
                    />
                    {
                      (data?.show_phone && store?.contact_us?.store_phone) &&
                      <>
                        <h3>Contact Us</h3>
                        <a className="store-contact-phone" href={`tel:${store?.contact_us?.store_phone.replace(/\s/g, '')}`}>{store?.contact_us?.store_phone ? formatPhoneNumber(store?.contact_us?.store_phone) : ""}</a>
                      </>
                    }
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </section>
  );
}

