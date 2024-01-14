import {
  ICreateGroup,
  IGroup,
  IGroupSchema,
} from "../../interfaces/group.interface";
import {
  ICreateLink,
  ILink,
  ILinkSchema,
} from "../../interfaces/link.interface";
import { HttpClient } from "../../services/http.service";
import { logout } from "../../services/auth.service";
import {
  displayValidationError,
  validateFormData,
} from "../../utils/validator.util";
import { groupSchema } from "../../schema/group.schema";
import { ValidationError } from "yup";
import { linkSchema } from "../../schema/link.schema";
import { checkUserLogin } from "../../services/checkAuth";

const logoutBtn = document.getElementById("logoutBtn") as HTMLButtonElement;
logoutBtn.addEventListener("click", (e) => {
  e.preventDefault();

  logout();
});

const mainContainer = document.getElementById("container") as HTMLDivElement;

if (await checkUserLogin()) {
  mainContainer.classList.remove("d-none");
} else {
  window.location.href = "/views/auth/login/";
}

const rightDiv = document.getElementById("rightDiv") as HTMLDivElement;
const sidebar = document.getElementById("sidebar") as HTMLDivElement;
const sidebarToggleBtn = document.getElementById(
  "sidebarToggleBtn"
) as HTMLButtonElement;
sidebarToggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
  if (sidebar.classList.contains("active")) {
    sidebar.style.height = rightDiv.clientHeight + "px";
  } else {
    sidebar.removeAttribute("style");
  }
});

const groupsDiv = document.getElementById("groups") as HTMLDivElement;
const linksDiv = document.getElementById("links") as HTMLDivElement;
const groupNameDisplay = document.getElementById("groupNameDisplay")!;
const addGroupContainer = document.getElementById(
  "addGroupContainer"
) as HTMLDivElement;
const editGroupContainer = document.getElementById(
  "editGroupContainer"
) as HTMLDivElement;
const addLinkContainer = document.getElementById(
  "addLinkContainer"
) as HTMLDivElement;
const editLinkContainer = document.getElementById(
  "editLinkContainer"
) as HTMLDivElement;

const addGroupForm = document.getElementById("addGroupForm") as HTMLFormElement;
addGroupForm.addEventListener("submit", (e) => handleAddGroup(e));

const editGroupForm = document.getElementById(
  "editGroupForm"
) as HTMLFormElement;
editGroupForm.addEventListener("submit", (e) => handleEditGroup(e));

const addLinkForm = document.getElementById("addLinkForm") as HTMLFormElement;
addLinkForm.addEventListener("submit", (e) => handleAddLink(e));

const editLinkForm = document.getElementById("editLinkForm") as HTMLFormElement;
editLinkForm.addEventListener("submit", (e) => handleEditLink(e));

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
addGroupBtn.addEventListener("click", () => {
  displayForm(addGroupContainer);
});

const addGroupCloseBtn = document.getElementById(
  "addGroupCloseBtn"
) as HTMLButtonElement;
addGroupCloseBtn.addEventListener("click", () => {
  closeForm(addGroupContainer);
});

const editGroupBtn = document.getElementById(
  "editGroupBtn"
) as HTMLButtonElement;
editGroupBtn.addEventListener("click", async () => {
  const response = await HttpClient.get(`/groups/${currentGroup}`);
  const groupDetails = response.data;
  editGroupForm.groupName.value = groupDetails.name;
  displayForm(editGroupContainer);
});

const editGroupCloseBtn = document.getElementById(
  "editGroupCloseBtn"
) as HTMLButtonElement;
editGroupCloseBtn.addEventListener("click", () => {
  closeForm(editGroupContainer);
});

const addLinkBtn = document.getElementById("addLinkBtn") as HTMLButtonElement;
addLinkBtn.addEventListener("click", () => {
  displayForm(addLinkContainer);
});

const addLinkCloseBtn = document.getElementById(
  "addLinkCloseBtn"
) as HTMLButtonElement;
addLinkCloseBtn.addEventListener("click", () => {
  closeForm(addLinkContainer);
});
const editLinkCloseBtn = document.getElementById(
  "editLinkCloseBtn"
) as HTMLButtonElement;
editLinkCloseBtn.addEventListener("click", () => {
  closeForm(editLinkContainer);
});

