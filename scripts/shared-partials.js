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
    const response = await fetch(partialPath, { credentials: "same-origin", cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to load partial: " + partialPath);
    }
    const template = document.createElement("template");
    template.innerHTML = (await response.text()).trim();
    placeholder.replaceWith(template.content);
  }));
  await loadPartials();
};
window.sharedPartialsReady = loadPartials().then(() => {
  document.dispatchEvent(new CustomEvent("site:partials-ready"));
});
window.sharedPartialsReady.catch((error) => {
  console.error("Shared partials failed to load.", error);
});