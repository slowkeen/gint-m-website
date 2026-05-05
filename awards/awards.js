(() => {
  const resolveSitePath = typeof window.resolveSitePath === "function"
    ? window.resolveSitePath
    : (value) => value;
  const heroMenuMediaQuery = window.matchMedia("(max-width: 980px)");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const normalizePath = (value) => {
    if (!value) {
      return "/";
    }

    let normalized = value.replace(/index.html$/i, "");

    if (!normalized.startsWith("/")) {
      normalized = `/${normalized}`;
    }

    if (!normalized.endsWith("/")) {
      normalized = `${normalized}/`;
    }

    return normalized.replace(/\/+/g, "/");
  };

  const setElementHiddenState = (element, isHidden) => {
    if (!element) {
      return;
    }

    element.setAttribute("aria-hidden", String(isHidden));

    if ("inert" in element) {
      element.inert = isHidden;
    }
  };

  const initSharedHeader = () => {
    const heroHeader = document.querySelector(".hero-top");

    if (!heroHeader) {
      return;
    }

    const heroLogoImage = heroHeader.querySelector(".hero-logo img");
    const heroMenuToggle = heroHeader.querySelector(".hero-menu-toggle");
    const heroTopNav = heroHeader.querySelector(".hero-top-nav");
    const heroTopControls = heroHeader.querySelector(".hero-top-controls");
    const currentPath = normalizePath(window.location.pathname);
    let isHeroMenuOpen = false;
    let wasStickyState = null;

    const syncHeroLogo = (isStickyState = heroHeader.classList.contains("is-sticky")) => {
      if (!heroLogoImage) {
        return;
      }

      heroLogoImage.src = (isStickyState || isHeroMenuOpen)
        ? heroLogoImage.dataset.stickyLogo || heroLogoImage.src
        : heroLogoImage.dataset.defaultLogo || heroLogoImage.src;
    };

    const syncHeroMenuState = ({ restoreFocus = false } = {}) => {
      const shouldOpenMenu = heroMenuMediaQuery.matches && isHeroMenuOpen;

      heroHeader.classList.toggle("is-menu-open", shouldOpenMenu);

      if (heroMenuToggle) {
        heroMenuToggle.setAttribute("aria-expanded", String(shouldOpenMenu));
        heroMenuToggle.setAttribute("aria-label", shouldOpenMenu ? "Закрыть меню" : "Открыть меню");
      }

      setElementHiddenState(heroTopNav, heroMenuMediaQuery.matches && !shouldOpenMenu);
      setElementHiddenState(heroTopControls, heroMenuMediaQuery.matches && !shouldOpenMenu);
      document.body.classList.toggle("menu-open", shouldOpenMenu);
      syncHeroLogo();

      if (!shouldOpenMenu && restoreFocus && heroMenuToggle) {
        heroMenuToggle.focus();
      }
    };

    const closeHeroMenu = (options = {}) => {
      if (!isHeroMenuOpen) {
        syncHeroMenuState(options);
        return;
      }

      isHeroMenuOpen = false;
      syncHeroMenuState(options);
    };

    const openHeroMenu = () => {
      if (!heroMenuMediaQuery.matches) {
        return;
      }

      isHeroMenuOpen = true;
      syncHeroMenuState();

      window.requestAnimationFrame(() => {
        heroTopNav?.querySelector("a")?.focus();
      });
    };

    const toggleHeroMenu = () => {
      if (isHeroMenuOpen) {
        closeHeroMenu({ restoreFocus: true });
        return;
      }

      openHeroMenu();
    };

    const updateStickyHeader = () => {
      const isSticky = true;

      if (isSticky === wasStickyState) {
        return;
      }

      wasStickyState = isSticky;
      heroHeader.classList.toggle("is-sticky", isSticky);
      document.body.classList.toggle("is-awards-header-sticky", isSticky);
      syncHeroLogo(isSticky);
    };

    document.querySelectorAll('a[href$="/awards/"]').forEach((link) => {
      try {
        const url = new URL(link.href, window.location.href);

        if (normalizePath(url.pathname) === currentPath) {
          link.setAttribute("aria-current", "page");
        }
      } catch {
        // Ignore malformed URLs from partials.
      }
    });

    heroMenuToggle?.addEventListener("click", toggleHeroMenu);

    [heroTopNav, heroTopControls].forEach((group) => {
      group?.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          closeHeroMenu();
        });
      });
    });

    window.addEventListener("load", updateStickyHeader);
    window.addEventListener("resize", () => {
      updateStickyHeader();

      if (heroMenuMediaQuery.matches) {
        syncHeroMenuState();
        return;
      }

      closeHeroMenu();
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeHeroMenu({ restoreFocus: true });
      }
    });

    syncHeroMenuState();
    updateStickyHeader();
  };

  const shuffleItems = (items) => {
    const shuffled = [...items];

    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }

    return shuffled;
  };

  const archiveReviewCards = [
    {
      id: "review-align",
      modalId: "testimonial-align-modal",
      logoSrc: "../logos/clients/color/Align-logo.svg",
      logoAlt: "Align Technology",
      quote:
        "Компания Align Technology Inc. благодарит команду «Гинт-М» за реализацию офисного проекта компании, расположенного в БЦ «Даниловская Мануфактура». «Гинт-М» в роли генерального подрядчика выполнила рабочее проектирование, демонтаж, весь комплекс общестроительных, инженерных, а также пусконаладочных работ.",
      reviewHref: "../reviews/Align/rekomendatel_noe_pis_mo_align_red_1_page-0001.jpg"
    },
    {
      id: "review-dell",
      modalId: "testimonial-dell-modal",
      logoSrc: "../logos/clients/color/Dell-logo.svg",
      logoAlt: "Dell Technologies",
      quote:
        "Команда держала график и соблюдала все сроки без компромиссов по качеству работ. Gint-M уверенно управляет всем комплексом инженерных и строительных задач, необходимых для качественной реализации проекта, и выдерживает заявленные сроки без потери качества.",
      reviewHref: "../reviews/Dell/rekomendatel_noe_pis_mo_dell_page-0001.jpg"
    },
    {
      id: "review-winline",
      modalId: "testimonial-winline-modal",
      logoSrc: "../logos/clients/color/winline-logo.svg",
      logoAlt: "Winline",
      quote:
        "Компания Winline благодарит строительную компанию «Гинт-М» за реализацию корпоративного офисного проекта. Команда выступила в проекте в роли генерального подрядчика, осуществив полный комплекс общестроительных, отделочных и инженерных работ, а также рабочее проектирование.",
      reviewHref: "../reviews/Winline/rek_pis_mo_gint-m_rus-1.png"
    }
  ];

  const createArchiveReviewCard = (review) => {
    const card = document.createElement("article");
    const body = document.createElement("div");
    const top = document.createElement("div");
    const quoteMark = document.createElement("span");
    const brand = document.createElement("span");
    const logo = document.createElement("img");
    const reviewText = document.createElement("blockquote");
    const reviewParagraph = document.createElement("p");
    const footer = document.createElement("footer");
    const readMore = document.createElement("a");

    card.id = review.id;
    card.className = "awards-page-card awards-page-card-review";
    card.dataset.cardType = "review";
    card.dataset.cardLabel = "";

    body.className = "awards-page-card-body awards-page-review-layout";

    top.className = "awards-page-review-top";

    quoteMark.className = "awards-page-review-mark";
    quoteMark.setAttribute("aria-hidden", "true");
    quoteMark.textContent = "«";

    brand.className = "awards-page-review-brand";

    logo.className = `testimonial-brand-logo${review.logoAlt === "Align Technology" ? " testimonial-brand-logo-align" : ""}`;
    logo.src = resolveSitePath(review.logoSrc);
    logo.alt = review.logoAlt;
    logo.loading = "lazy";
    logo.decoding = "async";

    reviewText.className = "awards-page-review-text";
    reviewParagraph.textContent = review.quote;

    footer.className = "awards-page-review-footer";

    readMore.className = "awards-page-review-link";
    readMore.href = resolveSitePath(review.reviewHref);
    readMore.dataset.modalOpen = review.modalId;
    readMore.textContent = "Читать отзыв полностью";

    brand.append(logo);
    top.append(quoteMark, brand);
    reviewText.append(reviewParagraph);
    footer.append(readMore);
    body.append(top, reviewText, footer);
    card.append(body);

    return card;
  };

  const initTestimonialModals = () => {
    const testimonialLetters = document.querySelectorAll(".testimonial-modal .testimonial-letter");
    const contactModals = document.querySelectorAll(".contact-modal");
    const modalClosers = document.querySelectorAll("[data-modal-close]");
    const testimonialUiText = document.documentElement.lang === "en"
      ? {
        testimonialScan: "Scan",
        testimonialText: "Text version"
      }
      : {
        testimonialScan: "Скан",
        testimonialText: "Текстовый вариант"
      };

    if (contactModals.length === 0) {
      return;
    }

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
        toggle.textContent = isTextView ? testimonialUiText.testimonialScan : testimonialUiText.testimonialText;
        toggle.setAttribute("aria-pressed", String(isTextView));
      }
    };

    const resetTestimonialViews = (scope = document) => {
      scope.querySelectorAll(".testimonial-letter[data-testimonial-view]").forEach((letter) => {
        setTestimonialView(letter, "scan");
      });
    };

    const syncModalOpenState = () => {
      const hasVisibleModal = Array.from(contactModals).some((modal) => !modal.hidden);
      document.body.classList.toggle("modal-open", hasVisibleModal);
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

    const openModal = (modal) => {
      if (!modal) {
        return;
      }

      closeAllModals();
      modal.hidden = false;
      resetTestimonialViews(modal);
      syncModalOpenState();
      modal.querySelector(".contact-modal-close")?.focus({ preventScroll: true });
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
        toggle.textContent = testimonialUiText.testimonialText;

        toggle.addEventListener("click", () => {
          const nextView = letter.dataset.testimonialView === "text" ? "scan" : "text";
          setTestimonialView(letter, nextView);
        });

        actions.append(toggle);
        letter.append(actions);
      }
    });

    document.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-modal-open]");

      if (!trigger) {
        return;
      }

      event.preventDefault();
      openModal(document.getElementById(trigger.dataset.modalOpen));
    });

    modalClosers.forEach((closer) => {
      closer.addEventListener("click", () => {
        closeModal(document.getElementById(closer.dataset.modalClose));
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeAllModals();
      }
    });

    syncModalOpenState();
  };

  const decorateArchiveCard = (card) => {
    const media = card.querySelector(".awards-page-card-media");
    const bodyChildren = Array.from(card.children).filter(
      (child) => !child.classList.contains("awards-page-card-media") && !child.classList.contains("awards-page-card-body")
    );
    const primaryChipText = card.dataset.cardLabel || (card.dataset.cardType === "review" ? "Отзыв" : "Награда");
    const secondaryChipText = card.dataset.cardSecondary || card.dataset.awardYear || "";

    if (media && primaryChipText && !media.querySelector(".awards-page-card-badges")) {
      const badges = document.createElement("div");
      const primaryChip = document.createElement("span");

      badges.className = "awards-page-card-badges";
      primaryChip.className = "awards-page-card-chip";
      primaryChip.textContent = primaryChipText;
      badges.append(primaryChip);

      if (secondaryChipText) {
        const secondaryChip = document.createElement("span");
        secondaryChip.className = "awards-page-card-chip";
        secondaryChip.textContent = secondaryChipText;
        badges.append(secondaryChip);
      }

      media.append(badges);
    }

    if (bodyChildren.length > 0 && !card.querySelector(".awards-page-card-body")) {
      const body = document.createElement("div");
      body.className = "awards-page-card-body";
      bodyChildren.forEach((child) => body.appendChild(child));
      card.appendChild(body);
    }
  };

  const enhanceAwardsArchive = () => {
    const awardsArchiveList = document.querySelector(".awards-page-list");

    if (!awardsArchiveList || awardsArchiveList.dataset.archiveMixed === "true") {
      return;
    }

    document.querySelectorAll(".awards-page-year").forEach((yearBlock) => {
      const year = yearBlock.querySelector(".awards-page-year-label")?.textContent?.trim();

      yearBlock.querySelectorAll(".awards-page-card").forEach((card) => {
        if (year) {
          card.dataset.awardYear = year;
        }
        card.dataset.cardType = "award";
        card.dataset.cardLabel = "Награда";
      });
    });

    const mixedCards = [
      ...Array.from(awardsArchiveList.querySelectorAll(".awards-page-card")),
      ...archiveReviewCards.map(createArchiveReviewCard)
    ];

    mixedCards.forEach((card) => {
      decorateArchiveCard(card);
      awardsArchiveList.append(card);
    });

    shuffleItems(mixedCards).forEach((card) => {
      awardsArchiveList.append(card);
    });

    awardsArchiveList.dataset.archiveMixed = "true";
  };

  const initAwardsArchiveFilters = () => {
    const filterGroup = document.querySelector("[data-awards-filter]");
    const awardsArchiveList = document.querySelector(".awards-page-list");

    if (!filterGroup || !awardsArchiveList) {
      return;
    }

    const filterButtons = Array.from(filterGroup.querySelectorAll("[data-awards-filter-button]"));

    if (filterButtons.length === 0) {
      return;
    }

    const getArchiveCards = () => Array.from(awardsArchiveList.querySelectorAll(".awards-page-card"));

    const getCardType = (card) => {
      if (!card.dataset.cardType) {
        card.dataset.cardType = card.classList.contains("awards-page-card-review") ? "review" : "award";
      }

      return card.dataset.cardType;
    };

    const setActiveFilter = (filterValue) => {
      filterButtons.forEach((button) => {
        const isActive = button.dataset.awardsFilterButton === filterValue;

        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });

      getArchiveCards().forEach((card) => {
        const shouldShow = filterValue === "all" || getCardType(card) === filterValue;

        card.hidden = !shouldShow;
        card.classList.toggle("is-filter-hidden", !shouldShow);
        card.setAttribute("aria-hidden", String(!shouldShow));
      });
    };

    filterGroup.addEventListener("click", (event) => {
      const button = event.target.closest("[data-awards-filter-button]");

      if (!button || !filterGroup.contains(button)) {
        return;
      }

      setActiveFilter(button.dataset.awardsFilterButton || "all");
    });

    setActiveFilter(filterGroup.querySelector(".is-active")?.dataset.awardsFilterButton || "all");
  };

  const initAwardsTimeline = () => {
    const awardsTimeline = document.querySelector("[data-awards-timeline]");
    const awardsTimelineStage = awardsTimeline ? awardsTimeline.querySelector("[data-awards-timeline-stage]") : null;
    const awardsTimelineTrack = awardsTimeline ? awardsTimeline.querySelector("[data-awards-timeline-track]") : null;
    let awardsTimelineItems = awardsTimelineTrack ? Array.from(awardsTimelineTrack.querySelectorAll(".awards-timeline-item")) : [];
    const awardsTimelinePrevButton = document.querySelector('[data-awards-timeline-nav="prev"]');
    const awardsTimelineNextButton = document.querySelector('[data-awards-timeline-nav="next"]');
    let awardsTimelineSyncFrame = 0;
    let awardsTimelineAutoplayId = 0;

    if (!awardsTimelineStage) {
      return;
    }

    if (awardsTimelineTrack && awardsTimelineItems.length > 1) {
      awardsTimelineItems = awardsTimelineItems
        .map((item, index) => {
          const yearLabel = item.querySelector(".awards-timeline-year");
          const yearValue = Number.parseInt(yearLabel?.textContent?.trim() || "", 10);

          return {
            item,
            index,
            year: Number.isFinite(yearValue) ? yearValue : 0
          };
        })
        .sort((left, right) => right.year - left.year || left.index - right.index)
        .map(({ item }) => item);

      awardsTimelineTrack.append(...awardsTimelineItems);
    }

    const getAwardsTimelineStep = () => {
      if (awardsTimelineItems.length === 0) {
        return 0;
      }

      const firstItem = awardsTimelineItems[0];
      const firstItemWidth = firstItem.getBoundingClientRect().width;
      const trackStyles = awardsTimelineTrack ? window.getComputedStyle(awardsTimelineTrack) : null;
      const gap = trackStyles ? Number.parseFloat(trackStyles.columnGap || trackStyles.gap || "0") || 0 : 0;
      const viewportStep = Math.round(awardsTimelineStage.clientWidth * 0.82);

      return Math.max(Math.round(firstItemWidth + gap), viewportStep);
    };

    const getAwardsTimelineBounds = () => {
      const maxScrollLeft = Math.max(0, awardsTimelineStage.scrollWidth - awardsTimelineStage.clientWidth);

      return {
        maxScrollLeft,
        isScrollable: maxScrollLeft > 4,
        atStart: awardsTimelineStage.scrollLeft <= 4,
        atEnd: maxScrollLeft - awardsTimelineStage.scrollLeft <= 4
      };
    };

    const syncAwardsTimelineButtons = () => {
      const { isScrollable } = getAwardsTimelineBounds();

      if (awardsTimelinePrevButton) {
        awardsTimelinePrevButton.disabled = !isScrollable;
      }

      if (awardsTimelineNextButton) {
        awardsTimelineNextButton.disabled = !isScrollable;
      }
    };

    const requestAwardsTimelineSync = () => {
      if (awardsTimelineSyncFrame !== 0) {
        return;
      }

      awardsTimelineSyncFrame = window.requestAnimationFrame(() => {
        awardsTimelineSyncFrame = 0;
        syncAwardsTimelineButtons();
      });
    };

    const resetAwardsTimelinePosition = () => {
      awardsTimelineStage.scrollTo({
        left: 0,
        behavior: "auto"
      });

      requestAwardsTimelineSync();
    };

    const shiftAwardsTimeline = (direction) => {
      const step = getAwardsTimelineStep();

      if (step <= 0) {
        return;
      }

      const {
        maxScrollLeft,
        isScrollable,
        atStart,
        atEnd
      } = getAwardsTimelineBounds();

      if (!isScrollable) {
        return;
      }

      if (direction > 0 && atEnd) {
        resetAwardsTimelinePosition();
        return;
      }

      if (direction < 0 && atStart) {
        awardsTimelineStage.scrollTo({
          left: maxScrollLeft,
          behavior: "auto"
        });
        requestAwardsTimelineSync();
        return;
      }

      const nextLeft = Math.min(
        maxScrollLeft,
        Math.max(0, awardsTimelineStage.scrollLeft + (step * direction))
      );

      awardsTimelineStage.scrollTo({
        left: nextLeft,
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });

      requestAwardsTimelineSync();
    };

    const stopAwardsTimelineAutoplay = () => {
      if (awardsTimelineAutoplayId === 0) {
        return;
      }

      window.clearInterval(awardsTimelineAutoplayId);
      awardsTimelineAutoplayId = 0;
    };

    const autoplayAwardsTimeline = () => {
      const { isScrollable, atEnd } = getAwardsTimelineBounds();

      if (!isScrollable) {
        return;
      }

      if (atEnd) {
        resetAwardsTimelinePosition();
        return;
      }

      shiftAwardsTimeline(1);
    };

    const startAwardsTimelineAutoplay = () => {
      stopAwardsTimelineAutoplay();

      if (prefersReducedMotion) {
        return;
      }

      const { isScrollable } = getAwardsTimelineBounds();

      if (!isScrollable) {
        return;
      }

      awardsTimelineAutoplayId = window.setInterval(() => {
        autoplayAwardsTimeline();
      }, 3000);
    };

    awardsTimelineStage.style.overflowAnchor = "none";
    resetAwardsTimelinePosition();
    window.requestAnimationFrame(resetAwardsTimelinePosition);
    awardsTimelineStage.addEventListener("scroll", requestAwardsTimelineSync, { passive: true });

    if (awardsTimelineNextButton) {
      awardsTimelineNextButton.addEventListener("click", () => {
        stopAwardsTimelineAutoplay();
        shiftAwardsTimeline(1);
        startAwardsTimelineAutoplay();
      });
    }

    if (awardsTimelinePrevButton) {
      awardsTimelinePrevButton.addEventListener("click", () => {
        stopAwardsTimelineAutoplay();
        shiftAwardsTimeline(-1);
        startAwardsTimelineAutoplay();
      });
    }

    if ("ResizeObserver" in window) {
      const awardsTimelineResizeObserver = new ResizeObserver(() => {
        requestAwardsTimelineSync();
        startAwardsTimelineAutoplay();
      });

      awardsTimelineResizeObserver.observe(awardsTimelineStage);

      if (awardsTimelineTrack) {
        awardsTimelineResizeObserver.observe(awardsTimelineTrack);
      }
    }

    awardsTimeline.addEventListener("pointerenter", stopAwardsTimelineAutoplay);
    awardsTimeline.addEventListener("pointerleave", startAwardsTimelineAutoplay);
    awardsTimeline.addEventListener("focusin", stopAwardsTimelineAutoplay);
    awardsTimeline.addEventListener("focusout", (event) => {
      if (!awardsTimeline.contains(event.relatedTarget)) {
        startAwardsTimelineAutoplay();
      }
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopAwardsTimelineAutoplay();
        return;
      }

      startAwardsTimelineAutoplay();
    });

    window.addEventListener("load", resetAwardsTimelinePosition, { once: true });
    window.addEventListener("resize", requestAwardsTimelineSync);
    window.addEventListener("resize", startAwardsTimelineAutoplay);
    startAwardsTimelineAutoplay();
  };

  const scrollToHashTarget = () => {
    const { hash } = window.location;

    if (!hash) {
      return;
    }

    const rawTarget = document.querySelector(hash);

    if (!rawTarget) {
      return;
    }

    const yearValue = rawTarget.matches(".awards-page-year")
      ? rawTarget.querySelector(".awards-page-year-label")?.textContent?.trim()
      : "";
    const target = rawTarget.matches(".awards-page-year")
      ? document.querySelector(`.awards-page-card[data-award-year="${yearValue}"]`) || rawTarget.querySelector(".awards-page-card") || rawTarget
      : rawTarget;

    window.requestAnimationFrame(() => {
      target.scrollIntoView({
        block: "start",
        behavior: "auto"
      });
    });
  };

  const init = () => {
    initSharedHeader();
    initAwardsTimeline();
    enhanceAwardsArchive();
    initAwardsArchiveFilters();
    initTestimonialModals();
    scrollToHashTarget();
  };

  (window.sharedPartialsReady || Promise.resolve()).then(init);
})();
