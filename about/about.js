(() => {
  const resolveSitePath = typeof window.resolveSitePath === "function"
    ? window.resolveSitePath
    : (value) => value;
  const routes = {
    company: {
      path: resolveSitePath("/about/"),
      sectionId: "company",
      title: 'ГИНТ-М — О компании',
      description: 'История ГИНТ-М, структура управления, система качества, безопасность труда и экологическая ответственность компании.',
      label: 'О компании'
    },
    "organization-chart": {
      path: resolveSitePath("/about/organization-chart/"),
      sectionId: "organization-chart",
      title: 'ГИНТ-М — Структура компании',
      description: 'Организационная структура ГИНТ-М: управляющий партнер, департаменты и ключевые подразделения компании.',
      label: 'Структура'
    },
    "quality-control": {
      path: resolveSitePath("/about/quality-control/"),
      sectionId: "quality-control",
      title: 'ГИНТ-М — Система качества',
      description: 'Система качества ГИНТ-М: управление проектом, контроль этапов, гарантии и эксплуатационное сопровождение.',
      label: 'Качество'
    },
    "health-and-safety": {
      path: resolveSitePath("/about/health-and-safety/"),
      sectionId: "health-and-safety",
      title: 'ГИНТ-М — Охрана труда',
      description: 'Охрана труда в ГИНТ-М: безопасная среда, профилактика рисков и системное обучение сотрудников.',
      label: 'Безопасность'
    },
    "ecology-responsibilities": {
      path: resolveSitePath("/about/ecology-responsibilities/"),
      sectionId: "ecology-responsibilities",
      title: 'ГИНТ-М — Экология и защита окружающей среды',
      description: 'Экологическая ответственность ГИНТ-М: соблюдение норм, международная сертификация и развитие зеленого строительства.',
      label: 'Экология'
    }
  };

  const routeOrder = [
    routes.company,
    routes["organization-chart"],
    routes["quality-control"],
    routes["health-and-safety"],
    routes["ecology-responsibilities"]
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
    const contactTrigger = heroHeader.querySelector(".hero-top-cta");
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
        heroMenuToggle.setAttribute("aria-label", shouldOpenMenu ? "Р—Р°РєСЂС‹С‚СЊ РјРµРЅСЋ" : "РћС‚РєСЂС‹С‚СЊ РјРµРЅСЋ");
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

    if (contactTrigger && !document.getElementById("contact-modal")) {
      contactTrigger.href = "/#contact-cta";
      contactTrigger.removeAttribute("data-modal-open");
    }

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

  const initHistoryTimeline = () => {
    const timeline = document.querySelector("[data-history-timeline]");

    if (!timeline) {
      return;
    }

    const progressPath = timeline.querySelector(".about-history-progress");
    const items = Array.from(timeline.querySelectorAll("[data-history-item]"));
    let scrollTicking = false;

    const syncProgress = () => {
      const rect = timeline.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const traveled = viewportHeight * 0.68 - rect.top;
      const distance = rect.height + viewportHeight * 0.32;
      const progress = clamp(traveled / distance, 0, 1);

      timeline.style.setProperty("--about-history-progress", progress.toFixed(4));

      if (progressPath) {
        progressPath.style.strokeDashoffset = String(100 - (progress * 100));
      }
    };

    const requestSync = () => {
      if (scrollTicking) {
        return;
      }

      scrollTicking = true;
      window.requestAnimationFrame(() => {
        scrollTicking = false;
        syncProgress();
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-visible", entry.isIntersecting || entry.intersectionRatio >= 0.25);
        });
      },
      {
        threshold: [0.2, 0.35, 0.6],
        rootMargin: "0px 0px -12% 0px"
      }
    );

    items.forEach((item) => observer.observe(item));

    syncProgress();
    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", syncProgress);
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

    const historySection = document.getElementById("about-history");
    const routeLinks = Array.from(document.querySelectorAll("[data-about-nav]"));
    const historyLinks = Array.from(document.querySelectorAll('[data-about-scroll="history"]'));
    const navWrap = document.querySelector(".about-anchor-nav-wrap");
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

      breadcrumbCurrent.textContent = stateKey === "history"
        ? 'История компании'
        : routes[stateKey]?.label || routes.company.label;
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

      historyLinks.forEach((link) => {
        const isActive = stateKey === "history";
        link.classList.toggle("is-active", isActive);

        if (isActive) {
          link.setAttribute("aria-current", "location");
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

    const scrollToHistory = (historyMode = "push", behavior = prefersReducedMotion ? "auto" : "smooth") => {
      if (!historySection) {
        return;
      }

      syncRouteState("company", historyMode);
      setActiveNavState("history");
      isProgrammaticScroll = true;

      const top = Math.max(0, window.scrollY + historySection.getBoundingClientRect().top - getScrollOffset());
      window.scrollTo({ top, behavior });
      finishProgrammaticScroll();
    };

    const getCurrentStateFromScroll = () => {
      const marker = window.scrollY + getScrollOffset() + 24;
      const organizationSection = sectionElements.get("organization-chart");

      if (historySection && marker >= historySection.offsetTop && (!organizationSection || marker < organizationSection.offsetTop)) {
        return "history";
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

      if (nextState === "history") {
        if (activeKey !== "company") {
          syncRouteState("company", "replace");
        }

        setActiveNavState("history");
        return;
      }

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

      const historyLink = event.target.closest('[data-about-scroll="history"]');
      if (!historyLink) {
        return;
      }

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

      event.preventDefault();
      scrollToHistory("push");
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
    initAboutRoutes();
    initHistoryTimeline();
  };

  aboutReadyPromise.then(initAboutPage).catch((error) => {
    console.error("About page initialization failed.", error);
  });
})();