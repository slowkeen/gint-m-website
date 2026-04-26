const SHARED_PARTIALS_SCRIPT_SUFFIX = "/scripts/shared-partials.js";

const normalizePathname = (value = "") => value.replace(/\/+/g, "/");

const normalizeRootPath = (value = "") => {
  const normalizedValue = normalizePathname(value || "");
  return normalizedValue === "/" ? "" : normalizedValue.replace(/\/$/, "");
};

const getSharedPartialsScriptUrl = () => {
  const scriptCandidates = [
    document.currentScript,
    ...Array.from(document.scripts || [])
  ].filter(Boolean);

  for (const script of scriptCandidates) {
    if (!script?.src) {
      continue;
    }

    try {
      const scriptUrl = new URL(script.src, window.location.href);
      const normalizedPathname = normalizePathname(scriptUrl.pathname);

      if (normalizedPathname.endsWith(SHARED_PARTIALS_SCRIPT_SUFFIX)) {
        return scriptUrl;
      }
    } catch {
      // Ignore malformed script URLs and continue with the next candidate.
    }
  }

  return null;
};

const getSiteRootPathFromPartials = () => {
  const partialPlaceholders = Array.from(document.querySelectorAll("[data-site-partial]"));
  const rootCandidates = partialPlaceholders
    .map((placeholder) => {
      const partialPath = placeholder.dataset.sitePartial;

      if (!partialPath) {
        return null;
      }

      try {
        const partialUrl = new URL(partialPath, window.location.href);
        const normalizedPathname = normalizePathname(partialUrl.pathname);
        const partialMarkerIndex = normalizedPathname.lastIndexOf("/partials/");

        if (partialMarkerIndex < 0) {
          return null;
        }

        return normalizeRootPath(normalizedPathname.slice(0, partialMarkerIndex));
      } catch {
        return null;
      }
    })
    .filter((value) => value !== null)
    .sort((left, right) => left.length - right.length);

  return rootCandidates.length ? rootCandidates[0] : null;
};

const getSiteRootPathFromScript = () => {
  const sharedPartialsScriptUrl = getSharedPartialsScriptUrl();

  if (!sharedPartialsScriptUrl) {
    return "";
  }

  try {
    const normalizedPathname = normalizePathname(sharedPartialsScriptUrl.pathname);
    const rootPath = normalizedPathname.slice(0, -SHARED_PARTIALS_SCRIPT_SUFFIX.length);
    return normalizeRootPath(rootPath);
  } catch {
    return "";
  }
};

const getSiteRootPath = () => {
  const rootPathFromPartials = getSiteRootPathFromPartials();
  return rootPathFromPartials === null ? getSiteRootPathFromScript() : rootPathFromPartials;
};

const siteRootPath = getSiteRootPath();

