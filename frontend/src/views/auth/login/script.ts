import { AxiosError } from "axios";
import { ValidationError } from "yup";
import { ILogin } from "../../../interfaces/auth.interface";
import { loginSchema } from "../../../schema/auth.schema";
import { http } from "../../../services/http.service";
import { login } from "../../../services/auth.service";
import {
  displayValidationError,
  validateFormData,
} from "../../../utils/validator.util";

try {
  await http.get("/users/me");
} catch (error) {
  console.log(error);
}

const loginForm = document.getElementById("login-form") as HTMLFormElement;

loginForm.addEventListener("submit", async (e) => handleLogin(e));

async function handleLogin(e: Event) {
  try {
    e.preventDefault();

    const email = loginForm.email.value;
    const password = loginForm.password.value;

    const loginDetail: ILogin = {
      email,
      password,
    };

    const validatedData = await validateFormData<ILogin>(
      loginSchema,
      loginDetail
    );

    await login(validatedData);
  } catch (error) {
    if (error instanceof ValidationError) {
      error.inner.forEach((inner) => {
        displayValidationError(loginForm, "login", inner.path!, inner.message);
      });
    }
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        displayValidationError(
          loginForm,
          "login",
          "email",
          error.response.data.error
        );
      }
      if (error.response?.status === 401) {
        displayValidationError(
          loginForm,
          "login",
          "password",
          error.response.data.error
        );
      }
    }
  }
}

loginForm.email.addEventListener("input", () => {
  loginForm.email.classList.remove("is-invalid");
});
loginForm.password.addEventListener("input", () => {
  loginForm.password.classList.remove("is-invalid");
});