const deleteGroupBtn = document.getElementById(
  "deleteGroupBtn"
) as HTMLButtonElement;
deleteGroupBtn.onclick = confirmDeleteGroup;

let currentGroup = 0;

async function getGroups(initialGet = false) {
  try {
    const response = await HttpClient.get("/groups/");
    const groups = response.data.data;
    if (groups.length !== 0) {
      if (initialGet) {
        currentGroup = groups[0].id;
        groupNameDisplay.innerText = groups[0].name;
      }
      editGroupBtn.disabled = false;
      deleteGroupBtn.disabled = false;
      openTabs.disabled = false;
      replaceTabs.disabled = false;
      openTabsInNewWindow.disabled = false;
      addLinkBtn.disabled = false;
      renderGroups(groups);
      getLinks(currentGroup);
    } else {
      groupsDiv.innerHTML = "<h3>Create a group to start</h3>";
      groupNameDisplay.innerText = "No Group Selected";
      editGroupBtn.disabled = true;
      deleteGroupBtn.disabled = true;
      openTabs.disabled = true;
      replaceTabs.disabled = true;
      openTabsInNewWindow.disabled = true;
      addLinkBtn.disabled = true;
    }
  } catch (error) {
    console.log(error);
  }
}

async function getLinks(groupId: number) {
  try {
    const response = await HttpClient.get(`/links/?groupId=${groupId}`);
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
      sidebar.classList.remove("active");
      sidebar.removeAttribute("style");
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
    listItemBody.classList.add("row", "align-items-center");

    const listItemTitle = document.createElement("div");
    listItemTitle.classList.add("col-md-10");
    listItemTitle.innerText = link.title;

    const btnDiv = document.createElement("div");
    btnDiv.classList.add("col-md-2", "d-flex", "justify-content-end");

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("btn", "text-danger");
    deleteBtn.innerHTML = "<i class='bi bi-trash'></i>";
    deleteBtn.addEventListener("click", () => confirmDeleteLink(link.id));

    const editLinkBtn = document.createElement("button");
    editLinkBtn.classList.add("btn");
    editLinkBtn.innerHTML = "<i class='bi bi-pencil'></i>";
    editLinkBtn.addEventListener("click", () => {
      editLinkForm.linkId.value = link.id;
      editLinkForm.linkTitle.value = link.title;
      editLinkForm.url.value = link.url;
      displayForm(editLinkContainer);
    });

    const openLinkBtn = document.createElement("button");
    openLinkBtn.classList.add("btn");
    const anchorElement = document.createElement("a");
    anchorElement.innerHTML = "<i class='bi bi-box-arrow-up-right'></i>";
    anchorElement.href = link.url;
    anchorElement.target = "_blank";
    openLinkBtn.appendChild(anchorElement);

    listItemElement.appendChild(listItemBody);
    listItemBody.appendChild(listItemTitle);
    listItemBody.appendChild(btnDiv);
    btnDiv.appendChild(deleteBtn);
    btnDiv.appendChild(editLinkBtn);
    btnDiv.appendChild(openLinkBtn);
    listElement.appendChild(listItemElement);
  });

  linksDiv.innerHTML = "";
  linksDiv.appendChild(listElement);
}

async function handleAddGroup(e: Event) {
  try {
    e.preventDefault();

    const groupName = addGroupForm.groupName.value;

    const validatedData = await validateFormData<IGroupSchema>(groupSchema, {
      groupName,
    });
    const newGroup: ICreateGroup = {
      name: validatedData.groupName,
    };
    const response = await HttpClient.post("/groups/", newGroup);
    currentGroup = response.data.data.id;
    if (addGroupForm.withCurrentTabs.checked) {
      sendMessage("addTabsInGroup");
      setTimeout(async () => {
        await getGroups();
      }, 1000);
    } else {
      await getGroups();
    }
    closeForm(addGroupContainer);
    groupNameDisplay.innerText = validatedData.groupName;
    addGroupForm.groupName.value = "";
  } catch (error) {
    if (error instanceof ValidationError) {
      error.inner.forEach((inner) => {
        displayValidationError(addGroupForm, "add", inner.path!, inner.message);
      });
    } else {
      console.log(error);
    }
  }
}

