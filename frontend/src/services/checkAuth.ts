import { http } from "./http.service";

export async function checkUserLogin() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (isLoggedIn === "true") {
    try {
      // Checks if accessToken and refreshToken have expired
      await http.get("/users/me");
      return true;
    } catch (error) {
      return false;
    }
  } else {
    return false;
  }
}
