import { http } from "./http.service";

export async function checkUserLogin() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (isLoggedIn === "true") {
    return true;
  } else {
    return false;
  }
  try {
    await http.get("/users/me");
    return true;
  } catch (error) {
    return false;
  }
}
