import { http } from "../utils/api.util";

export async function checkUserLogin() {
  console.log("checking login");
  try {
    await http.get("/users/me");
    return true;
  } catch (error) {
    console.log(error);
    window.location.href = "/views/auth/login/";
  }
}

await checkUserLogin();
