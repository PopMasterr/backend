import express from "express";
import { getAllGameSessionScoresUpToRound } from "../controllers/gameScoresController";

const router = express.Router();

router.get("/getGameScores/:gameSessionId/:upToRound", async (req, res) => {
    try {
        const gameSessionId = req.params.gameSessionId;
        const upToRound = req.params.upToRound;

        const scores = await getAllGameSessionScoresUpToRound(Number(gameSessionId), Number(upToRound));

        if (scores === null) {
            res.status(404).json({ message: `Game scores not found` });
        } else {
            const scoresObject = Object.fromEntries(scores);
            res.status(200).json(scoresObject);
        }
    } catch (error) {
        res.status(500).json({ message: `Failed to get game scores ${error}` });
    }
});

export default router;