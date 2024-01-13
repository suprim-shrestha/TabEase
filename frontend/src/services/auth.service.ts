import { ILogin, ISignUp } from "../interfaces/auth.interface";
import { http } from "./http.service";

export async function login(user: ILogin) {
  const response = await http.post("/auth/login", user);

  console.log(response);
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
    const response = await http.post("/auth/logout");

    console.log(response);
    window.location.href = "/";
  } catch (error) {
    console.log(error);
  }
}
