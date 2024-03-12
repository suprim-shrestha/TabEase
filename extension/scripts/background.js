importScripts(
  "constants.js",
  "apiFunctions.js",
  "tabFunctions.js"
);

chrome.runtime.onMessage.addListener(
  async (request, _sender, _sendResponse) => {
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
    if (request.action === "addTabsInGroup") {
      await addTabsInGroup(request.groupId);
    }
    if (request.action === "updateLinksWithCurrentTabs") {
      await deleteAllLinks(request.groupId);
      await addTabsInGroup(request.groupId);
    }
  }
);
