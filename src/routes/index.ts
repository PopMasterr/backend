import { Router } from "express";
import users from "./users"

const router = Router();


// router most likely uses some of the decorator pattern ideas
router.use("/auth", users);

export default router;

