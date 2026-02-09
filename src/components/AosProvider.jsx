"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const AOS_CONFIG = {
    duration: 1500,
    easing: "ease-out-cubic",
    once: false,
    offset: 50,
    delay: 0,
    mirror: false,
    anchorPlacement: "top-bottom",
    disable: false,
    disableMutationObserver: false,
    initClassName: "aos-init",
    animatedClassName: "aos-animate",
    useClassNames: false,
};

export default function AosProvider({ children }) {
    const pathname = usePathname();
    const previousPathRef = useRef(null);
    const isInitializedRef = useRef(false);
    const [isHydrated, setIsHydrated] = useState(false);

    // Wait for hydration to complete before doing anything with AOS
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        // Don't run until hydration is complete
        if (!isHydrated) return;
        if (typeof window === "undefined") return;

        const isRouteChange = previousPathRef.current !== null && previousPathRef.current !== pathname;
        previousPathRef.current = pathname;

        // Scroll to top on route change
        if (isRouteChange) {
            window.scrollTo(0, 0);
        }

        const initializeAOS = () => {
            if (!window.AOS) return;

            if (isRouteChange) {
                // Reset all AOS elements on route change
                const aosElements = document.querySelectorAll("[data-aos]");

                aosElements.forEach((el) => {
                    el.classList.remove("aos-animate", "aos-init");
                    el.style.opacity = "";
                    el.style.transform = "";
                    el.style.transition = "";
                });

                // Force reflow
                void document.body.offsetHeight;

                // Reinitialize AOS
                window.AOS.init(AOS_CONFIG);

                // Refresh after DOM settles
                requestAnimationFrame(() => {
                    window.AOS.refresh();
                    window.dispatchEvent(new Event("scroll"));
                });
            } else if (!isInitializedRef.current) {
                // First page load after hydration - initialize AOS
                window.AOS.init(AOS_CONFIG);
                isInitializedRef.current = true;

                // Refresh and trigger scroll to detect visible elements
                requestAnimationFrame(() => {
                    window.AOS.refresh();
                    window.dispatchEvent(new Event("scroll"));

                    // Additional refresh after layout settles
                    setTimeout(() => {
                        window.AOS.refresh();
                        window.dispatchEvent(new Event("scroll"));
                    }, 200);
                });
            } else {
                // Already initialized, just refresh
                window.AOS.refresh();
                window.dispatchEvent(new Event("scroll"));
            }
        };

        // Wait for AOS script to be available
        if (window.AOS) {
            requestAnimationFrame(() => {
                initializeAOS();
            });
        } else {
            const checkInterval = setInterval(() => {
                if (window.AOS) {
                    clearInterval(checkInterval);
                    requestAnimationFrame(() => {
                        initializeAOS();
                    });
                }
            }, 50);

            const cleanupTimeout = setTimeout(() => clearInterval(checkInterval), 10000);

            return () => {
                clearInterval(checkInterval);
                clearTimeout(cleanupTimeout);
            };
        }
    }, [pathname, isHydrated]);

    return <>{children}</>;
}
