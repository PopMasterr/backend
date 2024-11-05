import { Router } from "express";
import users from "./users";
import populationService from "./populationService";
import images from "./images";
import userMetrics from "./userMetrics";

const router = Router();

router.use("/auth", users);
router.use("/population", populationService);
router.use("/profileImage", images);
router.use("/userMetrics", userMetrics);

export default router;

