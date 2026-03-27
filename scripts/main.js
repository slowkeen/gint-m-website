(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const heroHeader = document.querySelector(".hero-top");
  const heroLogoImage = document.querySelector(".hero-logo img");
  const modalTriggers = document.querySelectorAll("[data-modal-open]");
  const modalClosers = document.querySelectorAll("[data-modal-close]");
  const contactModals = document.querySelectorAll(".contact-modal");
  const testimonialLetters = document.querySelectorAll(".testimonial-modal .testimonial-letter");
  const statCounters = Array.from(document.querySelectorAll("[data-count-to]"));

  const formatCountValue = (value) => {
    return Math.round(value)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const renderCountValue = (element, value) => {
    const prefix = element.dataset.countPrefix || "";
    const suffix = element.dataset.countSuffix || "";
    element.textContent = `${prefix}${formatCountValue(value)}${suffix}`;
  };

  const animateStatCounters = () => {
    if (statCounters.length === 0) {
      return;
    }

    const duration = 1100;

    statCounters.forEach((counter) => {
      if (counter.dataset.countAnimated === "true") {
        return;
      }

      const targetValue = Number(counter.dataset.countTo);

      if (!Number.isFinite(targetValue)) {
        return;
      }

      counter.dataset.countAnimated = "true";

      if (prefersReducedMotion) {
        renderCountValue(counter, targetValue);
        return;
      }

      const startTime = performance.now();

      const tick = (currentTime) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        renderCountValue(counter, targetValue * easedProgress);

        if (progress < 1) {
          window.requestAnimationFrame(tick);
          return;
        }

        renderCountValue(counter, targetValue);
      };

      renderCountValue(counter, 0);
      window.requestAnimationFrame(tick);
    });
  };

  const initStatCounters = () => {
    if (statCounters.length === 0) {
      return;
    }

    if (prefersReducedMotion) {
      animateStatCounters();
      return;
    }

    const counterObserver = new IntersectionObserver(
      (entries) => {
        const shouldAnimate = entries.some((entry) => entry.isIntersecting);

        if (!shouldAnimate) {
          return;
        }

        animateStatCounters();
        counterObserver.disconnect();
      },
      {
        threshold: 0.35
      }
    );

    statCounters.forEach((counter) => {
      counterObserver.observe(counter);
    });
  };

  const setTestimonialView = (letter, view) => {
    if (!letter) {
      return;
    }

    const previewPanel = letter.querySelector("[data-testimonial-panel='scan']");
    const textPanel = letter.querySelector("[data-testimonial-panel='text']");
    const toggle = letter.querySelector("[data-testimonial-toggle]");
    const isTextView = view === "text";

    letter.dataset.testimonialView = isTextView ? "text" : "scan";

    if (previewPanel) {
      previewPanel.hidden = isTextView;
    }

    if (textPanel) {
      textPanel.hidden = !isTextView;
    }

    if (toggle) {
      toggle.textContent = isTextView ? "\u0421\u043a\u0430\u043d" : "\u0422\u0435\u043a\u0441\u0442\u043e\u0432\u044b\u0439 \u0432\u0430\u0440\u0438\u0430\u043d\u0442";
      toggle.setAttribute("aria-pressed", String(isTextView));
    }
  };

  const resetTestimonialViews = (scope = document) => {
    scope.querySelectorAll(".testimonial-letter[data-testimonial-view]").forEach((letter) => {
      setTestimonialView(letter, "scan");
    });
  };

  testimonialLetters.forEach((letter) => {
    const previewPanel = letter.querySelector(".testimonial-letter-preview");
    const textPanel = letter.querySelector(".testimonial-letter-body");

    if (!previewPanel || !textPanel) {
      return;
    }

    previewPanel.classList.add("testimonial-letter-panel");
    previewPanel.dataset.testimonialPanel = "scan";
    textPanel.classList.add("testimonial-letter-panel");
    textPanel.dataset.testimonialPanel = "text";
    textPanel.hidden = true;
    letter.dataset.testimonialView = "scan";

    if (!letter.querySelector("[data-testimonial-toggle]")) {
      const actions = document.createElement("div");
      actions.className = "testimonial-letter-actions";

      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "testimonial-letter-toggle testimonial-action testimonial-action-secondary";
      toggle.dataset.testimonialToggle = "";
      toggle.setAttribute("aria-pressed", "false");
      toggle.textContent = "\u0422\u0435\u043a\u0441\u0442\u043e\u0432\u044b\u0439 \u0432\u0430\u0440\u0438\u0430\u043d\u0442";

      toggle.addEventListener("click", () => {
        const nextView = letter.dataset.testimonialView === "text" ? "scan" : "text";
        setTestimonialView(letter, nextView);
      });

      actions.append(toggle);
      letter.append(actions);
    }
  });
  const testimonialsSlider = document.querySelector("[data-testimonials-slider]");
  const testimonialPages = testimonialsSlider ? Array.from(testimonialsSlider.querySelectorAll("[data-testimonials-page]")) : [];
  const testimonialPrevButton = document.querySelector('[data-testimonials-nav="prev"]');
  const testimonialNextButton = document.querySelector('[data-testimonials-nav="next"]');
  const testimonialPageCount = testimonialPages.length;
  let testimonialSlides = testimonialPages;
  let testimonialSlideIndex = testimonialPageCount > 1 ? 1 : 0;
  let testimonialIsAnimating = false;

  if (testimonialsSlider && testimonialPageCount > 1) {
    const firstClone = testimonialPages[0].cloneNode(true);
    const lastClone = testimonialPages[testimonialPageCount - 1].cloneNode(true);

    firstClone.dataset.testimonialsClone = "first";
    lastClone.dataset.testimonialsClone = "last";
    firstClone.setAttribute("aria-hidden", "true");
    lastClone.setAttribute("aria-hidden", "true");

    testimonialsSlider.prepend(lastClone);
    testimonialsSlider.append(firstClone);
    testimonialSlides = Array.from(testimonialsSlider.children);
  }

  const syncTestimonialsSlider = (animate = true) => {
    if (!testimonialsSlider || testimonialSlides.length === 0) {
      return;
    }

    const useAnimation = animate && !prefersReducedMotion;
    testimonialsSlider.style.transitionDuration = useAnimation ? "760ms" : "0ms";
    testimonialsSlider.style.transitionTimingFunction = useAnimation ? "var(--ease-out-soft)" : "linear";
    testimonialsSlider.style.transform = `translate3d(-${testimonialSlideIndex * 100}%, 0, 0)`;

    testimonialSlides.forEach((slide, index) => {
      const isActive = index === testimonialSlideIndex;
      const isClone = slide.hasAttribute("data-testimonials-clone");
      slide.setAttribute("aria-hidden", String(!isActive || isClone));

      if ("inert" in slide) {
        slide.inert = !isActive || isClone;
      }
    });
  };

  const normalizeTestimonialsLoop = () => {
    if (testimonialPageCount < 2) {
      testimonialIsAnimating = false;
      return;
    }

    if (testimonialSlideIndex === 0) {
      testimonialSlideIndex = testimonialPageCount;
      syncTestimonialsSlider(false);
    } else if (testimonialSlideIndex === testimonialSlides.length - 1) {
      testimonialSlideIndex = 1;
      syncTestimonialsSlider(false);
    }

    testimonialIsAnimating = false;
  };

  const shiftTestimonialsPage = (direction) => {
    if (!testimonialsSlider || testimonialPageCount < 2 || testimonialIsAnimating) {
      return;
    }

    testimonialSlideIndex += direction;

    if (prefersReducedMotion) {
      if (testimonialSlideIndex === 0) {
        testimonialSlideIndex = testimonialPageCount;
      } else if (testimonialSlideIndex === testimonialSlides.length - 1) {
        testimonialSlideIndex = 1;
      }

      syncTestimonialsSlider(false);
      return;
    }

    testimonialIsAnimating = true;
    syncTestimonialsSlider(true);
  };

  if (testimonialPrevButton) {
    testimonialPrevButton.addEventListener("click", () => {
      shiftTestimonialsPage(-1);
    });
  }

  if (testimonialNextButton) {
    testimonialNextButton.addEventListener("click", () => {
      shiftTestimonialsPage(1);
    });
  }

  if (testimonialsSlider) {
    testimonialsSlider.addEventListener("transitionend", (event) => {
      if (event.propertyName !== "transform") {
        return;
      }

      normalizeTestimonialsLoop();
    });
  }

  syncTestimonialsSlider(false);
  const companyLogosSlider = document.querySelector("[data-company-logos]");
  const companyLogosTrack = companyLogosSlider ? companyLogosSlider.querySelector("[data-company-logos-track]") : null;
  const companyLogoPages = companyLogosTrack ? Array.from(companyLogosTrack.querySelectorAll("[data-company-logos-page]")) : [];
  const companyLogoPrevButton = companyLogosSlider ? companyLogosSlider.querySelector('[data-company-logos-nav="prev"]') : null;
  const companyLogoNextButton = companyLogosSlider ? companyLogosSlider.querySelector('[data-company-logos-nav="next"]') : null;
  const companyLogoPageCount = companyLogoPages.length;
  let companyLogoSlides = companyLogoPages;
  let companyLogoSlideIndex = companyLogoPageCount > 1 ? 1 : 0;
  let companyLogoIsAnimating = false;
  let companyLogoAutoplayId = 0;

  if (companyLogosTrack && companyLogoPageCount > 1) {
    const firstClone = companyLogoPages[0].cloneNode(true);
    const lastClone = companyLogoPages[companyLogoPageCount - 1].cloneNode(true);

    firstClone.dataset.companyLogosClone = "first";
    lastClone.dataset.companyLogosClone = "last";
    firstClone.setAttribute("aria-hidden", "true");
    lastClone.setAttribute("aria-hidden", "true");

    companyLogosTrack.prepend(lastClone);
    companyLogosTrack.append(firstClone);
    companyLogoSlides = Array.from(companyLogosTrack.children);
  }

  const syncCompanyLogoButtons = () => {
    if (companyLogoPrevButton) {
      companyLogoPrevButton.disabled = companyLogoPageCount < 2;
    }

    if (companyLogoNextButton) {
      companyLogoNextButton.disabled = companyLogoPageCount < 2;
    }
  };

  const getActiveCompanyLogoPageIndex = () => {
    if (companyLogoPageCount < 2) {
      return 0;
    }

    if (companyLogoSlideIndex === 0) {
      return companyLogoPageCount - 1;
    }

    if (companyLogoSlideIndex === companyLogoSlides.length - 1) {
      return 0;
    }

    return companyLogoSlideIndex - 1;
  };

  const syncCompanyLogosSlider = (animate = true) => {
    if (!companyLogosTrack || companyLogoSlides.length === 0) {
      return;
    }

    const useAnimation = animate && !prefersReducedMotion;
    const activePageIndex = getActiveCompanyLogoPageIndex();

    companyLogosTrack.style.transitionDuration = useAnimation ? "820ms" : "0ms";
    companyLogosTrack.style.transitionTimingFunction = useAnimation ? "var(--ease-out-soft)" : "linear";
    companyLogosTrack.style.transform = `translate3d(-${companyLogoSlideIndex * 100}%, 0, 0)`;

    companyLogoPages.forEach((page, index) => {
      const isActive = index === activePageIndex;

      page.classList.toggle("is-active", isActive);
      page.hidden = false;
      page.setAttribute("aria-hidden", String(!isActive));

      if ("inert" in page) {
        page.inert = !isActive;
      }
    });

    companyLogoSlides.forEach((page, index) => {
      const isClone = page.hasAttribute("data-company-logos-clone");
      const isActive = index === companyLogoSlideIndex;

      page.setAttribute("aria-hidden", String(!isActive || isClone));

      if ("inert" in page) {
        page.inert = !isActive || isClone;
      }
    });
  };

  const normalizeCompanyLogosLoop = () => {
    if (companyLogoPageCount < 2) {
      companyLogoIsAnimating = false;
      return;
    }

    if (companyLogoSlideIndex === 0) {
      companyLogoSlideIndex = companyLogoPageCount;
      syncCompanyLogosSlider(false);
    } else if (companyLogoSlideIndex === companyLogoSlides.length - 1) {
      companyLogoSlideIndex = 1;
      syncCompanyLogosSlider(false);
    }

    companyLogoIsAnimating = false;
  };

  const showCompanyLogoPage = (direction) => {
    if (!companyLogosTrack || companyLogoPageCount < 2 || companyLogoIsAnimating) {
      return;
    }

    companyLogoSlideIndex += direction;

    if (prefersReducedMotion) {
      if (companyLogoSlideIndex === 0) {
        companyLogoSlideIndex = companyLogoPageCount;
      } else if (companyLogoSlideIndex === companyLogoSlides.length - 1) {
        companyLogoSlideIndex = 1;
      }

      syncCompanyLogosSlider(false);
      return;
    }

    companyLogoIsAnimating = true;
    syncCompanyLogosSlider(true);
  };

  const stopCompanyLogosAutoplay = () => {
    if (companyLogoAutoplayId === 0) {
      return;
    }

    window.clearInterval(companyLogoAutoplayId);
    companyLogoAutoplayId = 0;
  };

  const startCompanyLogosAutoplay = () => {
    stopCompanyLogosAutoplay();

    if (companyLogoPageCount < 2 || prefersReducedMotion) {
      return;
    }

    companyLogoAutoplayId = window.setInterval(() => {
      showCompanyLogoPage(1);
    }, 3000);
  };

  const shiftCompanyLogoPage = (direction) => {
    if (companyLogoPageCount < 2) {
      return;
    }

    showCompanyLogoPage(direction);
    startCompanyLogosAutoplay();
  };

  syncCompanyLogoButtons();
  syncCompanyLogosSlider(false);

  if (companyLogoPrevButton) {
    companyLogoPrevButton.addEventListener("click", () => {
      shiftCompanyLogoPage(-1);
    });
  }

  if (companyLogoNextButton) {
    companyLogoNextButton.addEventListener("click", () => {
      shiftCompanyLogoPage(1);
    });
  }

  if (companyLogosTrack) {
    companyLogosTrack.addEventListener("transitionend", (event) => {
      if (event.propertyName !== "transform") {
        return;
      }

      normalizeCompanyLogosLoop();
    });
  }

  if (companyLogosSlider) {
    companyLogosSlider.addEventListener("pointerenter", stopCompanyLogosAutoplay);
    companyLogosSlider.addEventListener("pointerleave", startCompanyLogosAutoplay);
    companyLogosSlider.addEventListener("focusin", stopCompanyLogosAutoplay);
    companyLogosSlider.addEventListener("focusout", (event) => {
      if (!companyLogosSlider.contains(event.relatedTarget)) {
        startCompanyLogosAutoplay();
      }
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopCompanyLogosAutoplay();
        return;
      }

      startCompanyLogosAutoplay();
    });
  }

  startCompanyLogosAutoplay();
  const messengerToggles = document.querySelectorAll("[data-messenger-toggle]");
  const messengerFields = Array.from(document.querySelectorAll("[data-messenger-field]")).reduce((fields, field) => {
    fields.set(field.dataset.messengerField, field);
    return fields;
  }, new Map());
  const phoneInput = document.querySelector("[data-phone-input]");
  const phoneMethodToggle = document.querySelector('[data-contact-method="phone"]');
  const projectLoadButton = document.querySelector("[data-load-projects]");
  const projectsMasonry = document.querySelector(".projects-masonry");
  const projectCards = projectsMasonry ? Array.from(projectsMasonry.querySelectorAll(".project-photo-card")) : [];
  const PROJECTS_INITIAL_VISIBLE = 16;
  let hiddenProjectCards = [];
  const revealElements = [];
  let projectMasonryFrame = null;
  let lastProjectMasonryWidth = 0;

  const syncInitialProjectVisibility = () => {
    hiddenProjectCards = [];

    projectCards.forEach((card, index) => {
      const shouldHide = index >= PROJECTS_INITIAL_VISIBLE;

      card.hidden = shouldHide;

      if (shouldHide) {
        hiddenProjectCards.push(card);
      }
    });
  };

  const resetProjectMasonryCardStyles = (card) => {
    card.style.removeProperty("width");
    card.style.removeProperty("left");
    card.style.removeProperty("top");
  };

  const disableProjectMasonry = () => {
    if (!projectsMasonry) {
      return;
    }

    projectsMasonry.classList.remove("is-enhanced");
    projectsMasonry.style.removeProperty("height");
    projectCards.forEach(resetProjectMasonryCardStyles);
  };

  const getProjectColumnCount = () => {
    if (!projectsMasonry) {
      return 1;
    }

    const styles = window.getComputedStyle(projectsMasonry);
    const columnCount = Number.parseInt(styles.getPropertyValue("--projects-columns"), 10);

    return Number.isFinite(columnCount) && columnCount > 0 ? columnCount : 1;
  };

  const resolveProjectLength = (value) => {
    const normalizedValue = value.trim();

    if (!normalizedValue) {
      return Number.NaN;
    }

    const pixelValue = Number.parseFloat(normalizedValue);

    if (/^-?\d+(?:\.\d+)?px$/.test(normalizedValue) && Number.isFinite(pixelValue)) {
      return pixelValue;
    }

    const clampMatch = normalizedValue.match(/^clamp\(\s*(-?\d+(?:\.\d+)?)px\s*,\s*(-?\d+(?:\.\d+)?)vw\s*,\s*(-?\d+(?:\.\d+)?)px\s*\)$/);

    if (clampMatch) {
      const min = Number.parseFloat(clampMatch[1]);
      const preferredViewportWidth = Number.parseFloat(clampMatch[2]);
      const max = Number.parseFloat(clampMatch[3]);
      const preferred = (window.innerWidth * preferredViewportWidth) / 100;

      return Math.min(max, Math.max(min, preferred));
    }

    return pixelValue;
  };

  const getProjectColumnGap = () => {
    if (!projectsMasonry) {
      return 0;
    }

    const styles = window.getComputedStyle(projectsMasonry);
    const explicitGap = resolveProjectLength(styles.getPropertyValue("--projects-gap"));
    const columnGap = Number.parseFloat(styles.columnGap);

    if (Number.isFinite(explicitGap)) {
      return explicitGap;
    }

    return Number.isFinite(columnGap) ? columnGap : 0;
  };

  const layoutProjectMasonry = () => {
    if (!projectsMasonry || projectCards.length === 0) {
      return;
    }

    const visibleCards = projectCards.filter((card) => !card.hidden);
    const columnCount = getProjectColumnCount();

    if (visibleCards.length === 0 || columnCount < 2) {
      disableProjectMasonry();
      return;
    }

    const containerWidth = projectsMasonry.clientWidth;

    if (!containerWidth) {
      return;
    }

    const gap = getProjectColumnGap();
    const columnWidth = (containerWidth - gap * (columnCount - 1)) / columnCount;

    if (columnWidth <= 0) {
      disableProjectMasonry();
      return;
    }

    const columnHeights = Array.from({ length: columnCount }, () => 0);

    projectsMasonry.classList.add("is-enhanced");

    visibleCards.forEach((card) => {
      card.style.width = `${columnWidth}px`;
    });

    // Place each card into the currently shortest column to avoid row gaps.
    visibleCards.forEach((card) => {
      let targetColumn = 0;

      for (let index = 1; index < columnHeights.length; index += 1) {
        if (columnHeights[index] < columnHeights[targetColumn]) {
          targetColumn = index;
        }
      }

      const x = targetColumn * (columnWidth + gap);
      const y = columnHeights[targetColumn];
      const cardHeight = card.offsetHeight;

      card.style.left = `${x}px`;
      card.style.top = `${y}px`;
      columnHeights[targetColumn] = y + cardHeight + gap;
    });

    projectsMasonry.style.height = `${Math.max(0, Math.max(...columnHeights) - gap)}px`;
  };

  const requestProjectMasonryLayout = () => {
    if (!projectsMasonry || projectCards.length === 0) {
      return;
    }

    if (projectMasonryFrame) {
      window.cancelAnimationFrame(projectMasonryFrame);
    }

    projectMasonryFrame = window.requestAnimationFrame(() => {
      projectMasonryFrame = null;
      layoutProjectMasonry();
    });
  };

  syncInitialProjectVisibility();

  const applyClasses = (selectors, classes) => {
    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        element.classList.add(...classes);
      });
    });
  };

  let revealObserver = null;

  const registerRevealElement = (element, delay = 0) => {
    if (!element) {
      return;
    }

    element.classList.add("reveal");
    element.style.setProperty("--reveal-delay", `${delay}ms`);
    revealElements.push(element);

    if (prefersReducedMotion) {
      element.classList.add("is-visible");
      return;
    }

    if (revealObserver) {
      revealObserver.observe(element);
    }
  };

  const enhanceProjectCard = (element, delay = 0) => {
    if (!element) {
      return;
    }

    element.classList.add("micro-float");
    registerRevealElement(element, delay);
    const media = element.querySelector(".project-photo");

    if (media) {
      media.classList.add("micro-media");
    }
  };

  const revealGroups = [
    [".company-head", 0],
    [".company-lead", 90],
    [".company-logos", 150],
    [".projects-head", 0],
    [".project-photo-card", 80],
    [".testimonials-head", 0],
    [".testimonial-card", 80],
    [".contact-cta-copy", 0],
    [".awards-head", 0],
    [".award-card", 90],
    [".news-head", 0],
    [".news-card", 80],
    [".news-actions", 160],
    [".site-footer-brand", 0],
    [".site-footer-contacts", 90]
  ];

  revealGroups.forEach(([selector, baseDelay]) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.classList.add("reveal");
      element.style.setProperty("--reveal-delay", `${baseDelay + index * 70}ms`);
      revealElements.push(element);
    });
  });

  applyClasses([
    ".testimonial-card",
    ".award-card",
    ".news-card"
  ], ["micro-float", "micro-sheen"]);

  applyClasses([".project-photo-card"], ["micro-float"]);

  applyClasses([
    ".hero-btn-primary",
    ".hero-top-cta",
    ".company-link-text",
    ".projects-link",
    ".projects-load-more",
    ".awards-link",
    ".news-button",
    ".contact-cta-submit",
    ".testimonial-action",
    ".contact-form-channel",
    ".site-footer-contact"
  ], ["micro-button"]);

  applyClasses([
    ".project-photo",
    ".news-card-image",
    ".award-card-trophy"
  ], ["micro-media"]);

  if (projectsMasonry && projectCards.length > 0) {
    projectCards.forEach((card) => {
      const media = card.querySelector(".project-photo-media");

      if (media && !media.complete) {
        media.addEventListener("load", requestProjectMasonryLayout);
        media.addEventListener("error", requestProjectMasonryLayout);
      }
    });

    if ("ResizeObserver" in window) {
      const projectMasonryResizeObserver = new ResizeObserver((entries) => {
        const [entry] = entries;

        if (!entry) {
          return;
        }

        const nextWidth = Math.round(entry.contentRect.width);

        if (nextWidth === lastProjectMasonryWidth) {
          return;
        }

        lastProjectMasonryWidth = nextWidth;
        requestProjectMasonryLayout();
      });

      projectMasonryResizeObserver.observe(projectsMasonry);
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        requestProjectMasonryLayout();
      });
    }

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        requestProjectMasonryLayout();
      }
    });

    window.addEventListener("load", requestProjectMasonryLayout, { once: true });
    window.addEventListener("resize", requestProjectMasonryLayout);
    requestProjectMasonryLayout();
  }

  if (prefersReducedMotion) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  } else {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }

  if (projectLoadButton) {
    const revealProjectBatch = () => {
      const nextProjects = hiddenProjectCards.splice(0, hiddenProjectCards.length);

      nextProjects.forEach((card, index) => {
        card.hidden = false;
        enhanceProjectCard(card, 80 + index * 70);
      });

      requestProjectMasonryLayout();

      if (hiddenProjectCards.length === 0) {
        projectLoadButton.hidden = true;
      }
    };

    if (hiddenProjectCards.length === 0) {
      projectLoadButton.hidden = true;
    } else {
      projectLoadButton.addEventListener("click", revealProjectBatch);
    }
  }

  if (heroHeader) {
    let wasStickyState = null;

    const updateStickyHeader = () => {
      const triggerPoint = 56;
      const isSticky = window.scrollY > triggerPoint;

      if (isSticky === wasStickyState) {
        return;
      }

      wasStickyState = isSticky;
      heroHeader.classList.toggle("is-sticky", isSticky);

      if (heroLogoImage) {
        heroLogoImage.src = isSticky
          ? heroLogoImage.dataset.stickyLogo
          : heroLogoImage.dataset.defaultLogo;
      }
    };

    updateStickyHeader();
    window.addEventListener("scroll", updateStickyHeader, { passive: true });
    window.addEventListener("resize", updateStickyHeader);
  }

  const formatPhoneValue = (rawValue) => {
    const digits = rawValue.replace(/\D/g, "");
    const localDigits = (digits.startsWith("7") || digits.startsWith("8")) ? digits.slice(1, 11) : digits.slice(0, 10);

    let formatted = "+7";

    if (localDigits.length > 0) {
      formatted += ` (${localDigits.slice(0, 3)}`;
    } else {
      return `${formatted} `;
    }

    if (localDigits.length >= 4) {
      formatted += `) ${localDigits.slice(3, 6)}`;
    }

    if (localDigits.length >= 7) {
      formatted += `-${localDigits.slice(6, 8)}`;
    }

    if (localDigits.length >= 9) {
      formatted += `-${localDigits.slice(8, 10)}`;
    }

    return formatted;
  };

  const setMessengerFieldState = () => {
    messengerToggles.forEach((toggle) => {
      const target = messengerFields.get(toggle.dataset.messengerToggle);

      if (!target) {
        return;
      }

      target.hidden = !toggle.checked;
    });
  };

  const syncPhoneMethodState = () => {
    if (!phoneInput || !phoneMethodToggle) {
      return;
    }

    const digits = phoneInput.value.replace(/\D/g, "");
    const localDigits = digits.startsWith("7") ? digits.slice(1) : digits;

    phoneMethodToggle.checked = localDigits.length > 0;
  };

  const resetMessengerState = () => {
    messengerToggles.forEach((toggle) => {
      toggle.checked = false;
    });
  };

  const syncModalOpenState = () => {
    const hasVisibleModal = Array.from(contactModals).some((modal) => !modal.hidden);
    document.body.classList.toggle("modal-open", hasVisibleModal);
  };

  const openModal = (modal) => {
    if (!modal) {
      return;
    }

    closeAllModals();
    modal.hidden = false;
    syncModalOpenState();

    if (modal.classList.contains("testimonial-modal")) {
      resetTestimonialViews(modal);
    } else {
      resetMessengerState();
      resetTestimonialViews(modal);

      if (phoneInput) {
        phoneInput.value = formatPhoneValue(phoneInput.value);
      }

      syncPhoneMethodState();
      setMessengerFieldState();
    }
  };

  const closeModal = (modal) => {
    if (!modal) {
      return;
    }

    modal.hidden = true;
    resetTestimonialViews(modal);
    syncModalOpenState();
  };

  const closeAllModals = () => {
    contactModals.forEach((modal) => {
      modal.hidden = true;
      resetTestimonialViews(modal);
    });
    syncModalOpenState();
  };

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      openModal(document.getElementById(trigger.dataset.modalOpen));
    });
  });

  modalClosers.forEach((closer) => {
    closer.addEventListener("click", () => {
      closeModal(document.getElementById(closer.dataset.modalClose));
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    closeAllModals();
  });

  messengerToggles.forEach((toggle) => {
    toggle.addEventListener("change", setMessengerFieldState);
  });

  if (phoneInput) {
    phoneInput.value = formatPhoneValue(phoneInput.value);

    phoneInput.addEventListener("focus", () => {
      phoneInput.value = formatPhoneValue(phoneInput.value);
    });

    phoneInput.addEventListener("input", () => {
      const cursorPos = phoneInput.selectionStart;
      const prevLen = phoneInput.value.length;
      phoneInput.value = formatPhoneValue(phoneInput.value);
      const newLen = phoneInput.value.length;
      const newPos = Math.max(0, cursorPos + (newLen - prevLen));
      phoneInput.setSelectionRange(newPos, newPos);
      syncPhoneMethodState();
    });
  }

  syncPhoneMethodState();
  setMessengerFieldState();
  initStatCounters();
})();
