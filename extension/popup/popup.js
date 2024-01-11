const closeBtn = document.getElementById("closeTabBtn");

closeBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "closeAllInactiveTabs" });
});
