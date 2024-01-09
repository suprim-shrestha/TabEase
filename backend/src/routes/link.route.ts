import { Router } from "express";

import {
  createLink,
  deleteLink,
  getLinkById,
  getLinks,
  updateLink,
} from "../controllers/link.controller";

import {
  validateReqBody,
  validateReqQuery,
} from "../middlewares/validator.middleware";
import {
  createLinkSchema,
  linkQuerySchema,
  updateLinkSchema,
} from "../schemas/link.schema";

const router = Router();

router.post(
  "/",
  validateReqQuery(linkQuerySchema),
  validateReqBody(createLinkSchema),
  createLink
);

router.get("/", validateReqQuery(linkQuerySchema), getLinks);

router.get("/:id", validateReqQuery(linkQuerySchema), getLinkById);

router.put(
  "/:id",
  validateReqQuery(linkQuerySchema),
  validateReqBody(updateLinkSchema),
  updateLink
);

router.delete("/:id", validateReqQuery(linkQuerySchema), deleteLink);

export default router;
