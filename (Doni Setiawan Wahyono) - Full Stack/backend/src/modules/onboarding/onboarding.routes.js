import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  confirmOnboarding,
  deleteSkill,
  getCurrentOnboarding,
  submitManualSkills,
  updateDraftSkills,
  uploadCv,
} from "./onboarding.controller.js";
import { uploadCv as uploadCvMiddleware } from "./onboarding.upload.js";
import {
  confirmOnboardingSchema,
  deleteSkillSchema,
  manualSkillsSchema,
  updateSkillsSchema,
} from "./onboarding.validation.js";

const router = Router();

router.use(authenticate);

router.get("/me", getCurrentOnboarding);
router.post("/cv-uploads", uploadCvMiddleware, uploadCv);
router.post("/manual-skills", validate(manualSkillsSchema), submitManualSkills);
router.patch("/skills", validate(updateSkillsSchema), updateDraftSkills);
router.post("/confirm", validate(confirmOnboardingSchema), confirmOnboarding);
router.delete("/skills/:skillId", validate(deleteSkillSchema), deleteSkill);

export default router;
