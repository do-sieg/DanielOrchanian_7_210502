import express from 'express';
import { auth } from '../middlewares/auth';
import { handleServerError } from '../utils/errorHandler';
import { decodeToken } from '../utils/token';
import { getUserById } from '../database/users';
import { createPost, getAllParentPosts } from '../database/posts';

const router = express.Router();

router.get("/", auth, async (req, res, next) => {
    try {
        const rows = await getAllParentPosts();
        res.status(200).json({ data: rows });
    } catch (err) {
        handleServerError(req, res, err);
    }
});

router.post("/", auth, async (req, res, next) => {
    try {
        console.log(req.body);
        const decoded = decodeToken(req.accessToken);
        const findUser = await getUserById(decoded.user_id, ["user_id"]);
        if (findUser) {
            await createPost(findUser.user_id, req.body.title, req.body.text);
            res.status(200).json({ message : "Created post" });
        } else {
            res.status(404).json({ message: "Can't find user." });
        }
    } catch (err) {
        handleServerError(req, res, err);
    }
});

export default router;