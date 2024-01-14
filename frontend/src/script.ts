import { checkUserLogin } from "./services/checkAuth";

window.onload = async () => {
  if (await checkUserLogin()) {
    window.location.href = "/views/home/";
  } else {
    window.location.href = "/views/auth/login/";
  }
};
