import { Router } from "express";
import users from "./users";
import populationService from "./populationClassic";
import images from "./images";
import userMetrics from "./userMetrics";
import achievements from "./achievements";
import userAchievements from "./userAchievements";
import gameSessions from "./gameSessions";
import gameRounds from "./gameRounds";
import gameScores from "./gameScores";

const router = Router();

router.use("/auth", users);
router.use("/profileImage", images);
router.use("/userMetrics", userMetrics);

router.use("/population", populationService);

router.use("/achievements", achievements);
router.use("/userAchievements", userAchievements);

router.use("/gameSessions", gameSessions);
router.use("/gameRounds", gameRounds);
router.use("/gameScores", gameScores);

export default router;

