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
    await closeAllTabs();
    openTabs(request.groupId);
  }
});

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

async function closeAllTabs() {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  console.log(tabs);
  tabs.forEach((tab) => {
    if (!tab.url.includes(FRONTEND_URL)) {
      chrome.tabs.remove(tab.id);
    }
  });
}

async function openTabs(groupId) {
  const tabArray = await getLinks(groupId);
  tabArray.forEach((tab) => {
    chrome.tabs.create({ url: tab.url, active: false });
  });
}

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
    console.log("Cookie found:", cookie);
    const extensionCookie = {
      url: API_URL,
      name: cookie.name,
      value: cookie.value,
    };
    const cookieRes = await chrome.cookies.set(extensionCookie);
    if (cookieRes) {
      console.log("Cookie set", cookieRes);
      return cookie;
    }
  }
  return false;
}

setCookie();
