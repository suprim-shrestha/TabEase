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
  if (tabArray && tabArray.length > 0) {
    tabArray.forEach((tab) => {
      chrome.tabs.create({ url: tab.url, active: false });
    });
  }
}

/**
 * Open all links in the group in a new window
 *
 * @param {number} groupId
 */
async function openTabsInNewWindow(groupId) {
  const tabArray = await getLinks(groupId);

  if (tabArray && tabArray.length > 0) {
    const urls = tabArray.map((tab) => tab.url);

    chrome.windows.create({ url: urls, focused: true });
  }
}

/**
 * Returns an array of tabs objects with title and url excluding the TabEase website
 *
 * @returns Tabs[]
 */
async function getCurrentTabs() {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  return tabs
    .filter((tab) => !tab.url.includes(FRONTEND_URL))
    .map((tab) => {
      return {
        title: tab.title,
        url: tab.url,
      };
    });
}

/**
 * Get currently opened tabs and add them to the group
 *
 * @param {number} groupId
 */
async function addTabsInGroup(groupId) {
  const tabs = await getCurrentTabs();
  tabs.forEach(async (tab) => {
    await addLink(groupId, tab);
  });
}
