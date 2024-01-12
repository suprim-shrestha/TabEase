// Message event listener to listen to messages from frontend website and forward it to background script
window.addEventListener("message", (event) => {
  if (
    event.source === window &&
    event.data &&
    event.data.source === "webpage"
  ) {
    // Forward the message to the background script
    chrome.runtime?.sendMessage(event.data.message);
  }
});
