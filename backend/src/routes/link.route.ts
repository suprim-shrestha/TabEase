import { Router } from "express";

import {
  createLink,
  deleteLink,
  getLinkById,
  getLinks,
  updateLink,
} from "../controllers/link.controller";

import { validateReqBody } from "../middlewares/validator.middleware";
import {
  createLinkSchema,
  linkSchema,
  updateLinkSchema,
} from "../schemas/link.schema";

const router = Router();

router.post("/", validateReqBody(createLinkSchema), createLink);

router.get("/", validateReqBody(linkSchema), getLinks);

router.get("/:id", validateReqBody(linkSchema), getLinkById);

router.put("/:id", validateReqBody(updateLinkSchema), updateLink);

router.delete("/:id", validateReqBody(linkSchema), deleteLink);

export default router;
