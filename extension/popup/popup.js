const closeBtn = document.getElementById("closeTabBtn");

closeBtn.addEventListener("click", () => closeAllInactiveTab());

function closeAllInactiveTab() {
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
