import { Router } from "express";

import {
  createGroup,
  deleteGroup,
  getGroupById,
  getGroups,
  updateGroup,
} from "../controllers/group.controller";

import { validateReqBody } from "../middlewares/validator.middleware";
import { groupSchema } from "../schemas/group.schema";

const router = Router();

router.post("/", validateReqBody(groupSchema), createGroup);

router.get("/", getGroups);

router.get("/:id", getGroupById);

router.put("/:id", validateReqBody(groupSchema), updateGroup);

router.delete("/:id", deleteGroup);

export default router;
