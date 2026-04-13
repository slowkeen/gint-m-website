const SHARED_PARTIALS_SCRIPT_SUFFIX = "/scripts/shared-partials.js";

const getSiteRootPath = () => {
  const currentScript = document.currentScript;

  if (!currentScript?.src) {
    return "";
  }

  try {
    const scriptUrl = new URL(currentScript.src, window.location.href);
    const normalizedPathname = scriptUrl.pathname.replace(/\/+/g, "/");

    if (!normalizedPathname.endsWith(SHARED_PARTIALS_SCRIPT_SUFFIX)) {
      return "";
    }

    const rootPath = normalizedPathname.slice(0, -SHARED_PARTIALS_SCRIPT_SUFFIX.length);
    return rootPath === "/" ? "" : rootPath.replace(/\/$/, "");
  } catch {
    return "";
  }
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
  const basePath = siteRootPath.replace(/\/$/, "");
  const targetPath = pathname === "/" ? `${basePath}/` : `${basePath}${pathname}`;

  return `${targetPath.replace(/\/+/g, "/")}${search}${hash}`;
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
window.sharedPartialsReady = loadPartials().then(() => {
  rewriteRootRelativeAttributes(document);
  bindImageFallbacks(document);
  document.dispatchEvent(new CustomEvent("site:partials-ready"));
});
window.sharedPartialsReady.catch((error) => {
  console.error("Shared partials failed to load.", error);
});