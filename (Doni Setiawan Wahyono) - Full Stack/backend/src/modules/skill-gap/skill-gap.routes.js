import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  analyzeSkillGap,
  getLatestAnalysis,
  getTargets,
} from "./skill-gap.controller.js";
import { analyzeSkillGapSchema } from "./skill-gap.validation.js";

const router = Router();

router.use(authenticate);

router.get("/targets", getTargets);
router.get("/analyses/latest", getLatestAnalysis);
router.post("/analyses", validate(analyzeSkillGapSchema), analyzeSkillGap);

export default router;
