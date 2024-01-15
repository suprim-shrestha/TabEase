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
import { http } from "../../services/http.service";
import { logout } from "../../services/auth.service";
import {
  displayValidationError,
  validateFormData,
} from "../../utils/validator.util";
import { groupSchema } from "../../schema/group.schema";
import { ValidationError } from "yup";
import { linkSchema } from "../../schema/link.schema";
import { checkUserLogin } from "../../services/checkAuth";
import { resetInvalidInputClass, sendMessage } from "../../utils/util";

const mainContainer = document.getElementById("container") as HTMLDivElement;

// Check user login
if (await checkUserLogin()) {
  mainContainer.classList.remove("d-none");
} else {
  window.location.href = "/views/auth/login/";
}

// Logout button
const logoutBtn = document.getElementById("logoutBtn") as HTMLButtonElement;
logoutBtn.addEventListener("click", (e) => {
  e.preventDefault();

  logout();
});

// Sidebar toggle
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

// Div containers
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

// Form event listeners
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

// Buttons for open links in group options
const openTabs = document.getElementById("openTabs") as HTMLButtonElement;
const replaceTabs = document.getElementById("replaceTabs") as HTMLButtonElement;
const openTabsInNewWindow = document.getElementById(
  "openTabsInNewWindow"
) as HTMLButtonElement;

// Event listeners that send message to be received by extension
openTabs.addEventListener("click", () =>
  sendMessage("openTabs", { groupId: currentGroup })
);
replaceTabs.addEventListener("click", () =>
  sendMessage("replaceTabs", { groupId: currentGroup })
);
openTabsInNewWindow.addEventListener("click", () =>
  sendMessage("openTabsInNewWindow", { groupId: currentGroup })
);

// Display and close forms buttons
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
  const response = await http.get(`/groups/${currentGroup}`);
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

const deleteGroupBtn = document.getElementById(
  "deleteGroupBtn"
) as HTMLButtonElement;
deleteGroupBtn.onclick = confirmDeleteGroup;

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

let currentGroup = 0;

/**
 * Get all groups for current user
 *
 * @param initialGet Sets currentGroup to first group
 */
async function getGroups(initialGet = false) {
  const response = await http.get("/groups/");
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
    linksDiv.innerText = "No Links";
    // Disable all buttons if user has no groups
    editGroupBtn.disabled = true;
    deleteGroupBtn.disabled = true;
    openTabs.disabled = true;
    replaceTabs.disabled = true;
    openTabsInNewWindow.disabled = true;
    addLinkBtn.disabled = true;
  }
}

/**
 * Get all links belonging to a group
 *
 * @param groupId
 */
async function getLinks(groupId: number) {
  try {
    const response = await http.get(`/links/?groupId=${groupId}`);
    renderLinks(response.data.data);
  } catch (error) {
    console.log(error);
  }
}

/**
 * Render all groups in the sidebar
 *
 * @param groups
 */
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

/**
 * Render all links for selected group
 *
 * @param links
 */
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

    // Delete link button
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("btn", "text-danger");
    deleteBtn.innerHTML = "<i class='bi bi-trash'></i>";
    deleteBtn.addEventListener("click", () => confirmDeleteLink(link.id));
    btnDiv.appendChild(deleteBtn);

    // Edit Link Button
    const editLinkBtn = document.createElement("button");
    editLinkBtn.classList.add("btn");
    editLinkBtn.innerHTML = "<i class='bi bi-pencil'></i>";
    editLinkBtn.addEventListener("click", () => {
      editLinkForm.linkId.value = link.id;
      editLinkForm.linkTitle.value = link.title;
      editLinkForm.url.value = link.url;
      displayForm(editLinkContainer);
    });
    btnDiv.appendChild(editLinkBtn);

    // Open Link Button
    const openLinkBtn = document.createElement("button");
    openLinkBtn.classList.add("btn");
    const anchorElement = document.createElement("a");
    anchorElement.innerHTML = "<i class='bi bi-box-arrow-up-right'></i>";
    anchorElement.href = link.url;
    anchorElement.target = "_blank";
    openLinkBtn.appendChild(anchorElement);
    btnDiv.appendChild(openLinkBtn);

    listElement.appendChild(listItemElement);
    listItemElement.appendChild(listItemBody);
    listItemBody.appendChild(listItemTitle);
    listItemBody.appendChild(btnDiv);
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
    const response = await http.post("/groups/", newGroup);
    currentGroup = response.data.data.id;
    if (addGroupForm.withCurrentTabs.checked) {
      sendMessage("addTabsInGroup", { groupId: currentGroup });
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

    await http.put(`/groups/${currentGroup}`, updatedGroup);

    if (editGroupForm.updateWithCurrentTabs.checked) {
      sendMessage("updateLinksWithCurrentTabs", { groupId: currentGroup });
      setTimeout(async () => {
        await getGroups();
      }, 1000);
    } else {
      await getGroups();
    }

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

    await http.post(`/links/?groupId=${currentGroup}`, newLink);

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

    await http.put(`/links/${linkId}/?groupId=${currentGroup}`, updatedLink);

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

/**
 * Display form div container and blur main container
 *
 * @param formContainer
 */
function displayForm(formContainer: HTMLDivElement) {
  formContainer.classList.remove("d-none");

  mainContainer.style.filter = "blur(5px)";
  mainContainer.style.pointerEvents = "none";
}

/**
 * Close form div container
 *
 * @param formContainer
 */
function closeForm(formContainer: HTMLDivElement) {
  formContainer.classList.add("d-none");

  mainContainer.style.filter = "blur(0px)";
  mainContainer.style.pointerEvents = "auto";
}

async function confirmDeleteLink(linkId: number) {
  const confirmDelete = confirm("Are you sure you want to delete?");
  if (confirmDelete) {
    await http.delete(`/links/${linkId}/?groupId=${currentGroup}`);
    getLinks(currentGroup);
  }
}

async function confirmDeleteGroup() {
  const confirmDelete = confirm("Are you sure you want to delete?");
  if (confirmDelete) {
    await http.delete(`/groups/${currentGroup}/`);
    getGroups(true);
  }
}

resetInvalidInputClass();

await getGroups(true);
