(() => {
  const resolveSitePath = typeof window.resolveSitePath === "function"
    ? window.resolveSitePath
    : (value) => value;
  const routes = {
    company: {
      path: resolveSitePath("/about/"),
      sectionId: "company",
      title: "ГИНТ-М — О компании",
      description: "ГИНТ-М: структура компании, система качества и охрана труда.",
      label: "О компании"
    },
    "organization-chart": {
      path: resolveSitePath("/about/organization-chart/"),
      sectionId: "organization-chart",
      title: "ГИНТ-М — Структура компании",
      description: "Организационная структура ГИНТ-М: управляющий партнер, департаменты и ключевые подразделения компании.",
      label: "Структура"
    },
    "quality-control": {
      path: resolveSitePath("/about/quality-control/"),
      sectionId: "quality-control",
      title: "ГИНТ-М — Система качества",
      description: "Система качества ГИНТ-М: управление проектом, контроль этапов, гарантии и эксплуатационное сопровождение.",
      label: "Качество"
    },
    "health-and-safety": {
      path: resolveSitePath("/about/health-and-safety/"),
      sectionId: "health-and-safety",
      title: "ГИНТ-М — Охрана труда",
      description: "Охрана труда в ГИНТ-М: безопасная среда, профилактика рисков и системное обучение сотрудников.",
      label: "Безопасность"
    }
  };

  const routeOrder = [
    routes.company,
    routes["organization-chart"],
    routes["quality-control"],
    routes["health-and-safety"]
  ];

  const pathMap = new Map();
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const heroMenuMediaQuery = window.matchMedia("(max-width: 980px)");
  const aboutReadyPromise = window.sharedPartialsReady || Promise.resolve();

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const normalizePath = (value) => {
    if (!value) {
      return "/";
    }

    let normalized = value.replace(/index\.html$/i, "");

    if (!normalized.startsWith("/")) {
      normalized = `/${normalized}`;
    }

    if (!normalized.endsWith("/")) {
      normalized = `${normalized}/`;
    }

    return normalized.replace(/\/+/g, "/");
  };

  Object.entries(routes).forEach(([key, route]) => {
    pathMap.set(normalizePath(route.path), key);
    pathMap.set(normalizePath(route.path.slice(0, -1)), key);
  });

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
      return null;
    }

    const heroLogoImage = heroHeader.querySelector(".hero-logo img");
    const heroMenuToggle = heroHeader.querySelector(".hero-menu-toggle");
    const heroTopNav = heroHeader.querySelector(".hero-top-nav");
    const heroTopControls = heroHeader.querySelector(".hero-top-controls");
    const aboutNavLink = heroHeader.querySelector('.hero-top-nav a[href$="/about/"]');
    const footerAboutLink = document.querySelector('.site-footer-menu a[href$="/about/"]');
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
      const isSticky = window.scrollY > 56;

      if (isSticky === wasStickyState) {
        return;
      }

      wasStickyState = isSticky;
      heroHeader.classList.toggle("is-sticky", isSticky);
      document.body.classList.toggle("is-about-header-sticky", isSticky);
      syncHeroLogo(isSticky);
    };

    if (aboutNavLink) {
      aboutNavLink.setAttribute("aria-current", "page");
    }

    if (footerAboutLink) {
      footerAboutLink.setAttribute("aria-current", "page");
    }

    heroMenuToggle?.addEventListener("click", toggleHeroMenu);

    [heroTopNav, heroTopControls].forEach((group) => {
      group?.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          closeHeroMenu();
        });
      });
    });

    window.addEventListener("scroll", updateStickyHeader, { passive: true });
    window.addEventListener("load", updateStickyHeader);
    window.addEventListener("hashchange", updateStickyHeader);

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

    return heroHeader;
  };

  const initOverviewReveal = () => {
    const revealItems = Array.from(document.querySelectorAll("[data-about-reveal]"));

    if (!revealItems.length) {
      return;
    }

    if (prefersReducedMotion || typeof IntersectionObserver !== "function") {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && entry.intersectionRatio < 0.24) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: [0.18, 0.35, 0.6],
        rootMargin: "0px 0px -10% 0px"
      }
    );

    revealItems.forEach((item) => observer.observe(item));
  };

  const initClientsSlider = () => {
    const slider = document.querySelector("[data-about-clients]");
    const section = slider ? slider.closest(".about-clients-block") : null;
    const track = slider ? slider.querySelector("[data-about-clients-track]") : null;
    const prevButton = section ? section.querySelector('[data-about-clients-nav="prev"]') : null;
    const nextButton = section ? section.querySelector('[data-about-clients-nav="next"]') : null;

    if (!slider || !track) {
      return;
    }

    const buildRotatedPages = () => {
      const sourcePages = Array.from(track.querySelectorAll("[data-about-clients-page]"));

      if (sourcePages.length !== 1) {
        return sourcePages;
      }

      const sourceGrid = sourcePages[0].querySelector(".about-clients-grid");
      const sourceCards = sourceGrid ? Array.from(sourceGrid.children) : [];
      const cardsPerRow = 6;

      if (sourceCards.length <= cardsPerRow || sourceCards.length % cardsPerRow !== 0) {
        return sourcePages;
      }

      const rowCount = sourceCards.length / cardsPerRow;

      if (rowCount < 2) {
        return sourcePages;
      }

      const rows = Array.from({ length: rowCount }, (_, index) => {
        const start = index * cardsPerRow;
        return sourceCards.slice(start, start + cardsPerRow);
      });

      const fragment = document.createDocumentFragment();

      rows.forEach((_, rotation) => {
        const page = document.createElement("div");
        const grid = document.createElement("div");

        page.className = `about-clients-page${rotation === 0 ? " is-active" : ""}`;
        page.dataset.aboutClientsPage = String(rotation);

        if (rotation !== 0) {
          page.setAttribute("aria-hidden", "true");
        }

        grid.className = "about-clients-grid";

        rows.forEach((__, rowIndex) => {
          const row = rows[(rotation + rowIndex) % rows.length];

          row.forEach((card) => {
            grid.append(card.cloneNode(true));
          });
        });

        page.append(grid);
        fragment.append(page);
      });

      track.replaceChildren(fragment);
      return Array.from(track.querySelectorAll("[data-about-clients-page]"));
    };

    const pages = buildRotatedPages();
    const pageCount = pages.length;
    let slides = pages;
    let slideIndex = pageCount > 1 ? 1 : 0;
    let isAnimating = false;
    let autoplayId = 0;
    let normalizeTimeoutId = 0;

    if (!pages.length) {
      return;
    }

    if (pageCount > 1) {
      const firstClone = pages[0].cloneNode(true);
      const lastClone = pages[pageCount - 1].cloneNode(true);

      firstClone.dataset.aboutClientsClone = "first";
      lastClone.dataset.aboutClientsClone = "last";
      firstClone.setAttribute("aria-hidden", "true");
      lastClone.setAttribute("aria-hidden", "true");

      track.prepend(lastClone);
      track.append(firstClone);
      slides = Array.from(track.children);
    }

    const syncButtons = () => {
      if (prevButton) {
        prevButton.disabled = pageCount < 2;
      }

      if (nextButton) {
        nextButton.disabled = pageCount < 2;
      }
    };

    const getActivePageIndex = () => {
      if (pageCount < 2) {
        return 0;
      }

      if (slideIndex === 0) {
        return pageCount - 1;
      }

      if (slideIndex === slides.length - 1) {
        return 0;
      }

      return slideIndex - 1;
    };

    const syncSlider = (animate = true) => {
      const useAnimation = animate && !prefersReducedMotion;
      const activePageIndex = getActivePageIndex();

      track.style.transitionDuration = useAnimation ? "720ms" : "0ms";
      track.style.transitionTimingFunction = useAnimation ? "var(--ease-out-soft)" : "linear";
      track.style.transform = `translate3d(-${slideIndex * 100}%, 0, 0)`;

      pages.forEach((page, index) => {
        const isActive = index === activePageIndex;

        page.classList.toggle("is-active", isActive);
        page.hidden = false;
        page.setAttribute("aria-hidden", String(!isActive));

        if ("inert" in page) {
          page.inert = !isActive;
        }
      });

      slides.forEach((page, index) => {
        const isClone = page.hasAttribute("data-about-clients-clone");
        const isActive = index === slideIndex;

        page.setAttribute("aria-hidden", String(!isActive || isClone));

        if ("inert" in page) {
          page.inert = !isActive || isClone;
        }
      });

      syncButtons();
    };

    const clearNormalizeTimeout = () => {
      if (normalizeTimeoutId === 0) {
        return;
      }

      window.clearTimeout(normalizeTimeoutId);
      normalizeTimeoutId = 0;
    };

    const normalizeLoop = () => {
      clearNormalizeTimeout();

      if (pageCount < 2) {
        isAnimating = false;
        return;
      }

      if (slideIndex === 0) {
        slideIndex = pageCount;
        syncSlider(false);
      } else if (slideIndex === slides.length - 1) {
        slideIndex = 1;
        syncSlider(false);
      }

      isAnimating = false;
    };

    const showPage = (direction) => {
      if (pageCount < 2 || isAnimating) {
        syncButtons();
        return;
      }

      slideIndex += direction;

      if (prefersReducedMotion) {
        if (slideIndex === 0) {
          slideIndex = pageCount;
        } else if (slideIndex === slides.length - 1) {
          slideIndex = 1;
        }

        syncSlider(false);
        return;
      }

      isAnimating = true;
      syncSlider(true);
      clearNormalizeTimeout();
      normalizeTimeoutId = window.setTimeout(() => {
        normalizeLoop();
      }, 900);
    };

    const stopAutoplay = () => {
      if (autoplayId === 0) {
        return;
      }

      window.clearInterval(autoplayId);
      autoplayId = 0;
    };

    const startAutoplay = () => {
      stopAutoplay();

      if (pageCount < 2) {
        return;
      }

      autoplayId = window.setInterval(() => {
        showPage(1);
      }, 3000);
    };

    const shiftPage = (direction) => {
      showPage(direction);
      startAutoplay();
    };

    prevButton?.addEventListener("click", () => {
      shiftPage(-1);
    });

    nextButton?.addEventListener("click", () => {
      shiftPage(1);
    });

    slider.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        shiftPage(-1);
      }

      if (event.key === "ArrowRight") {
        shiftPage(1);
      }
    });

    track.addEventListener("transitionend", (event) => {
      if (event.propertyName !== "transform") {
        return;
      }

      normalizeLoop();
    });

    section?.addEventListener("pointerenter", stopAutoplay);
    section?.addEventListener("pointerleave", startAutoplay);
    section?.addEventListener("focusin", stopAutoplay);
    section?.addEventListener("focusout", (event) => {
      if (!section.contains(event.relatedTarget)) {
        startAutoplay();
      }
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopAutoplay();
        return;
      }

      startAutoplay();
    });

    window.addEventListener("resize", () => {
      clearNormalizeTimeout();
      isAnimating = false;
      syncSlider(false);
    });

    syncSlider(false);
    startAutoplay();
  };

  const initCertificateModal = () => {
    const modal = document.getElementById("about-certificate-modal");
    const triggers = Array.from(document.querySelectorAll("[data-certificate-open]"));

    if (!modal || !triggers.length) {
      return;
    }

    const modalImage = modal.querySelector(".about-certificate-modal-image");
    const modalTitle = modal.querySelector("#about-certificate-modal-title");
    const closeButton = modal.querySelector(".about-certificate-modal-close");
    const closers = Array.from(modal.querySelectorAll("[data-certificate-close]"));
    let lastTrigger = null;

    const closeModal = () => {
      if (modal.hidden) {
        return;
      }

      modal.hidden = true;
      document.body.classList.remove("modal-open");

      if (modalImage) {
        modalImage.removeAttribute("src");
        modalImage.alt = "";
      }

      if (modalTitle) {
        modalTitle.textContent = "Полный размер сертификата";
      }

      lastTrigger?.focus();
      lastTrigger = null;
    };

    const openModal = (trigger) => {
      const src = trigger.dataset.certificateSrc;

      if (!src || !modalImage) {
        return;
      }

      lastTrigger = trigger;
      modalImage.src = src;
      modalImage.alt = trigger.dataset.certificateAlt || trigger.querySelector("img")?.alt || "";

      if (modalTitle) {
        modalTitle.textContent = trigger.dataset.certificateTitle
          ? `Полный размер сертификата ${trigger.dataset.certificateTitle}`
          : modalImage.alt || "Полный размер сертификата";
      }

      modal.hidden = false;
      document.body.classList.add("modal-open");

      window.requestAnimationFrame(() => {
        closeButton?.focus();
      });
    };

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", (event) => {
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }

        openModal(trigger);
      });
    });

    closers.forEach((closer) => {
      closer.addEventListener("click", closeModal);
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !modal.hidden) {
        event.preventDefault();
        closeModal();
      }
    });
  };

  const initAboutRoutes = () => {
    const sectionElements = new Map(
      routeOrder
        .map((route) => [route.sectionId, document.getElementById(route.sectionId)])
        .filter((entry) => Boolean(entry[1]))
    );

    if (!sectionElements.size) {
      return;
    }

    const certificationsSection = document.querySelector("[data-about-certifications]");
    const routeLinks = Array.from(document.querySelectorAll("[data-about-nav]"));
    const heroHeader = document.querySelector(".hero-top");
    const breadcrumbCurrent = document.querySelector("[data-about-breadcrumb-current]");
    const metaDescription = document.querySelector('meta[name="description"]');
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    let activeKey = null;
    let activeNavState = null;
    let programmaticScrollTimer = null;
    let isProgrammaticScroll = false;
    let scrollTicking = false;

    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }

    const resolveRouteKey = () => {
      const keyFromPath = pathMap.get(normalizePath(window.location.pathname));
      if (keyFromPath) {
        return keyFromPath;
      }

      const fallbackKey = document.body.dataset.aboutRoute;
      return routes[fallbackKey] ? fallbackKey : "company";
    };

    const getScrollOffset = () => {
      const headerHeight = heroHeader ? heroHeader.offsetHeight + 18 : 0;
      return headerHeight + 18;
    };

    const syncMetadata = (key) => {
      const route = routes[key];
      if (!route) {
        return;
      }

      document.title = route.title;

      if (metaDescription) {
        metaDescription.setAttribute("content", route.description);
      }

      canonicalLink.setAttribute("href", `https://www.gint-m.ru${route.path}`);
    };

    const syncBreadcrumbState = (stateKey) => {
      if (!breadcrumbCurrent) {
        return;
      }

      breadcrumbCurrent.textContent = routes[stateKey]?.label || routes.company.label;
    };

    const syncNavState = (stateKey) => {
      routeLinks.forEach((link) => {
        const isActive = link.dataset.aboutNav === stateKey;
        link.classList.toggle("is-active", isActive);

        if (isActive) {
          link.setAttribute("aria-current", "page");
        } else {
          link.removeAttribute("aria-current");
        }
      });

      syncBreadcrumbState(stateKey);
    };

    const setActiveNavState = (stateKey) => {
      if (activeNavState === stateKey) {
        return;
      }

      activeNavState = stateKey;
      syncNavState(stateKey);
    };

    const syncRouteState = (key, historyMode = "replace") => {
      const route = routes[key];
      if (!route) {
        return;
      }

      const nextPath = route.path;
      const currentPath = normalizePath(window.location.pathname);

      if (historyMode === "push" && currentPath !== nextPath) {
        window.history.pushState({ aboutKey: key }, "", nextPath);
      } else if (historyMode === "replace" && currentPath !== nextPath) {
        window.history.replaceState({ aboutKey: key }, "", nextPath);
      }

      activeKey = key;
      syncMetadata(key);
    };

    const finishProgrammaticScroll = () => {
      if (programmaticScrollTimer) {
        window.clearTimeout(programmaticScrollTimer);
      }

      programmaticScrollTimer = window.setTimeout(() => {
        isProgrammaticScroll = false;
      }, prefersReducedMotion ? 120 : 720);
    };

    const scrollToRoute = (key, historyMode = "push", behavior = prefersReducedMotion ? "auto" : "smooth") => {
      const route = routes[key];
      if (!route) {
        return;
      }

      syncRouteState(key, historyMode);
      setActiveNavState(key);
      isProgrammaticScroll = true;

      const target = sectionElements.get(route.sectionId);

      if (key === "company" && !target) {
        window.scrollTo({ top: 0, behavior });
        finishProgrammaticScroll();
        return;
      }
      if (!target) {
        isProgrammaticScroll = false;
        return;
      }

      const top = Math.max(0, window.scrollY + target.getBoundingClientRect().top - getScrollOffset());
      window.scrollTo({ top, behavior });
      finishProgrammaticScroll();
    };

    const getCurrentStateFromScroll = () => {
      const marker = window.scrollY + getScrollOffset() + 24;
      const qualitySection = sectionElements.get("quality-control");
      const safetySection = sectionElements.get("health-and-safety");

      if (
        certificationsSection &&
        qualitySection &&
        safetySection &&
        Math.abs(qualitySection.offsetTop - safetySection.offsetTop) < 24
      ) {
        const certificatesTop = Math.min(qualitySection.offsetTop, safetySection.offsetTop);
        const certificatesBottom = certificationsSection.offsetTop + certificationsSection.offsetHeight;

        if (marker >= certificatesTop && marker < certificatesBottom) {
          return activeKey === "health-and-safety" || activeNavState === "health-and-safety"
            ? "health-and-safety"
            : "quality-control";
        }
      }

      let currentKey = "company";

      for (const route of routeOrder.slice(1)) {
        const section = sectionElements.get(route.sectionId);
        if (!section) {
          continue;
        }

        if (marker >= section.offsetTop) {
          currentKey = pathMap.get(normalizePath(route.path)) || currentKey;
        }
      }

      return currentKey;
    };

    const syncFromScroll = () => {
      scrollTicking = false;

      if (isProgrammaticScroll) {
        return;
      }

      const nextState = getCurrentStateFromScroll();

      if (nextState !== activeKey) {
        syncRouteState(nextState, "replace");
      }

      setActiveNavState(nextState);
    };

    document.addEventListener("click", (event) => {
      const routeLink = event.target.closest("[data-about-nav]");
      if (routeLink) {
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }

        const key = routeLink.dataset.aboutNav;
        if (!routes[key]) {
          return;
        }

        event.preventDefault();
        scrollToRoute(key, "push");
        return;
      }
    });

    window.addEventListener(
      "scroll",
      () => {
        if (scrollTicking) {
          return;
        }

        scrollTicking = true;
        window.requestAnimationFrame(syncFromScroll);
      },
      { passive: true }
    );

    window.addEventListener("popstate", () => {
      const key = resolveRouteKey();
      scrollToRoute(key, "replace", "auto");
    });

    const initialKey = resolveRouteKey();
    syncRouteState(initialKey, "replace");
    setActiveNavState(initialKey);

    if (initialKey !== "company") {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          scrollToRoute(initialKey, "replace", "auto");
        });
      });
    }
  };

  const initAboutPage = () => {
    initSharedHeader();
    initOverviewReveal();
    initClientsSlider();
    initAboutRoutes();
    initCertificateModal();
  };

  aboutReadyPromise.then(initAboutPage).catch((error) => {
    console.error("About page initialization failed.", error);
  });
})();

