importScripts(
  "constants.js",
  "cookieFunctions.js",
  "apiFunctions.js",
  "tabFunctions.js"
);

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "closeAllInactiveTabs") {
    closeAllInactiveTabs();
  }
  if (request.action === "closeAllTabs") {
    closeAllTabs();
  }
  if (request.action === "openTabs") {
    await openTabs(request.groupId);
  }
  if (request.action === "replaceTabs") {
    await closeAllTabs();
    await openTabs(request.groupId);
    await closeFirstTab();
  }
  if (request.action === "openTabsInNewWindow") {
    await openTabsInNewWindow(request.groupId);
  }
});
