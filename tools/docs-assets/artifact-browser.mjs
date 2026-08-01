function selectFile(browser, fileId) {
  const template = document.getElementById(fileId);
  if (!template) return;
  for (const button of browser.querySelectorAll("[data-artifact-file]")) {
    button.setAttribute("aria-current", button.dataset.artifactFile === fileId ? "true" : "false");
  }
  browser.querySelector("[data-artifact-path]").textContent = template.dataset.label;
  const target = browser.querySelector("[data-artifact-content]");
  target.className = `language-${template.dataset.language}`;
  target.textContent = template.content.textContent;
}

for (const browser of document.querySelectorAll("[data-artifact-browser]")) {
  browser.addEventListener("click", (event) => {
    const file = event.target.closest("[data-artifact-file]");
    if (file) selectFile(browser, file.dataset.artifactFile);
  });
  if (browser.dataset.initialFile) selectFile(browser, browser.dataset.initialFile);
}
