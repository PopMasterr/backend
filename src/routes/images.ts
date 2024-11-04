import express, { Request, Response } from 'express';
import multer from 'multer';
import { uploadImage, getImagesByUserId, removeImageByUserId } from '../controllers/imagesController';
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


export default router;
