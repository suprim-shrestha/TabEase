const FRONTEND_URL = "http://localhost:4000";
const API_URL = "http://localhost:3000";

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

/**
 * Close all in active tabs in the same window
 */
function closeAllInactiveTabs() {
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    tabs.forEach((tab) => {
      if (!tab.active) {
        chrome.tabs.remove(tab.id);
      }
    });
  });
}

/**
 * Closes all tabs that are not the TabEase website and not the first tab to close
 */
async function closeAllTabs() {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  const tabsToClose = tabs.filter((tab) => !tab.url.includes(FRONTEND_URL));
  tabsToClose.forEach((tab) => {
    if (tab !== tabsToClose[0]) {
      chrome.tabs.remove(tab.id);
    }
  });
}

/**
 * Closes first tab that is not the TabEase website
 */
async function closeFirstTab() {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  const tabsToClose = tabs.filter((tab) => !tab.url.includes(FRONTEND_URL));
  chrome.tabs.remove(tabsToClose[0].id);
}

/**
 * Open all links in the group in the same window
 *
 * @param {number} groupId
 */
async function openTabs(groupId) {
  const tabArray = await getLinks(groupId);
  tabArray.forEach((tab) => {
    chrome.tabs.create({ url: tab.url, active: false });
  });
}

/**
 * Open all links in the group in a new window
 *
 * @param {number} groupId
 */
async function openTabsInNewWindow(groupId) {
  const tabArray = await getLinks(groupId);

  const urls = tabArray.map((tab) => tab.url);

  chrome.windows.create({ url: urls, focused: true });
}

/**
 * Fetch all links in the group from database
 *
 * @param {number} groupId
 * @returns links[]
 */
async function getLinks(groupId) {
  try {
    const response = await fetch(`${API_URL}/links/?groupId=${groupId}`);
    const links = await response.json();
    return links.data;
  } catch (error) {
    console.log(error);
  }
}

async function getCookie() {
  return chrome.cookies.get({
    name: "accessToken",
    url: FRONTEND_URL,
  });
}

async function setCookie() {
  const cookie = await getCookie();
  if (cookie) {
    const extensionCookie = {
      url: API_URL,
      name: cookie.name,
      value: cookie.value,
    };
    const cookieRes = await chrome.cookies.set(extensionCookie);
    if (cookieRes) {
      return cookie;
    }
  }
  return false;
}

setCookie();