const resolveSitePath = (value = "/") => {
  if (typeof value !== "string" || !value.startsWith("/")) {
    return value;
  }

  const match = value.match(/^([^?#]*)(\?[^#]*)?(#.*)?$/);

  if (!match) {
    return value;
  }

  const [, pathname, search = "", hash = ""] = match;
  const basePath = normalizeRootPath(siteRootPath);

  if (
    basePath
    && (
      pathname === basePath
      || pathname === `${basePath}/`
      || pathname.startsWith(`${basePath}/`)
    )
  ) {
    return `${normalizePathname(pathname)}${search}${hash}`;
  }

  const targetPath = pathname === "/" ? `${basePath}/` : `${basePath}${pathname}`;
  return `${normalizePathname(targetPath)}${search}${hash}`;
};

const rewriteRootRelativeAttributes = (root = document) => {
  const attributeNames = [
    "href",
    "src",
    "poster",
    "data-default-logo",
    "data-sticky-logo",
    "data-fallback-src",
    "data-site-partial"
  ];

  attributeNames.forEach((attributeName) => {
    root.querySelectorAll(`[${attributeName}]`).forEach((element) => {
      const currentValue = element.getAttribute(attributeName);

      if (!currentValue?.startsWith("/")) {
        return;
      }

      element.setAttribute(attributeName, resolveSitePath(currentValue));
    });
  });
};

const bindRootRelativeLinkGuard = () => {
  if (document.documentElement.dataset.rootRelativeLinkGuard === "true") {
    return;
  }

  document.documentElement.dataset.rootRelativeLinkGuard = "true";
  document.addEventListener("click", (event) => {
    const target = event.target;
    const anchor = target instanceof Element ? target.closest("a[href]") : null;

    if (!anchor) {
      return;
    }

    const currentValue = anchor.getAttribute("href");

    if (!currentValue?.startsWith("/")) {
      return;
    }

    const resolvedValue = resolveSitePath(currentValue);

    if (!resolvedValue || resolvedValue === currentValue) {
      return;
    }

    anchor.setAttribute("href", resolvedValue);

    if (
      event.defaultPrevented
      || event.button !== 0
      || event.metaKey
      || event.ctrlKey
      || event.shiftKey
      || event.altKey
      || anchor.target === "_blank"
      || anchor.hasAttribute("download")
    ) {
      return;
    }

    event.preventDefault();
    window.location.assign(resolvedValue);
  }, true);
};

const bindImageFallbacks = (root = document) => {
  root.querySelectorAll("img[data-fallback-src]").forEach((image) => {
    if (image.dataset.fallbackBound === "true") {
      return;
    }

    image.dataset.fallbackBound = "true";
    image.addEventListener("error", () => {
      const fallbackSrc = image.getAttribute("data-fallback-src");

      if (!fallbackSrc || image.dataset.fallbackApplied === "true") {
        return;
      }

      image.dataset.fallbackApplied = "true";
      image.setAttribute("src", fallbackSrc);
    });
  });
};

const COOKIE_CONSENT_STORAGE_KEY = "gintm-cookie-consent";
const COOKIE_CONSENT_STATES = new Set(["accepted", "dismissed"]);

const readCookieConsentState = () => {
  try {
    const value = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    return COOKIE_CONSENT_STATES.has(value) ? value : null;
  } catch {
    return null;
  }
};

const writeCookieConsentState = (value) => {
  if (!COOKIE_CONSENT_STATES.has(value)) {
    return null;
  }

  try {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, value);
  } catch {
    // Ignore storage failures and continue with in-memory state only.
  }

  document.documentElement.dataset.cookieConsent = value;
  window.dispatchEvent(new CustomEvent("site:cookie-consent-changed", {
    detail: {
      state: value
    }
  }));

  return value;
};

const syncCookieConsentDataset = () => {
  const state = readCookieConsentState();
  document.documentElement.dataset.cookieConsent = state || "pending";
  return state;
};

const createCookieConsentBanner = () => {
  const banner = document.createElement("section");
  banner.className = "cookie-consent";
  banner.hidden = true;
  banner.setAttribute("aria-hidden", "true");
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-label", "Уведомление об использовании cookie");
  banner.setAttribute("aria-live", "polite");

  /*
  banner.innerHTML = `
    <button class="cookie-consent-close" type="button" aria-label="Закрыть уведомление о cookie">
      <span aria-hidden="true">&times;</span>
    </button>
    <h2 class="cookie-consent-title" id="cookie-consent-title">Мы используем cookie</h2>
    <p class="cookie-consent-text">
      Сайт использует cookie и технические данные браузера для корректной работы страниц,
      запоминания вашего выбора и улучшения сервиса.
    </p>
    <div class="cookie-consent-actions">
      <a class="cookie-consent-link" href="${resolveSitePath("/privacy/")}">Подробнее</a>
      <button class="cookie-consent-accept" type="button">Принять</button>
    </div>
  `;
  */

  banner.innerHTML = `
    <p class="cookie-consent-text">
      Мы обрабатываем cookies, чтобы сделать наш сайт удобнее и персонализированнее для вас.
      Подробнее:
      <a class="cookie-consent-link" href="${resolveSitePath("/privacy/")}#cookies">политика использования cookies</a>
      и
      <a class="cookie-consent-link" href="${resolveSitePath("/privacy/")}#data">защита данных</a>.
    </p>
    <button class="cookie-consent-accept" type="button">Принять</button>
  `;

  return banner;
};

const initCookieConsent = () => {
  if (!document.body || document.documentElement.dataset.cookieConsentInit === "true") {
    syncCookieConsentDataset();
    return;
  }

  document.documentElement.dataset.cookieConsentInit = "true";
  const currentState = syncCookieConsentDataset();

  window.siteCookieConsent = {
    getState: () => readCookieConsentState(),
    hasAccepted: () => readCookieConsentState() === "accepted"
  };

  if (currentState) {
    return;
  }

  const banner = createCookieConsentBanner();
  const acceptButton = banner.querySelector(".cookie-consent-accept");

  const hideBanner = (nextState) => {
    if (nextState) {
      writeCookieConsentState(nextState);
    }

    banner.classList.remove("is-visible");
    banner.setAttribute("aria-hidden", "true");

    window.setTimeout(() => {
      banner.hidden = true;
    }, 220);
  };

  acceptButton?.addEventListener("click", () => {
    hideBanner("accepted");
  });

  document.body.appendChild(banner);

  window.requestAnimationFrame(() => {
    banner.hidden = false;
    banner.setAttribute("aria-hidden", "false");
    window.requestAnimationFrame(() => {
      banner.classList.add("is-visible");
    });
  });
};

const loadPartials = async () => {
  const partialPlaceholders = Array.from(document.querySelectorAll("[data-site-partial]"));

  if (!partialPlaceholders.length) {
    return;
  }

  await Promise.all(partialPlaceholders.map(async (placeholder) => {
    const partialPath = placeholder.dataset.sitePartial;

    if (!partialPath) {
      return;
    }

    const requestPath = partialPath.startsWith("/") ? resolveSitePath(partialPath) : partialPath;
    const response = await fetch(requestPath, { credentials: "same-origin", cache: "no-store" });

    if (!response.ok) {
      throw new Error("Failed to load partial: " + requestPath);
    }

    const template = document.createElement("template");
    template.innerHTML = (await response.text()).trim();
    rewriteRootRelativeAttributes(template.content);
    bindImageFallbacks(template.content);
    placeholder.replaceWith(template.content);
  }));

  await loadPartials();
};

window.siteRootPath = siteRootPath;
window.resolveSitePath = resolveSitePath;
bindRootRelativeLinkGuard();
window.sharedPartialsReady = loadPartials().then(() => {
  rewriteRootRelativeAttributes(document);
  bindImageFallbacks(document);
  document.dispatchEvent(new CustomEvent("site:partials-ready"));
});
window.sharedPartialsReady.catch((error) => {
  console.error("Shared partials failed to load.", error);
});
window.sharedPartialsReady
  .then(() => {
    initCookieConsent();
  })
  .catch(() => {
    initCookieConsent();
  });
