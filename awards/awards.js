(() => {
  const resolveSitePath = typeof window.resolveSitePath === "function"
    ? window.resolveSitePath
    : (value) => value;
  const heroMenuMediaQuery = window.matchMedia("(max-width: 980px)");
  const featuredAwardIds = new Set([
    "award-2025-natsproektstroy",
    "award-2021-avito-client-service",
    "award-2014-baring-vostok"
  ]);

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

  const enhanceAwardsArchive = () => {
    document.querySelectorAll(".awards-page-year").forEach((yearBlock) => {
      const year = yearBlock.querySelector(".awards-page-year-label")?.textContent?.trim();

      yearBlock.querySelectorAll(".awards-page-card").forEach((card) => {
        const media = card.querySelector(".awards-page-card-media");
        const bodyChildren = Array.from(card.children).filter((child) => !child.classList.contains("awards-page-card-media"));

        if (featuredAwardIds.has(card.id)) {
          card.classList.add("is-featured");
        }

        if (year) {
          card.dataset.awardYear = year;
        }

        if (media && year && !media.querySelector(".awards-page-card-badges")) {
          const badges = document.createElement("div");
          const typeChip = document.createElement("span");
          const yearChip = document.createElement("span");

          badges.className = "awards-page-card-badges";
          typeChip.className = "awards-page-card-chip";
          yearChip.className = "awards-page-card-chip";
          typeChip.textContent = "Награда";
          yearChip.textContent = year;
          badges.append(typeChip, yearChip);
          media.append(badges);
        }

        if (bodyChildren.length > 0 && !card.querySelector(".awards-page-card-body")) {
          const body = document.createElement("div");
          body.className = "awards-page-card-body";
          bodyChildren.forEach((child) => body.appendChild(child));
          card.appendChild(body);
        }
      });
    });
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

    const target = rawTarget.matches(".awards-page-year")
      ? rawTarget.querySelector(".awards-page-card") || rawTarget
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
    enhanceAwardsArchive();
    scrollToHashTarget();
  };

  (window.sharedPartialsReady || Promise.resolve()).then(init);
})();
