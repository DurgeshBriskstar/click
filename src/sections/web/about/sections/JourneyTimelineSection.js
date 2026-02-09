/* eslint-disable @next/next/no-img-element */
"use client";

import { Container } from "react-bootstrap";
import Image from "next/image";
import { motion, useMotionValue, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";
import { getFileFullPath } from "utils/formats";

export default function JourneyTimelineSection({ data }) {
  if (!data) return null;

  const milestones = data?.highlights || [];
  const sliderRef = useRef(null);
  const x = useMotionValue(0);
  const controls = useAnimation();
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || milestones.length === 0) return;

    // Start auto-slide animation
    const startAnimation = () => {
      const sliderWidth = slider.scrollWidth / 2;
      if (sliderWidth > 0) {
        controls.start({
          x: -sliderWidth,
          transition: {
            duration: 60,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear"
          }
        });
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(startAnimation, 100);
    return () => clearTimeout(timer);
  }, [controls, milestones.length]);

  const handleDragStart = () => {
    isDraggingRef.current = true;
    controls.stop();
  };

  const handleDragEnd = (event, info) => {
    isDraggingRef.current = false;
    const slider = sliderRef.current;
    if (!slider) return;

    const sliderWidth = slider.scrollWidth / 2;
    const currentX = x.get();
    
    // Normalize position for seamless loop
    let normalizedX = currentX;
    if (sliderWidth > 0) {
      normalizedX = normalizedX % (-sliderWidth);
      if (normalizedX > 0) {
        normalizedX = normalizedX - sliderWidth;
      }
    }

    // Set normalized position
    x.set(normalizedX);
    
    // Resume auto-slide animation from normalized position
    const targetX = normalizedX - sliderWidth;
    controls.start({
      x: targetX,
      transition: {
        duration: 60,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear"
      }
    });
  };

  return (
    <section className="section journey-timeline gray-bg">
      <Container>
        <div className="text-center">
          <div className="insights-section" data-aos="fade-up">
            <h2 className="insights-section-title">
              {data?.title}
              <img src="/images/icons/title-underline.svg" alt="Title underline" className="insights-underline" />
            </h2>
          </div>
          {data?.subtitle && (
            <p className="sub-title">
              {data.subtitle}
            </p>
          )}
        </div>

        {milestones.length > 0 && (
          <div className="journey-timeline-wrapper">
            <div className="timeline-container">
              <motion.div
                ref={sliderRef}
                className="timeline-items-wrapper timeline-slider-track"
                drag="x"
                dragConstraints={{ left: -Infinity, right: 0 }}
                dragElastic={0.1}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                animate={controls}
                style={{ x }}
                whileDrag={{ cursor: "grabbing" }}
              >
                {milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className="timeline-item"
                    data-aos="fade-up"
                    data-aos-delay={index * 200}
                  >
                    <div className="timeline-marker">
                      {milestone?.year && (
                        <div className="timeline-year">{milestone.year}</div>
                      )}
                    </div>
                    <div className="timeline-content">
                      {milestone?.image && (
                        <div className="timeline-icon">
                          <img
                            src={getFileFullPath(milestone.image)}
                            alt={milestone?.title || `Milestone ${index + 1}`}
                          />
                        </div>
                      )}
                      <div>
                        <h5 className="timeline-title">{milestone?.title}</h5>
                        <p className="timeline-description">{milestone?.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Duplicate items for seamless infinite loop */}
                {milestones.map((milestone, index) => (
                  <div
                    key={`duplicate-${index}`}
                    className="timeline-item"
                  >
                    <div className="timeline-marker">
                      {milestone?.year && (
                        <div className="timeline-year">{milestone.year}</div>
                      )}
                    </div>
                    <div className="timeline-content">
                      {milestone?.image && (
                        <div className="timeline-icon">
                          <img
                            src={getFileFullPath(milestone.image)}
                            alt={milestone?.title || `Milestone ${index + 1}`}
                          />
                        </div>
                      )}
                      <div>
                        <h5 className="timeline-title">{milestone?.title}</h5>
                        <p className="timeline-description">{milestone?.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}

