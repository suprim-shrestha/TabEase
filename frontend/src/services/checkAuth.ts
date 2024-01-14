import { HttpClient } from "./http.service";

export async function checkUserLogin() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (isLoggedIn === "true") {
    try {
      await HttpClient.get("/users/me");
      return true;
    } catch (error) {
      return false;
    }
  } else {
    return false;
  }
}
