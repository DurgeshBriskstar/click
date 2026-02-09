/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { getFileFullPath } from "utils/formats";

export default function TeamSection({ data }) {
  const scrollContainerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!data) return null;

  const teamMembers = data?.teams || [];

  const scrollToSlide = (direction) => {
    if (!scrollContainerRef.current || teamMembers.length === 0) return;

    const container = scrollContainerRef.current;
    const itemWidth = container.querySelector('.team-member-col')?.offsetWidth || 350;
    const gap = 30;
    const scrollAmount = itemWidth + gap;

    let newIndex = currentIndex;
    if (direction === "left") {
      newIndex = currentIndex > 0 ? currentIndex - 1 : teamMembers.length - 1;
    } else {
      newIndex = currentIndex < teamMembers.length - 1 ? currentIndex + 1 : 0;
    }

    setCurrentIndex(newIndex);

    const scrollPosition = newIndex * scrollAmount;

    container.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || teamMembers.length === 0) return;

    const handleScroll = () => {
      const maxScroll = container.scrollWidth - container.clientWidth;
      const currentScroll = container.scrollLeft;

      if (currentScroll >= maxScroll - 10) {
        setTimeout(() => {
          container.scrollTo({
            left: 0,
            behavior: 'auto',
          });
          setCurrentIndex(0);
        }, 100);
      }
      else if (currentScroll <= 10 && currentIndex === teamMembers.length - 1) {
        setTimeout(() => {
          container.scrollTo({
            left: maxScroll,
            behavior: 'auto',
          });
        }, 100);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [teamMembers.length, currentIndex]);

  return (
    <section className="section gray-bg team-wrapper">
      <Container>
        <div className="team-section">
          <div className="team-insights">
            <div className="insights-section" data-aos="fade-up">
              <h2 className="insights-section-title">
                {data?.title}
                <img src="/images/icons/title-underline.svg" alt="Title underline" className="insights-underline" />
              </h2>
            </div>
            {data?.subtitle && (
              <p className="m-0 mb-4" data-aos="fade-up" data-aos-delay="200">
                {data.subtitle}
              </p>
            )}
            <div className="team-carousel-arrows">
              <button className="team-carousel-arrow team-carousel-arrow-left" onClick={() => scrollToSlide("left")} aria-label="Previous team members">
                <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.5555 8.00015L0.999171 8.00015M0.999171 8.00015L7.99953 15.0005M0.999171 8.00015L7.99953 0.99979" stroke="#00489A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button className="team-carousel-arrow team-carousel-arrow-right" onClick={() => scrollToSlide("right")} aria-label="Next team members">
                <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.99917 8.00034H16.5555M16.5555 8.00034L9.55516 0.999985M16.5555 8.00034L9.55516 15.0007" stroke="#00489A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
          {teamMembers.length > 0 && (
            <div className="team-carousel-wrapper">
              <div className="team-carousel-container" ref={scrollContainerRef}>
                <div className="team-slider-wrapper">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="team-member-col">
                      <div className="team-member-card">
                        {member?.image && (
                          <div className="team-member-image">
                            <img src={getFileFullPath(member.image)} alt={member?.name || `Team Member ${index + 1}`} />
                          </div>
                        )}
                        <div className="team-member-info">
                          <h3 className="team-member-name">{member?.name}</h3>
                          <p className="team-member-role">{member?.designation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Duplicate items for infinite loop */}
                  {teamMembers.map((member, index) => (
                    <div key={`duplicate-${index}`} className="team-member-col">
                      <div className="team-member-card">
                        {member?.image && (
                          <div className="team-member-image">
                            <img src={getFileFullPath(member.image)} alt={member?.name || `Team Member ${index + 1}`} />
                          </div>
                        )}
                        <div className="team-member-info">
                          <h3 className="team-member-name">{member?.name}</h3>
                          <p className="team-member-role">{member?.designation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

