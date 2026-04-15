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
        return "";
      }

      try {
        const partialUrl = new URL(partialPath, window.location.href);
        const normalizedPathname = normalizePathname(partialUrl.pathname);
        const partialMarkerIndex = normalizedPathname.lastIndexOf("/partials/");

        if (partialMarkerIndex < 0) {
          return "";
        }

        return normalizeRootPath(normalizedPathname.slice(0, partialMarkerIndex));
      } catch {
        return "";
      }
    })
    .filter(Boolean)
    .sort((left, right) => left.length - right.length);

  return rootCandidates[0] || "";
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

const getSiteRootPath = () => getSiteRootPathFromPartials() || getSiteRootPathFromScript();

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
    "data-fallback-src"
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