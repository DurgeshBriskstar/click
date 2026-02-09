"use client";

import { useSiteSettings } from "contexts/SiteContext";
import { Button, Container } from "react-bootstrap";
import { formatPhoneNumber, getFileFullPath } from "utils/formats";

export default function TechInGoodHandsSection({ data }) {
  const siteSettings = useSiteSettings();
  if (!data) return null;

  return (
    <section className="tech-hero-section tech-shape-bg">
      <Container>
        <div className="tech-hero-content">
          {/* Left Content */}
          <div className="tech-hero-left">
            <div className="insights-section" data-aos="fade-right">
              <h2 className="insights-section-title">{data?.title}</h2>
              <img src="/images/icons/title-underline.svg" alt="Title underline" fill="true" className="insights-underline" />
            </div>
            <p className="m-0" data-aos="fade-right" data-aos-delay="200">
              {data?.subtitle}
            </p>

            <div className="tech-contact-info">
              <div className="tech-phone-icon">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_1483_7618)"><path d="M20 2.34375C24.0738 2.34539 28.0218 3.75536 31.1751 6.33475C34.3283 8.91415 36.4929 12.5043 37.302 16.497C38.1111 20.4897 37.515 24.6393 35.6147 28.2428C33.7144 31.8463 30.6268 34.682 26.875 36.2695C22.5601 38.0929 17.6975 38.1275 13.3571 36.3657C9.01662 34.6038 5.55383 31.1899 3.73047 26.875C1.90711 22.5601 1.87253 17.6975 3.63435 13.3571C5.39616 9.01662 8.81005 5.55383 13.125 3.73047C15.2999 2.81008 17.6383 2.33841 20 2.34375ZM20 0C8.95469 0 0 8.95469 0 20C0 31.0453 8.95469 40 20 40C31.0453 40 40 31.0453 40 20C40 8.95469 31.0453 0 20 0Z" fill="#0C0E11" /><path d="M25.8354 30.7713C24.6736 30.6932 23.0361 30.2924 21.4377 29.7205C15.8018 27.7033 10.3026 22.3291 9.1338 14.8119C8.92599 13.4736 9.14474 12.251 10.1588 11.2557C10.4986 10.9229 10.801 10.5526 11.133 10.2119C12.383 8.92521 14.2096 8.8924 15.5041 10.1283C15.9143 10.519 16.3315 10.9041 16.7315 11.3072C17.2792 11.8474 17.5963 12.5788 17.6163 13.3478C17.6362 14.1168 17.3575 14.8636 16.8385 15.4315C16.526 15.7783 16.1979 16.108 15.8682 16.4369C15.508 16.7963 15.0604 17.0026 14.5799 17.1526C13.9869 17.3385 13.8768 17.5869 14.1463 18.1533C15.8494 21.7205 18.5153 24.289 22.144 25.8588C22.6291 26.0682 22.8533 25.9736 23.0486 25.4924C23.4768 24.4369 24.2619 23.6674 25.1643 23.0455C26.1854 22.3424 27.6479 22.4986 28.615 23.3299C29.1453 23.7856 29.6519 24.2679 30.133 24.7752C30.6506 25.329 30.9383 26.059 30.9375 26.817C30.9368 27.575 30.6478 28.3044 30.1291 28.8572C29.9783 29.0213 29.8229 29.1815 29.6783 29.3502C28.808 30.3619 27.7041 30.8354 25.8354 30.7713Z" fill="#0C0E11" /></g>
                  <defs><clipPath id="clip0_1483_7618"><rect width="40" height="40" fill="white" /></clipPath></defs>
                </svg>
              </div>
              {
                siteSettings?.phone &&
                <div className="tech-phone-details">
                  <p>Need Help?</p>
                  <a className="tech-phone-number" href={`tel:${siteSettings?.phone.replace(/\s/g, '')}`}>{siteSettings?.phone ? formatPhoneNumber(siteSettings?.phone) : ""}</a>
                </div>
              }

            </div>

            <Button href={data?.buttonLink || "#"} className="btn-click d-inline-flex" data-aos="fade-up" data-aos-delay="200">
              Find A Store
              <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="35" height="35" rx="17.5" fill="#F58027" />
                <path d="M13.5 21.5L21.5 13.5M21.5 13.5H14.3M21.5 13.5V20.7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Button>
          </div>

          {/* Center Image */}
          <div className="tech-hero-center" data-aos="zoom-in" data-aos-delay="400">
            <div className="tech-person-image">
              <img src={getFileFullPath(data?.background_image)} alt="Tech Expert" width="auto" height="auto" />
            </div>
          </div>

          {/* Right Content - Achievements */}
          <div className="tech-hero-right">
            <div className="tech-achievements-header" data-aos="fade-left" data-aos-delay="200">
              <img src="/images/icons/Achivements-icon.svg" alt="Achivements-icon" width="auto" height="auto" />

              <h4 className="tech-achievements-title">Achievements</h4>
            </div>
            <div className="tech-achievement-cards">
              {data?.highlights?.map((highlight, index) => (
                <div key={`tech-${index}`} className="tech-achievement-card" data-aos="fade-left" data-aos-delay={200 + index * 200}>
                  <div className="tech-achievement-icon">
                    <img src={getFileFullPath(highlight?.image)} alt={highlight?.title} width="auto" height="auto" />
                  </div>
                  <div className="tech-achievement-text">
                    <span className="tech-achievement-number">
                      {highlight?.title}
                    </span>
                    <span className="tech-achievement-label">
                      {highlight?.subtitle}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
