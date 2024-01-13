import { ICreateGroup, IGroup } from "../../interfaces/group.interface";
import { ICreateLink, ILink } from "../../interfaces/link.interface";
import { http } from "../../services/http.service";
import { logout } from "../../services/auth.service";

const logoutBtn = document.getElementById("logout-btn") as HTMLButtonElement;
logoutBtn.addEventListener("click", (e) => {
  e.preventDefault();

  logout();
});

const mainContainer = document.getElementById("container") as HTMLDivElement;
const groupsDiv = document.getElementById("groups") as HTMLDivElement;
const linksDiv = document.getElementById("links") as HTMLDivElement;
const groupNameDisplay = document.getElementById("groupNameDisplay")!;
const addGroupContainer = document.getElementById(
  "addGroupContainer"
) as HTMLDivElement;
const addLinkContainer = document.getElementById(
  "addLinkContainer"
) as HTMLDivElement;

const addLinkForm = document.getElementById("add-link-form") as HTMLFormElement;
addLinkForm.addEventListener("submit", (e) => handleAddLink(e));

const addGroupForm = document.getElementById("add-group") as HTMLFormElement;
addGroupForm.addEventListener("submit", (e) => handleAddGroup(e));

const openTabs = document.getElementById("openTabs") as HTMLButtonElement;
const replaceTabs = document.getElementById("replaceTabs") as HTMLButtonElement;
const openTabsInNewWindow = document.getElementById(
  "openTabsInNewWindow"
) as HTMLButtonElement;

// Event listeners that send message to be received by extension
openTabs.addEventListener("click", () => sendMessage("openTabs"));
replaceTabs.addEventListener("click", () => sendMessage("replaceTabs"));
openTabsInNewWindow.addEventListener("click", () =>
  sendMessage("openTabsInNewWindow")
);

const addGroupBtn = document.getElementById("addGroupBtn") as HTMLButtonElement;
addGroupBtn.addEventListener("click", displayGroupForm);

const addGroupCloseBtn = document.getElementById(
  "addGroupCloseBtn"
) as HTMLButtonElement;
addGroupCloseBtn.addEventListener("click", closeGroupForm);

const addLinkBtn = document.getElementById("addLinkBtn") as HTMLButtonElement;
addLinkBtn.addEventListener("click", displayLinkForm);

const addLinkCloseBtn = document.getElementById(
  "addLinkCloseBtn"
) as HTMLButtonElement;
addLinkCloseBtn.addEventListener("click", closeLinkForm);

let currentGroup = 0;

async function getGroups(initialGet = false) {
  try {
    const response = await http.get("/groups/");
    const groups = response.data.data;
    if (groups.length !== 0) {
      if (initialGet) {
        currentGroup = groups[0].id;
        groupNameDisplay.innerText = groups[0].name;
      }
      renderGroups(groups);
      getLinks(currentGroup);
    }
  } catch (error) {
    console.log(error);
  }
}

async function getLinks(groupId: number) {
  try {
    const response = await http.get(`/links/?groupId=${groupId}`);
    renderLinks(response.data.data);
  } catch (error) {
    console.log(error);
  }
}

function renderGroups(groups: IGroup[]) {
  const ulElement = document.createElement("ul");
  ulElement.classList.add("list-group", "row", "g-2");

  groups.forEach((group) => {
    const listElement = document.createElement("li");
    listElement.classList.add(
      "list-group-item",
      "btn",
      "btn-outline-secondary",
      "btn-lg",
      "text-start"
    );
    listElement.innerText = group.name;
    listElement.addEventListener("click", () => {
      currentGroup = group.id;
      getLinks(group.id);
      groupNameDisplay.innerText = group.name;
    });
    ulElement.appendChild(listElement);
  });

  groupsDiv.innerHTML = "";
  groupsDiv.appendChild(ulElement);
}

function renderLinks(links: ILink[]) {
  if (links.length === 0) {
    linksDiv.innerText = "No Links";
    return;
  }

  const listElement = document.createElement("div");
  listElement.classList.add("list-group", "links-list");

  links.forEach((link) => {
    const listItemElement = document.createElement("div");
    listItemElement.classList.add("list-group-item", "link-item");

    const listItemBody = document.createElement("div");
    listItemBody.classList.add("row");

    const listItemTitle = document.createElement("div");
    listItemTitle.classList.add("col-11");
    listItemTitle.innerText = link.title;

    const anchorElement = document.createElement("a");
    anchorElement.classList.add("col-1", "text-center");
    anchorElement.innerHTML = "<i class='bi bi-box-arrow-up-right'></i>";
    anchorElement.href = link.url;
    anchorElement.target = "_blank";

    listItemElement.appendChild(listItemBody);
    listItemBody.appendChild(listItemTitle);
    listItemBody.appendChild(anchorElement);
    listElement.appendChild(listItemElement);
  });

  linksDiv.innerHTML = "";
  linksDiv.appendChild(listElement);
}

async function handleAddGroup(e: Event) {
  try {
    e.preventDefault();

    const name = addGroupForm.groupName.value;
    const newGroup: ICreateGroup = {
      name,
    };
    const response = await http.post("/groups/", newGroup);
    currentGroup = response.data.data.id;
    if (addGroupForm.withCurrentTabs.checked) {
      window.postMessage(
        {
          source: "webpage",
          message: { action: "addTabsInGroup", groupId: currentGroup },
        },
        "*"
      );
    }
    setTimeout(async () => {
      await getGroups();
    }, 1000);
    addGroupForm.groupName.value = "";
  } catch (error) {
    console.log(error);
  }
}

async function handleAddLink(e: Event) {
  try {
    e.preventDefault();

    const title = addLinkForm.linkTitle.value;
    const url = addLinkForm.url.value;
    const newLink: ICreateLink = {
      title,
      url,
    };
    await http.post(`/links/?groupId=${currentGroup}`, newLink);
    addLinkForm.linkTitle.value = "";
    addLinkForm.url.value = "";
    await getLinks(currentGroup);
  } catch (error) {
    console.log(error);
  }
}

function displayGroupForm() {
  addGroupContainer.classList.remove("d-none");

  mainContainer.style.filter = "blur(5px)";
  mainContainer.style.pointerEvents = "none";
}

function closeGroupForm() {
  addGroupContainer.classList.add("d-none");

  mainContainer.style.filter = "blur(0px)";
  mainContainer.style.pointerEvents = "auto";
}

function displayLinkForm() {
  addLinkContainer.classList.remove("d-none");

  mainContainer.style.filter = "blur(5px)";
  mainContainer.style.pointerEvents = "none";
}

function closeLinkForm() {
  addLinkContainer.classList.add("d-none");

  mainContainer.style.filter = "blur(0px)";
  mainContainer.style.pointerEvents = "auto";
}

function sendMessage(action: string) {
  window.postMessage(
    {
      source: "webpage",
      message: { action, groupId: currentGroup },
    },
    "*"
  );
}

await getGroups(true);
