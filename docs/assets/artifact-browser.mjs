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

function selectGroup(browser, groupId) {
  for (const tab of browser.querySelectorAll("[data-artifact-group]")) {
    tab.setAttribute("aria-selected", tab.dataset.artifactGroup === groupId ? "true" : "false");
  }
  for (const panel of browser.querySelectorAll("[role='tabpanel']")) {
    panel.hidden = panel.id !== groupId;
  }
  const first = browser.querySelector(`#${CSS.escape(groupId)} [data-artifact-file]`);
  if (first) selectFile(browser, first.dataset.artifactFile);
}

for (const browser of document.querySelectorAll("[data-artifact-browser]")) {
  browser.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-artifact-group]");
    if (tab) selectGroup(browser, tab.dataset.artifactGroup);
    const file = event.target.closest("[data-artifact-file]");
    if (file) selectFile(browser, file.dataset.artifactFile);
  });
  const firstTab = browser.querySelector("[data-artifact-group]");
  if (firstTab) selectGroup(browser, firstTab.dataset.artifactGroup);
  if (browser.dataset.initialFile) selectFile(browser, browser.dataset.initialFile);
}
