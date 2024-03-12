import { ValidationError } from "yup";
import { ISignUp } from "../../../interfaces/auth.interface";
import { signupSchema } from "../../../schema/auth.schema";
import { signup } from "../../../services/auth.service";
import {
  displayValidationError,
  validateFormData,
} from "../../../utils/validator.util";
import { AxiosError } from "axios";
import { checkUserLogin } from "../../../services/checkAuth";
import { resetInvalidInputClass } from "../../../utils/util";

const mainContainer = document.getElementById(
  "main-container"
) as HTMLDivElement;

checkUserLogin().then(value => {
  if (value) {
    window.location.href = "/views/home/";
  } else {
    mainContainer.classList.remove("d-none");
  }
})

const signupForm = document.getElementById("signup-form") as HTMLFormElement;

signupForm.addEventListener("submit", (e) => handleSignup(e));

async function handleSignup(e: Event) {
  try {
    e.preventDefault();

    const email = signupForm.email.value;
    const username = signupForm.username.value;
    const password = signupForm.password.value;
    const confirmPassword = signupForm.confirmPassword.value;
    const user: ISignUp = {
      email,
      username,
      password,
      confirmPassword,
    };
    const validatedData = await validateFormData<ISignUp>(signupSchema, user);

    delete validatedData.confirmPassword;

    await signup(validatedData);
  } catch (error) {
    if (error instanceof ValidationError) {
      error.inner.forEach((inner) => {
        displayValidationError(
          signupForm,
          "signup",
          inner.path!,
          inner.message
        );
      });
    }
    if (error instanceof AxiosError) {
      if (error.response?.status === 409) {
        displayValidationError(
          signupForm,
          "signup",
          "email",
          error.response.data.error
        );
      }
    }
  }
}

resetInvalidInputClass();
