import Joi from "joi";

export const groupSchema = Joi.object({
  name: Joi.string().required().min(3).max(30).messages({
    "any.required": "Name is required",
    "string.empty": "Name cannot be empty",
  }),
});
