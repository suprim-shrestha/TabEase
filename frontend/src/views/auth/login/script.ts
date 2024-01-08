import { http } from "../../../utils/api.util";

try {
  await http.get("/users/me");
} catch (error) {
  console.log(error);
}

const loginForm = document.getElementById("login-form") as HTMLFormElement;

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  await login({ email, password });

  return;
});

async function login(user: { email: string; password: string }) {
  try {
    const response = await http.post("/auth/login", user);

    console.log(response);
    window.location.href = "/";
  } catch (error) {
    console.log(error);
  }
}
