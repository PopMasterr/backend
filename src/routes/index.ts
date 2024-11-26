import { Router } from "express";
import users from "./users";
import populationService from "./populationService";
import images from "./images";
import userMetrics from "./userMetrics";
import achievements from "./achievements";
import userAchievements from "./userAchievements";

const router = Router();

router.use("/auth", users);
router.use("/population", populationService);
router.use("/profileImage", images);
router.use("/userMetrics", userMetrics);
router.use("/achievements", achievements);
router.use("/userAchievements", userAchievements);

export default router;

