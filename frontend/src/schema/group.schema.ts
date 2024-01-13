import * as yup from "yup";

export const groupSchema = yup.object().shape({
  groupName: yup
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(30, "Name must not exceed 30 characters")
    .trim(),
});
