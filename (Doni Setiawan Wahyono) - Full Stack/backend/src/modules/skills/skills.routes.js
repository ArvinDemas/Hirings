import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { searchSkills } from "./skills.controller.js";
import { searchSkillsSchema } from "./skills.validation.js";

const router = Router();

router.use(authenticate);

router.get("/search", validate(searchSkillsSchema), searchSkills);

export default router;
