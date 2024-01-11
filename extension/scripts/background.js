function closeAllInactiveTabs() {
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    console.log(tabs);
    const currentTabIds = tabs.filter((tab) => tab.active).map((tab) => tab.id);

    tabs.forEach((tab) => {
      if (!currentTabIds.includes(tab.id)) {
        chrome.tabs.remove(tab.id);
      }
    });
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "closeAllInactiveTabs") {
    closeAllInactiveTabs();
  }
});
