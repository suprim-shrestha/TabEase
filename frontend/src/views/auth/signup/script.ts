import { signup } from "../../../utils/auth.util";

const signupForm = document.getElementById("signup-form") as HTMLFormElement;

signupForm.addEventListener("submit", (e) => handleSignup(e));

async function handleSignup(e: Event) {
  try {
    e.preventDefault();

    const email = signupForm.email.value;
    const username = signupForm.username.value;
    const password = signupForm.password.value;
    const user = {
      email,
      username,
      password,
    };

    await signup(user);
  } catch (error) {
    console.log(error);
  }
}
