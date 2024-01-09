import { ICreateGroup, IGroup } from "../../interfaces/group.interface";
import { ICreateLink, ILink } from "../../interfaces/link.interface";
import { http } from "../../utils/api.util";
import { logout } from "../../utils/auth.util";

const logoutBtn = document.getElementById("logout-btn") as HTMLButtonElement;

logoutBtn.addEventListener("click", (e) => {
  e.preventDefault();

  logout();
});

const groupsDiv = document.getElementById("groups") as HTMLDivElement;
const linksDiv = document.getElementById("links") as HTMLDivElement;
const addLinkForm = document.getElementById("add-link-form") as HTMLFormElement;

let curentGroup = 0;

async function getGroups(initialGet = false) {
  try {
    const response = await http.get("/groups/");
    const groups = response.data.data;
    console.log(groups);
    if (groups.length !== 0) {
      if (initialGet) {
        curentGroup = groups[0].id;
      }
      renderGroups(groups);
      getLinks(curentGroup);
    }
  } catch (error) {
    console.log(error);
  }
}

await getGroups(true);

async function getLinks(groupId: number) {
  try {
    const response = await http.get(`/links/?groupId=${groupId}`);
    console.log(response.data.data);
    renderLinks(response.data.data);
  } catch (error) {
    console.log(error);
  }
}

addLinkForm.addEventListener("submit", (e) => handleAddLink(e));

function renderGroups(groups: IGroup[]) {
  const ulElement = document.createElement("ul");

  groups.forEach((group) => {
    const listElement = document.createElement("li");
    listElement.innerText = group.name;
    const btnElement = document.createElement("button");
    btnElement.innerText = "Get Links";
    btnElement.addEventListener("click", () => {
      curentGroup = group.id;
      getLinks(group.id);
    });
    listElement.appendChild(btnElement);
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

  const ulElement = document.createElement("ul");

  links.forEach((link) => {
    const listElement = document.createElement("li");
    listElement.innerText = link.title;
    const anchorElement = document.createElement("a");
    anchorElement.innerText = "Open Link";
    anchorElement.href = link.url;
    anchorElement.target = "_blank";

    listElement.appendChild(anchorElement);
    ulElement.appendChild(listElement);
  });

  linksDiv.innerHTML = "";
  linksDiv.appendChild(ulElement);
}

const addGroupForm = document.getElementById("add-group") as HTMLFormElement;

addGroupForm.addEventListener("submit", (e) => handleAddGroup(e));

async function handleAddGroup(e: Event) {
  try {
    e.preventDefault();

    const name = addGroupForm.groupName.value;
    const newGroup: ICreateGroup = {
      name,
    };
    const response = await http.post("/groups/", newGroup);
    console.log(response);
    curentGroup = response.data.data.id;
    await getGroups();
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
    const response = await http.post(`/links/?groupId=${curentGroup}`, newLink);
    addLinkForm.linkTitle.value = "";
    addLinkForm.url.value = "";
    console.log(response);
    await getLinks(curentGroup);
  } catch (error) {
    console.log(error);
  }
}
