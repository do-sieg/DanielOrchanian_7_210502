import fs from 'fs';
import express from 'express';
import { auth, isOwner } from '../middlewares/auth';
import { handleServerError } from '../utils/errorHandler';
import { decodeToken } from '../utils/token';
import { getUserById } from '../database/users';
import { createPost, deletePost, editPost, getAllParentPosts, getPostById, getPostWithReplies } from '../database/posts';
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
        const findUser = await getUserById(decoded.id, ["user_id"]);
        if (findUser) {
            let body = req.body;
            let imagePath = "";
            if (req.file) {
                body = JSON.parse(req.body.data);
                imagePath = req.file.filename;
            }

            if (!body.text || !body.title) {
                res.status(400).json({ message: "Missing parameters." });
            } else {
                await createPost(0, findUser.user_id, body.title, body.text, imagePath);
                res.status(200).json({ message: "Created post" });
            }

        } else {
            res.status(404).json({ message: "Can't find user." });
        }
    } catch (err) {
        handleServerError(req, res, err);
    }
});


router.put("/:id", auth, midUploadImg, async (req, res, next) => {
    try {

        const findPost = await getPostById(req.params.id, ["post_id", "post_user_id", "post_image_path"]);
        if (findPost) {
            const decoded = decodeToken(req.accessToken);
            const findUser = await getUserById(decoded.id, ["user_id", "user_role"]);
            if (isOwner(req, res, findPost.post_user_id, findUser.user_role)) {
                if (findUser) {
                    let body = req.body;
                    let imagePath = "";
                    if (req.file) {
                        if (findPost.post_image_path) {
                            fs.unlink(`public/images/${findPost.post_image_path}`, (err) => {
                                if (err) console.error(err);
                            });
                        }
                        body = JSON.parse(req.body.data);
                        imagePath = req.file.filename;
                    } else {
                        if (findPost.post_image_path && !body.imagePath) {
                            fs.unlink(`public/images/${findPost.post_image_path}`, (err) => {
                                if (err) console.error(err);
                            });
                        }
                    }

                    if (!req.params.id || !body.text || !body.title) {
                        res.status(400).json({ message: "Missing parameters." });
                    } else {
                        await editPost(req.params.id, body.title, body.text, imagePath);
                        res.status(200).json({ message: "Updated post" });
                    }
                } else {
                    res.status(404).json({ message: "Can't find user." });
                }
            } else {
                res.status(403).json({ message: "Not authorized for this action." });
            }
        } else {
            res.status(404).json({ message: "Can't find post." });
        }

    } catch (err) {
        handleServerError(req, res, err);
    }
});


router.post("/reply/:id", auth, async (req, res, next) => {
    try {
        const decoded = decodeToken(req.accessToken);
        const findUser = await getUserById(decoded.id, ["user_id"]);
        if (findUser) {
            if (!req.params.id || !req.body.text || !req.body.title) {
                res.status(400).json({ message: "Missing parameters." });
            } else {
                await createPost(req.params.id, findUser.user_id, req.body.title, req.body.text);
                res.status(200).json({ message: "Created post" });
            }
        } else {
            res.status(404).json({ message: "Can't find user." });
        }
    } catch (err) {
        handleServerError(req, res, err);
    }
});

router.delete("/:id", auth, async (req, res, next) => {
    try {
        const findPost = await getPostById(req.params.id, ["post_id", "post_user_id", "post_image_path"]);
        if (findPost) {
            const decoded = decodeToken(req.accessToken);
            const findUser = await getUserById(decoded.id, ["user_id", "user_role"]);
            if (isOwner(req, res, findPost.post_user_id, findUser.user_role)) {

                if (findPost.post_image_path) {
                    fs.unlink(`public/images/${findPost.post_image_path}`, (err) => {
                        if (err) console.error(err);
                    });
                }

                await deletePost(findPost.post_id);
                res.status(200).json({ message: "Deleted post" });
            } else {
                res.status(403).json({ message: "Not authorized for this action." });
            }
        } else {
            res.status(404).json({ message: "Can't find post." });
        }
    } catch (err) {
        handleServerError(req, res, err);
    }
});

export default router;