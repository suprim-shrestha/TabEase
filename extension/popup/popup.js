const closeInactiveTabsBtn = document.getElementById("closeInactiveTabsBtn");

closeInactiveTabsBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "closeAllInactiveTabs" });
});

const closeAllTabsBtn = document.getElementById("closeAllTabsBtn");

closeAllTabsBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "closeAllTabs" });
});

const openTabsBtn = document.getElementById("openTabsBtn");

openTabsBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "openTabs", groupId: 3 });
});
