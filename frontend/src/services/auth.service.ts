import { ILogin, ISignUp } from "../interfaces/auth.interface";
import { http, httpRefresh } from "./http.service";

export async function login(user: ILogin) {
  await http.post("/auth/login", user);

  localStorage.setItem("isLoggedIn", "true");
  window.location.href = "/";
}

export async function signup(user: ISignUp) {
  const response = await http.post("/auth/signup", user);

  console.log(response);

  const loginUser = {
    email: user.email,
    password: user.password,
  };

  await login(loginUser);
}

export async function logout() {
  try {
    await http.post("/auth/logout");

    localStorage.setItem("isLoggedIn", "false");
    window.location.href = "/views/home/";
  } catch (error) {
    console.log(error);
  }
}

export async function refresh() {
  await httpRefresh.post("/auth/refresh");
}
