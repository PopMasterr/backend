import { Router } from "express";
import users from "./users";
import populationService from "./populationService";

const router = Router();


// router most likely uses some of the decorator pattern ideas
router.use("/auth", users);
router.use("/population", populationService);

export default router;

