const homeBtn = document.getElementById("homeBtn");
homeBtn.addEventListener("click", () => {
  chrome.tabs.create({ url: FRONTEND_URL });
});

const groupsDiv = document.getElementById("groups");

const createGroupForm = document.getElementById("createGroup");
createGroupForm.addEventListener("submit", (e) => handleCreateGroup(e));
createGroupForm.groupName.addEventListener("input", () => {
  createGroupForm.groupName.classList.remove("is-invalid");
});

async function handleCreateGroup(e) {
  e.preventDefault();
  const groupName = createGroupForm.groupName.value;
  if (groupName.length < 3) {
    createGroupForm.groupName.classList.add("is-invalid");
    return;
  }

  const newGroup = {
    name: groupName,
  };

  const response = await fetch(`${API_URL}/groups/`, {
    body: JSON.stringify(newGroup),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const group = await response.json();
  chrome.runtime.sendMessage({
    action: "addTabsInGroup",
    groupId: group.data.id,
  });

  setTimeout(() => {
    getGroups();
  }, 1000);

  createGroupForm.groupName.value = "";
}

async function getGroups() {
  try {
    const response = await fetch(`${API_URL}/groups/`);
    if (!response.ok) {
      if (response.status === 401) {
        displayLoginMessage();
        return;
      }
    }
    const groups = await response.json();
    if (groups.data && groups.data.length !== 0) {
      renderGroups(groups.data);
    } else {
      groupsDiv.innerHTML = "No Groups";
    }
  } catch (error) {
    console.log(error);
  }
}

function renderGroups(groups) {
  const listElement = document.createElement("div");
  listElement.classList.add("list-group");

  groups.forEach((group) => {
    const listItemElement = document.createElement("div");
    listItemElement.classList.add("list-group-item");

    const listItemBody = document.createElement("div");
    listItemBody.classList.add("row", "align-items-center");

    // Group name
    const listItemName = document.createElement("div");
    listItemName.classList.add("col-10", "text-start");
    listItemName.innerText = group.name;

    // Div for all buttons
    const btnDiv = document.createElement("div");
    btnDiv.classList.add("col-2", "d-flex", "justify-content-end");

    // Open all links in the group
    const openAllBtn = document.createElement("button");
    openAllBtn.classList.add("btn");
    openAllBtn.title = "Open all links in current window";
    openAllBtn.innerHTML = `<i class="bi bi-box-arrow-up-right"></i>`;
    openAllBtn.addEventListener("click", () => {
      chrome.runtime.sendMessage({ action: "openTabs", groupId: group.id });
    });
    btnDiv.appendChild(openAllBtn);

    // Replace current tabs with links in group
    const replaceTabsBtn = document.createElement("button");
    replaceTabsBtn.classList.add("btn");
    replaceTabsBtn.title = "Replace current tabs and open all links";
    replaceTabsBtn.innerHTML = `<i class="bi bi-arrow-left-right"></i>`;
    replaceTabsBtn.addEventListener("click", () => {
      chrome.runtime.sendMessage({ action: "replaceTabs", groupId: group.id });
    });
    btnDiv.appendChild(replaceTabsBtn);

    // Open all links in a new window
    const openInNewWindowBtn = document.createElement("button");
    openInNewWindowBtn.classList.add("btn");
    openInNewWindowBtn.title = "Open all links in a new window";
    openInNewWindowBtn.innerHTML = `<i class="bi bi-box-arrow-up"></i>`;
    openInNewWindowBtn.addEventListener("click", () => {
      chrome.runtime.sendMessage({
        action: "openTabsInNewWindow",
        groupId: group.id,
      });
    });
    btnDiv.appendChild(openInNewWindowBtn);

    listItemBody.appendChild(listItemName);
    listItemBody.appendChild(btnDiv);

    listItemElement.appendChild(listItemBody);
    listElement.appendChild(listItemElement);
  });

  groupsDiv.innerHTML = "";
  groupsDiv.appendChild(listElement);
}

function displayLoginMessage() {
  groupsDiv.innerText = "User not logged in? ";
  const loginElement = document.createElement("a");
  loginElement.classList.add("text-link");
  loginElement.role = "button";
  loginElement.innerText = "Login";
  loginElement.addEventListener("click", () => {
    chrome.tabs.create({ url: `${FRONTEND_URL}/views/login` });
  });
  groupsDiv.appendChild(loginElement);
}

getGroups();
