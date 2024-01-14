import { ILogin, ISignUp } from "../interfaces/auth.interface";
import { HttpClient } from "./http.service";

export async function login(user: ILogin) {
  await HttpClient.post("/auth/login", user);

  localStorage.setItem("isLoggedIn", "true");
  window.location.href = "/";
}

export async function signup(user: ISignUp) {
  const response = await HttpClient.post("/auth/signup", user);

  console.log(response);

  const loginUser = {
    email: user.email,
    password: user.password,
  };

  await login(loginUser);
}

export async function logout() {
  try {
    await HttpClient.post("/auth/logout");

    localStorage.setItem("isLoggedIn", "false");
    window.location.href = "/views/home/";
  } catch (error) {
    console.log(error);
  }
}

export async function refresh() {
  await HttpClient.post("/auth/refresh");
}
