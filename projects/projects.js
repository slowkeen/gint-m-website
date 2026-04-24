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

    let normalized = value.replace(/index\.html$/i, "");

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
    const hasPageHero = Boolean(document.querySelector(".projects-page-hero"));

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
      const isSticky = !hasPageHero || window.scrollY > 56;

      if (isSticky === wasStickyState) {
        return;
      }

      wasStickyState = isSticky;
      heroHeader.classList.toggle("is-sticky", isSticky);
      syncHeroLogo(isSticky);
    };

    [".hero-top-nav a[href$=\"/projects/\"]", ".site-footer-menu a[href$=\"/projects/\"]"].forEach((selector) => {
      document.querySelectorAll(selector).forEach((link) => {
        try {
          const url = new URL(link.href, window.location.href);
          const linkPath = normalizePath(url.pathname);

          if (currentPath === linkPath || (linkPath !== "/" && currentPath.startsWith(linkPath))) {
            link.setAttribute("aria-current", "page");
          }
        } catch {
          // Ignore malformed URLs from partials.
        }
      });
    });

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
  };

  const initProjectsMasonry = () => {
    const projectsMasonry = document.querySelector(".projects-masonry");
    const projectCards = projectsMasonry ? Array.from(projectsMasonry.querySelectorAll(".project-photo-card")) : [];

    if (!projectsMasonry || projectCards.length === 0) {
      return;
    }

    const orderedProjectSlugs = [
      "kit-med",
      "skolkovo-park",
      "natsproektstroy",
      "restaurant-skolkovo-park",
      "ab-development",
      "krylatskie-holmy",
      "winline",
      "align",
      "avito-spb",
      "avito-spb-2021",
      "avito-cks",
      "international-bank",
      "avito-spb-2020",
      "snigeri-school",
      "align-technology",
      "bnp-paribas",
      "dell",
      "avito-moscow",
      "s7-airlines",
      "philip-morris",
      "skolkovo-vet",
      "samsung"
    ];
    const projectYearBySlug = new Map([
      ["kit-med", "2025"],
      ["skolkovo-park", "2025"],
      ["natsproektstroy", "2024"],
      ["restaurant-skolkovo-park", "2024"],
      ["ab-development", "2023"],
      ["krylatskie-holmy", "2023"],
      ["winline", "2022"],
      ["align", "2022"],
      ["avito-spb", "2021"],
      ["avito-spb-2021", "2021"],
      ["avito-cks", "2021"],
      ["international-bank", "2021"],
      ["avito-spb-2020", "2020"],
      ["snigeri-school", "2020"],
      ["align-technology", "2020"],
      ["bnp-paribas", "2020"],
      ["dell", "2020"],
      ["avito-moscow", "2020"],
      ["s7-airlines", "2019"],
      ["philip-morris", "2019"],
      ["skolkovo-vet", "2019"],
      ["samsung", "2018"]
    ]);
    const projectSortOrder = new Map(orderedProjectSlugs.map((slug, index) => [slug, index]));

    let projectMasonryFrame = null;
    let lastProjectMasonryWidth = 0;

    const getProjectSlug = (card) => {
      const link = card.querySelector(".project-photo-link");

      if (!link) {
        return "";
      }

      try {
        const url = new URL(link.href, window.location.href);
        return url.searchParams.get("slug") || "";
      } catch {
        return "";
      }
    };

    const ensureProjectYearBadge = (card, year) => {
      if (!year) {
        return;
      }

      const caption = card.querySelector(".project-photo-caption");
      const title = caption?.querySelector(".project-photo-name");

      if (!caption || !title) {
        return;
      }

      let heading = caption.querySelector(".project-photo-heading");

      if (!heading) {
        heading = document.createElement("div");
        heading.className = "project-photo-heading";
        caption.prepend(heading);
      }

      if (!heading.contains(title)) {
        heading.prepend(title);
      }

      let badge = heading.querySelector(".project-photo-year");

      if (!badge) {
        const existingBadge = caption.querySelector(".project-photo-year");
        badge = document.createElement("span");
        badge.className = "project-photo-year";
        (existingBadge || badge).replaceWith(badge);
        heading.append(badge);
      } else if (!heading.contains(badge)) {
        heading.append(badge);
      }

      badge.textContent = year;
      badge.setAttribute("aria-label", `Год реализации ${year}`);
      card.dataset.projectYear = year;

      const legacyMeta = caption.querySelector(".project-photo-meta");

      if (legacyMeta) {
        legacyMeta.remove();
      }
    };

    const syncProjectCards = () => {
      const orderedCards = projectCards
        .map((card, index) => {
          const slug = getProjectSlug(card);
          const year = projectYearBySlug.get(slug) || "";
          const yearValue = Number.parseInt(year, 10) || 0;

          ensureProjectYearBadge(card, year);

          return {
            card,
            index,
            yearValue,
            sortIndex: projectSortOrder.get(slug) ?? Number.MAX_SAFE_INTEGER
          };
        })
        .sort((left, right) => (
          right.yearValue - left.yearValue
          || left.sortIndex - right.sortIndex
          || left.index - right.index
        ));

      orderedCards.forEach(({ card }) => {
        projectsMasonry.append(card);
      });

      projectCards.splice(0, projectCards.length, ...orderedCards.map(({ card }) => card));
    };

    syncProjectCards();

    const resetProjectMasonryCardStyles = (card) => {
      card.style.removeProperty("width");
      card.style.removeProperty("left");
      card.style.removeProperty("top");
    };

    const disableProjectMasonry = () => {
      projectsMasonry.classList.remove("is-enhanced");
      projectsMasonry.style.removeProperty("height");
      projectCards.forEach(resetProjectMasonryCardStyles);
    };

    const getProjectColumnCount = () => {
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
      const styles = window.getComputedStyle(projectsMasonry);
      const explicitGap = resolveProjectLength(styles.getPropertyValue("--projects-gap"));
      const columnGap = Number.parseFloat(styles.columnGap);

      if (Number.isFinite(explicitGap)) {
        return explicitGap;
      }

      return Number.isFinite(columnGap) ? columnGap : 0;
    };

    const layoutProjectMasonry = () => {
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
      if (projectMasonryFrame) {
        window.cancelAnimationFrame(projectMasonryFrame);
      }

      projectMasonryFrame = window.requestAnimationFrame(() => {
        projectMasonryFrame = null;
        layoutProjectMasonry();
      });
    };

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

    window.addEventListener("load", requestProjectMasonryLayout);
    window.addEventListener("resize", requestProjectMasonryLayout);
    requestProjectMasonryLayout();
  };

  const scrollToHashTarget = () => {
    const { hash } = window.location;

    if (!hash) {
      return;
    }

    const target = document.querySelector(hash);

    if (!target) {
      return;
    }

    window.requestAnimationFrame(() => {
      target.scrollIntoView({
        block: "start",
        behavior: prefersReducedMotion ? "auto" : "auto"
      });
    });
  };

  const init = () => {
    initSharedHeader();
    initProjectsMasonry();
    scrollToHashTarget();
  };

  (window.sharedPartialsReady || Promise.resolve()).then(init);
})();

