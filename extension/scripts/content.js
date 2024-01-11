const closeButton = document.getElementById("closeInactiveTabsButton");

closeButton?.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "closeAllInactiveTabs" });
});
