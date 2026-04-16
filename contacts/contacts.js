(() => {
  const resolveSitePath = typeof window.resolveSitePath === "function"
    ? window.resolveSitePath
    : (value) => value;
  const heroMenuMediaQuery = window.matchMedia("(max-width: 980px)");

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

    if (!heroHeader) {
      return;
    }

    const heroLogoImage = heroHeader.querySelector(".hero-logo img");
    const heroMenuToggle = heroHeader.querySelector(".hero-menu-toggle");
    const heroTopNav = heroHeader.querySelector(".hero-top-nav");
    const heroTopControls = heroHeader.querySelector(".hero-top-controls");
    const contactTrigger = heroHeader.querySelector(".hero-top-cta");
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
      document.body.classList.toggle("is-contacts-header-sticky", isSticky);
      syncHeroLogo(isSticky);
    };

    if (contactTrigger && !document.getElementById("contact-modal")) {
      contactTrigger.href = resolveSitePath("/contacts/#contacts-form");
      contactTrigger.removeAttribute("data-modal-open");
    }

    document.querySelectorAll('a[href$="/contacts/"]').forEach((link) => {
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

  const initFormState = () => {
    const messengerToggles = document.querySelectorAll("[data-messenger-toggle]");
    const messengerFields = Array.from(document.querySelectorAll("[data-messenger-field]")).reduce((fields, field) => {
      fields.set(field.dataset.messengerField, field);
      return fields;
    }, new Map());
    const phoneInput = document.querySelector("[data-phone-input]");
    const phoneMethodToggle = document.querySelector('[data-contact-method="phone"]');

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
        behavior: "auto"
      });
    });
  };

  const init = () => {
    initSharedHeader();
    initFormState();
    scrollToHashTarget();
  };

  (window.sharedPartialsReady || Promise.resolve()).then(init);
})();
