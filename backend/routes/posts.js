import express from 'express';
import { auth } from '../middlewares/auth';
import { handleServerError } from '../utils/errorHandler';
import { decodeToken } from '../utils/token';
import { getUserById } from '../database/users';
import { createPost, deletePost, getAllParentPosts, getPostById, getPostWithReplies } from '../database/posts';
import { midUploadImg } from '../middlewares/midMulter';

const router = express.Router();

router.get("/", auth, async (req, res, next) => {
    try {
        const rows = await getAllParentPosts();
        res.status(200).json({ data: rows });
    } catch (err) {
        handleServerError(req, res, err);
    }
});

router.get("/view/:id", auth, async (req, res, next) => {
    try {
        const post = await getPostWithReplies(req.params.id);
        if (post === null) {
            res.status(404).json({ message: "Can't find post" });
        } else {
            res.status(200).json({ data: post });
        }
    } catch (err) {
        handleServerError(req, res, err);
    }
});

router.post("/", auth, midUploadImg, async (req, res, next) => {
    try {
        const decoded = decodeToken(req.accessToken);
        const findUser = await getUserById(decoded.user_id, ["user_id"]);
        if (findUser) {
            let body = req.body;
            let imagePath = "";
            if (req.file) {
                body = JSON.parse(req.body.data);
                imagePath = req.file.filename;
            }

            await createPost(0, findUser.user_id, body.title, body.text, imagePath);
            
            res.status(200).json({ message: "Created post" });
        } else {
            res.status(404).json({ message: "Can't find user." });
        }
    } catch (err) {
        handleServerError(req, res, err);
    }
});


router.post("/reply/:id", auth, async (req, res, next) => {
    try {
        const decoded = decodeToken(req.accessToken);
        const findUser = await getUserById(decoded.user_id, ["user_id"]);
        if (findUser) {
            await createPost(req.params.id, findUser.user_id, req.body.title, req.body.text);
            res.status(200).json({ message: "Created post" });
        } else {
            res.status(404).json({ message: "Can't find user." });
        }
    } catch (err) {
        handleServerError(req, res, err);
    }
});

router.delete("/:id", auth, async (req, res, next) => {
    try {
        const findPost = await getPostById(req.params.id, ["post_id"]);
        if (findPost) {
            await deletePost(findPost.post_id);
            res.status(200).json({ message: "Deleted post" });
        } else {
            res.status(404).json({ message: "Can't find post." });
        }

    } catch (err) {
        handleServerError(req, res, err);
    }
});

export default router;