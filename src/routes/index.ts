import { Router } from "express";
import users from "./users";
import populationService from "./populationService";
import images from "./images";

const router = Router();


// router most likely uses some of the decorator pattern ideas
router.use("/auth", users);
router.use("/population", populationService);
router.use("/profileImage", images);

export default router;

