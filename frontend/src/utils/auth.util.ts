import { ILogin, ISignUp } from "../interfaces/auth.interface";
import { http } from "./api.util";

export async function login(user: ILogin) {
  try {
    const response = await http.post("/auth/login", user);

    console.log(response);
    window.location.href = "/";
  } catch (error) {
    console.log(error);
  }
}

export async function signup(user: ISignUp) {
  try {
    const response = await http.post("/auth/signup", user);

    console.log(response);

    const loginUser = {
      email: user.email,
      password: user.password,
    };

    await login(loginUser);
  } catch (error) {
    console.log(error);
  }
}
