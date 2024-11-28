import pool from '../config/db';
import { RowDataPacket } from 'mysql2';
import { bucket } from './../middleware/gcsClient';
import { v4 as uuidv4 } from 'uuid';

export const uploadImage = async (file: Express.Multer.File, userId: string): Promise<string> => {
    const usersImages = await getImageByUserId(userId);

    if (usersImages.length > 0) {
        throw new Error('User already has an image');
    }

    const uniqueId = uuidv4();
    const fileName = `${uniqueId}_${file.originalname}`;
    const blob = bucket.file(fileName);

    try {
        await blob.save(file.buffer, {
            resumable: false,
            contentType: file.mimetype,
        });

        const query = 'INSERT INTO images (user_id, url) VALUES (?, ?)';
        await pool.query(query, [userId, fileName]);
        await blob.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

        return publicUrl;
    } catch (err: any | Error) {
        throw new Error(`Upload error: ${err.message}`);
    }
};

export const getImageByUserId = async (userId: string): Promise<string[]> => {
    const query = 'SELECT url FROM images WHERE user_id = ?';
    const [rows] = await pool.query<RowDataPacket[]>(query, [userId]);

    return rows.map((row) => (row as RowDataPacket).url);
};

export const updateImageByUserId = async (file: Express.Multer.File, userId: string): Promise<string> => {
    try {
        await removeImageByUserId(userId);
        const publicUrl = await uploadImage(file, userId);

        return publicUrl;
    } catch (err: any | Error) {
        throw new Error('failed to update the image');
    }
}

export const removeImageByUserId = async (userId: string): Promise<string> => {
    try {
        const queryGetImageUrl = 'SELECT url FROM images WHERE user_id = ?';
        const [rows] = await pool.query<RowDataPacket[]>(queryGetImageUrl, [userId]);
        const fileName = (rows[0] as RowDataPacket).url;

        const queryDeleteImage = 'DELETE FROM images WHERE user_id = ?';
        await pool.query(queryDeleteImage, [userId]);

        const blob = bucket.file(fileName as string);
        await blob.delete();
        return fileName;
    } catch (err: any | Error) {
        throw new Error('failed to delete the image');
    }
}
