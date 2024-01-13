import * as yup from "yup";

export const linkSchema = yup.object().shape({
  linkTitle: yup
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(255, "Title must not exceed 255 characters")
    .trim(),
  url: yup.string().required("URL is required").url("URL must be a valid URL"),
});
