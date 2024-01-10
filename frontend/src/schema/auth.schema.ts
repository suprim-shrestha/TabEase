import * as yup from "yup";

export const signupSchema = yup.object().shape({
  username: yup
    .string()
    .matches(
      /^[a-zA-Z0-9]{3,20}$/,
      "Username can only contain alphanumeric characters"
    ),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

export const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(8, "Password must be at least 8 characters"),
});
