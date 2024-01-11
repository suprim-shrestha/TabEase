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
    const btnElement = document.createElement("button");
    btnElement.innerText = "Open Links";
    btnElement.addEventListener("click", () => {
      chrome.runtime.sendMessage({ action: "openTabs", groupId: group.id });
    });
    listElement.appendChild(btnElement);
    ulElement.appendChild(listElement);
  });

  groupsDiv.innerHTML = "";
  groupsDiv.appendChild(ulElement);
}
