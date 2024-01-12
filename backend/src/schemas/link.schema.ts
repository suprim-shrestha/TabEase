import Joi from "joi";

export const linkQuerySchema = Joi.object({
  groupId: Joi.number().required().messages({
    "any.required": "Group id is required",
    "number.empty": "Group id cannot be empty",
  }),
});

export const createLinkSchema = Joi.object({
  title: Joi.string().required().min(3).max(255).messages({
    "any.required": "Title is required",
    "string.empty": "Title cannot be empty",
  }),
  url: Joi.string()
    .required()
    .uri({
      scheme: ["http", "https"],
    })
    .messages({
      "any.required": "url is required",
      "string.empty": "url cannot be empty",
    }),
});

export const updateLinkSchema = Joi.object({
  title: Joi.string().min(3).max(30).messages({
    "string.empty": "Title cannot be empty",
  }),
  url: Joi.string()
    .uri({
      scheme: ["http", "https"],
    })
    .messages({
      "string.empty": "url cannot be empty",
    }),
});
