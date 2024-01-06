import Joi from "joi";

export const updateUserSchema = Joi.object({
  email: Joi.string().email().messages({
    "string.email": "Email must be a valid email",
  }),
  username: Joi.string()
    .min(3)
    .max(20)
    .pattern(new RegExp("^[a-zA-Z0-9]{3,20}$"))
    .messages({
      "string.min": "Username must be at least 3 characters long",
      "string.max": "Username must be at most 20 characters long",
      "string.pattern.base":
        "Username must only contain alphanumeric characters",
    }),
  password: Joi.string().min(8).messages({
    "string.min": "Password must be at least 8 characters long",
  }),
});
