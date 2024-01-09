import { http } from "../../../utils/api.util";
import { login } from "../../../utils/auth.util";

try {
  await http.get("/users/me");
} catch (error) {
  console.log(error);
}

const loginForm = document.getElementById("login-form") as HTMLFormElement;

loginForm.addEventListener("submit", async (e) => handleLogin(e));

async function handleLogin(e: Event) {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  await login({ email, password });
}
