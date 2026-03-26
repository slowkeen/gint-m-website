(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const heroHeader = document.querySelector(".hero-top");
  const heroBlock = document.querySelector(".hero-block");
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
      toggle.className = "testimonial-letter-toggle testimonial-action testimonial-action-secondary micro-button";
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

  const messengerToggles = document.querySelectorAll("[data-messenger-toggle]");
  const phoneInput = document.querySelector("[data-phone-input]");
  const phoneMethodToggle = document.querySelector('[data-contact-method="phone"]');
  const projectLoadButton = document.querySelector("[data-load-projects]");
  const hiddenProjectCards = Array.from(document.querySelectorAll("[data-project-hidden]"));
  const revealElements = [];

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
    [".company-footer", 210],
    [".services-head", 0],
    [".service-card", 80],
    [".projects-head", 0],
    [".project-photo-card", 80],
    [".testimonials-head", 0],
    [".testimonial-card", 80],
    [".contact-cta-copy", 0],
    [".contact-cta-side", 90],
    [".directions-head", 0],
    [".direction-card", 80],
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
    ".service-card",
    ".direction-card",
    ".award-card",
    ".news-card"
  ], ["micro-float", "micro-sheen"]);

  applyClasses([".project-photo-card"], ["micro-float"]);

  applyClasses([
    ".hero-btn-primary",
    ".hero-top-cta",
    ".hero-portfolio-link",
    ".company-link",
    ".company-link-text",
    ".projects-link",
    ".projects-load-more",
    ".awards-link",
    ".news-button",
    ".contact-cta-submit",
    ".contact-form-channel",
    ".site-footer-contact"
  ], ["micro-button"]);

  applyClasses([
    ".service-card-icon",
    ".direction-card-image",
    ".project-photo",
    ".news-card-image",
    ".award-card-trophy"
  ], ["micro-media"]);

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

  if (heroHeader && heroBlock) {
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
      const target = document.querySelector(`[data-messenger-field="${toggle.dataset.messengerToggle}"]`);

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

  const openModal = (modal) => {
    if (!modal) {
      return;
    }

    modal.hidden = false;
    document.body.classList.add("modal-open");

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
    document.body.classList.remove("modal-open");
  };

  const closeAllModals = () => {
    contactModals.forEach((modal) => {
      modal.hidden = true;
      resetTestimonialViews(modal);
    });
    document.body.classList.remove("modal-open");
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
