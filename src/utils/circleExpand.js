/**
 * Circle Expand Animation Controller
 * Creates a scroll-triggered circle that expands from center to full viewport
 */
class CircleExpand {
  constructor(options = {}) {
    this.options = {
      wrapper: options.wrapper || ".circle-expand-wrapper",
      circle: options.circle || ".circle-expand",
      content: options.content || ".circle-expand-content",
      minSize: options.minSize || 300,
      easing: options.easing || "easeOutCubic",
      ...options,
    };

    // Check if mobile device
    this.isMobile = this.checkMobile();

    // Skip initialization on mobile
    if (this.isMobile) {
      return;
    }

    this.wrapper = document.querySelector(this.options.wrapper);
    this.circle = document.querySelector(this.options.circle);
    this.content = document.querySelector(this.options.content);
    this.servicesHeader = document.querySelector(".services-header");

    if (!this.wrapper || !this.circle) {
      console.warn("CircleExpand: Required elements not found");
      return;
    }

    this.progress = 0;
    this.init();
  }

  checkMobile() {
    // Check if device width is mobile/tablet (typically < 992px)
    if (typeof window !== "undefined") {
      return window.innerWidth < 992;
    }
    return false;
  }

  easings = {
    linear: (t) => t,
    easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
    easeOutQuart: (t) => 1 - Math.pow(1 - t, 4),
    easeOutExpo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    easeInOutCubic: (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  };

  init() {
    // Skip on mobile
    if (this.isMobile) {
      return;
    }

    // Set initial styles
    this.circle.style.willChange = "width, height, border-radius";

    // Initialize title position to center
    if (this.servicesHeader) {
      const titleContainer = this.servicesHeader.querySelector(".text-center");
      if (titleContainer) {
        titleContainer.style.position = "absolute";
        titleContainer.style.left = "85%";
        titleContainer.style.transform = "translateX(-50%)";
        titleContainer.style.transition = "none";
        titleContainer.style.textAlign = "center";
        titleContainer.style.width = "auto";
      }
    }

    // Bind and add scroll listener
    this.onScroll = this.onScroll.bind(this);
    this.onResize = this.onResize.bind(this);

    window.addEventListener("scroll", this.onScroll, { passive: true });
    window.addEventListener("resize", this.onResize, { passive: true });

    // Initial update
    this.onScroll();
  }

  onResize() {
    this.onScroll();
  }

  onScroll() {
    // Skip on mobile
    if (this.isMobile) {
      return;
    }

    const wrapperRect = this.wrapper.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Calculate scroll progress - Complete circle expand animation in single scroll
    // Start: when wrapper top enters viewport (becomes visible)
    // End: after scrolling one viewport height
    
    const wrapperTop = wrapperRect.top;
    
    // Start animation when section top enters viewport
    // Complete circle expand animation in one viewport height scroll
    const startPoint = windowHeight; // Start when top enters viewport
    const scrollDistance = windowHeight; // Complete in one viewport height
    
    // Calculate progress based on viewport height scroll
    // When wrapperTop = windowHeight, progress = 0 (just entering)
    // When wrapperTop = 0, progress = 1 (scrolled one viewport height)
    const scrolled = startPoint - wrapperTop; // How much we've scrolled from start
    
    let rawProgress = scrolled / scrollDistance;
    rawProgress = Math.max(0, Math.min(1, rawProgress));

    // Apply easing
    const easingFn =
      this.easings[this.options.easing] || this.easings.easeOutCubic;
    this.progress = easingFn(rawProgress);

    this.updateCircle();
  }

  updateCircle() {
    // Skip on mobile
    if (this.isMobile) {
      return;
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Calculate diagonal to ensure full coverage
    const maxSize = Math.sqrt(vw * vw + vh * vh) * 1.1;
    const minSize = this.options.minSize;

    // Interpolate size
    const currentSize = minSize + (maxSize - minSize) * this.progress;

    // Border radius: 50% to 0%
    const currentRadius = 50 * (1 - this.progress);

    // Apply styles
    this.circle.style.width = `${currentSize}px`;
    this.circle.style.height = `${currentSize}px`;
    this.circle.style.borderRadius = `${currentRadius}%`;

    // Update content opacity (fade in earlier - starts at 30% progress)
    if (this.content) {
      const contentProgress = Math.max(0, (this.progress - 0.3) / 0.7);
      this.content.style.opacity = contentProgress;
      //   this.content.style.transform = `scale(${0.9 + 0.1 * contentProgress})`;
    }

    // Update title position - move from center (65%) to left as scroll progresses
    if (this.servicesHeader) {
      const titleContainer = this.servicesHeader.querySelector(".text-center");
      if (titleContainer) {
        // Progress 0: title at 85% left (centered in circle)
        // Progress 1: title at 0% left with 0% transform (left position)
        const startLeft = 85;
        const endLeft = 0;
        const startTransform = -50;
        const endTransform = 0;
        
        // Interpolate between start and end positions
        const leftPosition = startLeft + (endLeft - startLeft) * this.progress;
        const transformX = startTransform + (endTransform - startTransform) * this.progress;
        
        titleContainer.style.position = "absolute";
        titleContainer.style.left = `${leftPosition}%`;
        titleContainer.style.transform = `translateX(${transformX}%)`;
        titleContainer.style.transition = "none";
        titleContainer.style.textAlign = this.progress > 0.2 ? "left" : "center";
        titleContainer.style.width = "auto";
        titleContainer.style.maxWidth = "none";
        titleContainer.style.whiteSpace = "nowrap";
      }
    }

    // Set CSS custom property for additional styling
    this.circle.style.setProperty("--progress", this.progress);
  }

  destroy() {
    // Skip on mobile (no listeners to remove)
    if (this.isMobile) {
      return;
    }

    window.removeEventListener("scroll", this.onScroll);
    window.removeEventListener("resize", this.onResize);
  }
}

// Export
export { CircleExpand };
