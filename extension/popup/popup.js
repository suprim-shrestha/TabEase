const closeInactiveTabsBtn = document.getElementById("closeInactiveTabsBtn");

closeInactiveTabsBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "closeAllInactiveTabs" });
});

const closeAllTabsBtn = document.getElementById("closeAllTabsBtn");

closeAllTabsBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "closeAllTabs" });
});

async function getGroups() {
  try {
    const response = await fetch("http://localhost:3000/groups/");
    const groups = await response.json();
    console.log(groups.data);
    if (groups.data.length !== 0) {
      renderGroups(groups.data);
    }
  } catch (error) {
    console.log(error);
  }
}
getGroups();

const groupsDiv = document.getElementById("groups");

function renderGroups(groups) {
  const ulElement = document.createElement("ul");

  groups.forEach((group) => {
    const listElement = document.createElement("li");
    listElement.innerText = group.name;

    // Open all links in the group
    const openAllBtn = document.createElement("button");
    openAllBtn.innerText = "Open Links";
    openAllBtn.addEventListener("click", () => {
      chrome.runtime.sendMessage({ action: "openTabs", groupId: group.id });
    });
    listElement.appendChild(openAllBtn);

    // Replace current tabs with links in group
    const replaceTabsBtn = document.createElement("button");
    replaceTabsBtn.innerText = "Replace Tabs";
    replaceTabsBtn.addEventListener("click", () => {
      chrome.runtime.sendMessage({ action: "replaceTabs", groupId: group.id });
    });
    listElement.appendChild(replaceTabsBtn);

    // Open all links in a new window
    const openInNewWindowBtn = document.createElement("button");
    openInNewWindowBtn.innerText = "Open in a New Window";
    openInNewWindowBtn.addEventListener("click", () => {
      chrome.runtime.sendMessage({
        action: "openTabsInNewWindow",
        groupId: group.id,
      });
    });
    listElement.appendChild(openInNewWindowBtn);

    ulElement.appendChild(listElement);
  });

  groupsDiv.innerHTML = "";
  groupsDiv.appendChild(ulElement);
}
