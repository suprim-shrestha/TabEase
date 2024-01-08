import { http } from "../../utils/api.util";

const logoutBtn = document.getElementById("logout-btn") as HTMLButtonElement;

logoutBtn.addEventListener("click", (e) => {
  e.preventDefault();

  logout();
});

async function logout() {
  try {
    const response = await http.post("/auth/logout");

    console.log(response);
    window.location.href = "/";
  } catch (error) {
    console.log(error);
  }
}