async function handleEditGroup(e: Event) {
  try {
    e.preventDefault();

    const groupName = editGroupForm.groupName.value;
    const validatedData = await validateFormData<IGroupSchema>(groupSchema, {
      groupName,
    });
    const updatedGroup: ICreateGroup = {
      name: validatedData.groupName,
    };
    await HttpClient.put(`/groups/${currentGroup}`, updatedGroup);
    await getGroups();
    groupNameDisplay.innerText = validatedData.groupName;
    editGroupForm.groupName.value = "";
    closeForm(editGroupContainer);
  } catch (error) {
    if (error instanceof ValidationError) {
      error.inner.forEach((inner) => {
        displayValidationError(
          editGroupForm,
          "edit",
          inner.path!,
          inner.message
        );
      });
    } else {
      console.log(error);
    }
  }
}

async function handleAddLink(e: Event) {
  try {
    e.preventDefault();

    const linkTitle = addLinkForm.linkTitle.value;
    const url = addLinkForm.url.value;

    const validatedData = await validateFormData<ILinkSchema>(linkSchema, {
      linkTitle,
      url,
    });

    const newLink: ICreateLink = {
      title: validatedData.linkTitle,
      url: validatedData.url,
    };
    await HttpClient.post(`/links/?groupId=${currentGroup}`, newLink);
    addLinkForm.linkTitle.value = "";
    addLinkForm.url.value = "";
    await getLinks(currentGroup);
    closeForm(addLinkContainer);
  } catch (error) {
    if (error instanceof ValidationError) {
      error.inner.forEach((inner) => {
        displayValidationError(addLinkForm, "add", inner.path!, inner.message);
      });
    } else {
      console.log(error);
    }
  }
}

async function handleEditLink(e: Event) {
  try {
    e.preventDefault();

    const linkId = editLinkForm.linkId.value;
    const linkTitle = editLinkForm.linkTitle.value;
    const url = editLinkForm.url.value;

    const validatedData = await validateFormData<ILinkSchema>(linkSchema, {
      linkTitle,
      url,
    });

    const updatedLink: ICreateLink = {
      title: validatedData.linkTitle,
      url: validatedData.url,
    };
    await HttpClient.put(
      `/links/${linkId}/?groupId=${currentGroup}`,
      updatedLink
    );
    editLinkForm.linkTitle.value = "";
    editLinkForm.url.value = "";
    await getLinks(currentGroup);
    closeForm(editLinkContainer);
  } catch (error) {
    if (error instanceof ValidationError) {
      error.inner.forEach((inner) => {
        displayValidationError(
          editLinkForm,
          "edit",
          inner.path!,
          inner.message
        );
      });
    } else {
      console.log(error);
    }
  }
}

function displayForm(formContainer: HTMLDivElement) {
  formContainer.classList.remove("d-none");

  mainContainer.style.filter = "blur(5px)";
  mainContainer.style.pointerEvents = "none";
}

function closeForm(formContainer: HTMLDivElement) {
  formContainer.classList.add("d-none");

  mainContainer.style.filter = "blur(0px)";
  mainContainer.style.pointerEvents = "auto";
}

async function confirmDeleteLink(linkId: number) {
  const confirmDelete = confirm("Are you sure you want to delete?");
  if (confirmDelete) {
    await HttpClient.delete(`/links/${linkId}/?groupId=${currentGroup}`);
    getLinks(currentGroup);
  }
}

async function confirmDeleteGroup() {
  const confirmDelete = confirm("Are you sure you want to delete?");
  if (confirmDelete) {
    await HttpClient.delete(`/groups/${currentGroup}/`);
    getGroups(true);
  }
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

const inputFields = document.getElementsByTagName("input");

for (let i = 0; i < inputFields.length; i++) {
  inputFields[i].addEventListener("input", () => {
    inputFields[i].classList.remove("is-invalid");
  });
}

await getGroups(true);
