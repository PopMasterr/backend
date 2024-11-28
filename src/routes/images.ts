import express, { Request, Response } from 'express';
import multer from 'multer';
import { uploadImage, getImageByUserId, removeImageByUserId, updateImageByUserId } from '../controllers/imagesController';
import { authenticateToken } from '../middleware/jwtMiddleware';
import { checkBlacklist } from '../middleware/blackList';

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
    },
});

router.post('/upload', upload.single("profilePicture"), authenticateToken, checkBlacklist, async (req: Request, res: Response) => {
    const userId = req.body.user?.id;
    const profilePicture: Express.Multer.File | undefined = req.file;
    try {

        if (!profilePicture) {
            res.status(400).send('No file uploaded');
            return;
        }

        const imageUrl = await uploadImage(profilePicture, userId);
        res.status(200).json({ imageUrl });
    } catch (error) {
        res.status(500).json({ error: `Image upload failed: ${error}` });
    }
});

router.get("/getImage", authenticateToken, checkBlacklist, async (req: Request, res: Response) => {
    const userId = req.body.user?.id;
    try {
        const imageUrl = await getImageByUserId(userId);
        res.status(200).json({ imageUrl });
    } catch (error) {
        res.status(500).json({ error: `Failed to get image: ${error}` });
    }
});

router.post("/updateImage", upload.single("profilePicture"), authenticateToken, checkBlacklist, async (req: Request, res: Response) => {
    const userId = req.body.user?.id;
    const profilePicture: Express.Multer.File | undefined = req.file;

    try {
        if (!profilePicture) {
            res.status(400).send('No file uploaded');
            return;
        }

        const imageUrl = await updateImageByUserId(profilePicture, userId);
        res.status(200).json({ imageUrl });
    } catch (error) {
        res.status(500).json({ error: `Failed to update image: ${error}` });
    }
});

router.post("/removeImage", authenticateToken, checkBlacklist, async (req: Request, res: Response) => {
    const userId = req.body.user?.id;

    try {
        const imageUrl = await removeImageByUserId(userId);
        if (!imageUrl){
            res.status(400).send('No image found');
        }

        res.status(200).json({ imageUrl });
    } catch (error) {
        res.status(500).json({ error: `Failed to remove image: ${error}` });
    }
});


export default router;
