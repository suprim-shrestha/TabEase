import { logout } from "../../utils/auth.util";

const logoutBtn = document.getElementById("logout-btn") as HTMLButtonElement;

logoutBtn.addEventListener("click", (e) => {
  e.preventDefault();

  logout();
});
