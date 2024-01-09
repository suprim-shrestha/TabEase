import { http } from "../../utils/api.util";
import { logout } from "../../utils/auth.util";

const logoutBtn = document.getElementById("logout-btn") as HTMLButtonElement;

logoutBtn.addEventListener("click", (e) => {
  e.preventDefault();

  logout();
});

interface IGroup {
  id: number;
  name: string;
  createdBy: number;
}

interface ILink {
  id: number;
  title: string;
  url: string;
  belongsTo: number;
}

const groupsDiv = document.getElementById("groups") as HTMLDivElement;
const linksDiv = document.getElementById("links") as HTMLDivElement;

async function getGroups() {
  try {
    const response = await http.get("/groups/");
    const groups = response.data.data;
    console.log(groups);
    if (groups.length !== 0) {
      renderGroups(groups);
      getLinks(groups[0].id);
    }
  } catch (error) {
    console.log(error);
  }
}

await getGroups();

async function getLinks(groupId: number) {
  try {
    const response = await http.get(`/links/?groupId=${groupId}`);
    console.log(response.data.data);
    renderLinks(response.data.data);
  } catch (error) {
    console.log(error);
  }
}

function renderGroups(groups: IGroup[]) {
  const ulElement = document.createElement("ul");

  groups.forEach((group) => {
    const listElement = document.createElement("li");
    listElement.innerText = group.name;
    const btnElement = document.createElement("button");
    btnElement.innerText = "Get Links";
    btnElement.addEventListener("click", () => getLinks(group.id));
    listElement.appendChild(btnElement);
    ulElement.appendChild(listElement);
  });

  groupsDiv.innerHTML = "";
  groupsDiv.appendChild(ulElement);
}

function renderLinks(links: ILink[]) {
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
