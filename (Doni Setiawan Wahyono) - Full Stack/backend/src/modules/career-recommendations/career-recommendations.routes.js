import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  deleteSavedCareer,
  generateRecommendations,
  getFilters,
  getLatestRecommendations,
  saveCareer,
} from "./career-recommendations.controller.js";
import {
  deleteSavedCareerSchema,
  generateRecommendationsSchema,
  recommendationQuerySchema,
  saveCareerSchema,
} from "./career-recommendations.validation.js";

const router = Router();

router.use(authenticate);

router.get("/filters", getFilters);
router.get("/latest", validate(recommendationQuerySchema), getLatestRecommendations);
router.post("/generate", validate(generateRecommendationsSchema), generateRecommendations);
router.post("/saved", validate(saveCareerSchema), saveCareer);
router.delete("/saved/:careerId", validate(deleteSavedCareerSchema), deleteSavedCareer);

export default router;
