import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import careerRecommendationRoutes from "../modules/career-recommendations/career-recommendations.routes.js";
import onboardingRoutes from "../modules/onboarding/onboarding.routes.js";
import skillGapRoutes from "../modules/skill-gap/skill-gap.routes.js";
import skillsRoutes from "../modules/skills/skills.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/career-recommendations", careerRecommendationRoutes);
router.use("/onboarding", onboardingRoutes);
router.use("/skill-gap", skillGapRoutes);
router.use("/skills", skillsRoutes);

export default router;
