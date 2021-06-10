import fs from 'fs';
import express from 'express';
import { auth, isPostOwner } from '../middlewares/auth';
import { handleServerError } from '../utils/errorHandler';
import { decodeToken } from '../utils/token';
import { getUserById, ROLE_ADMIN } from '../database/users';
import { createPost, deletePost, editPost, getAllParentPosts, getPostById, getPostWithReplies } from '../database/posts';
import { midUploadImg } from '../middlewares/midMulter';

// Create router
const router = express.Router();

// Get all base posts
router.get("/", auth, async (req, res, next) => {
    try {
        const rows = await getAllParentPosts();
        res.status(200).json({ data: rows });
    } catch (err) {
        handleServerError(req, res, err);
    }
});

// Get post data (view)
router.get("/view/:id", auth, async (req, res, next) => {
    try {
        const post = await getPostWithReplies(req.params.id);
        if (post === null) {
            res.status(404).json({ message: "Message introuvable." });
        } else {
            res.status(200).json({ data: post });
        }
    } catch (err) {
        handleServerError(req, res, err);
    }
});

// Get post data (edit)
router.get("/edit/:id", auth, async (req, res, next) => {
    try {
        const post = await getPostWithReplies(req.params.id);
        if (post === null) {
            res.status(404).json({ message: "Message introuvable." });
        } else {
            // Check if post belongs to the user
            if (isPostOwner(req, res, post.userId)) {
                res.status(200).json({ data: post });
            } else {
                res.status(403).json({ message: "Action non autorisée." });
            }
        }
    } catch (err) {
        handleServerError(req, res, err);
    }
});

// Create post
router.post("/", auth, midUploadImg, async (req, res, next) => {
    try {
        // Check if user exists
        const decoded = decodeToken(req.accessToken);
        const findUser = await getUserById(decoded.id, ["user_id"]);
        if (findUser) {
            let body = req.body;
            let imagePath = "";
            // If an image was uploaded
            if (req.file) {
                body = JSON.parse(req.body.data);
                imagePath = req.file.filename;
            }
            // Check if parameters are missing or empty
            if (!body.text || !body.title) {
                res.status(400).json({ message: "Paramètres invalides ou manquants." });
            } else {
                // Create post
                await createPost(0, findUser.user_id, body.title, body.text, imagePath);
                res.status(200).json({ message: "Message publié." });
            }

        } else {
            res.status(404).json({ message: "Utilisateur introuvable." });
        }
    } catch (err) {
        handleServerError(req, res, err);
    }
});

// Update post
router.put("/:id", auth, midUploadImg, async (req, res, next) => {
    try {
        // Check if post exists
        const findPost = await getPostById(req.params.id, ["post_id", "post_user_id", "post_image_path"]);
        if (findPost) {
            // Check if user exists
            const decoded = decodeToken(req.accessToken);
            const findUser = await getUserById(decoded.id, ["user_id"]);
            // Check if user is the author
            if (isPostOwner(req, res, findPost.post_user_id)) {
                if (findUser) {
                    let body = req.body;
                    let imagePath = "";
                    // If an image was uploaded
                    if (req.file) {
                        if (findPost.post_image_path) {
                            // Delete previous image file
                            fs.unlink(`public/images/${findPost.post_image_path}`, (err) => {
                                if (err) console.error(err);
                            });
                        }
                        body = JSON.parse(req.body.data);
                        imagePath = req.file.filename;
                    // If no image was uploaded
                    } else {
                        imagePath = body.imagePath;
                        // Delete image file if not needed anymore
                        if (findPost.post_image_path && !body.imagePath) {
                            fs.unlink(`public/images/${findPost.post_image_path}`, (err) => {
                                if (err) console.error(err);
                            });
                        }
                    }
                    // Check if parameters are missing or empty
                    if (!req.params.id || !body.text || !body.title) {
                        res.status(400).json({ message: "Paramètres invalides ou manquants." });
                    } else {
                        // Update post
                        await editPost(req.params.id, body.title, body.text, imagePath);
                        res.status(200).json({ message: "Message mis à jour." });
                    }
                } else {
                    res.status(404).json({ message: "Utilisateur introuvable." });
                }
            } else {
                res.status(403).json({ message: "Action non autorisée." });
            }
        } else {
            res.status(404).json({ message: "Message introuvable." });
        }
    } catch (err) {
        handleServerError(req, res, err);
    }
});

// Post a reply
router.post("/reply/:id", auth, async (req, res, next) => {
    try {
        // Check if user exists
        const decoded = decodeToken(req.accessToken);
        const findUser = await getUserById(decoded.id, ["user_id"]);
        if (findUser) {
            // Check if parameters are missing or empty
            if (!req.params.id || !req.body.text || !req.body.title) {
                res.status(400).json({ message: "Paramètres invalides ou manquants." });
            } else {
                // Create reply post
                await createPost(req.params.id, findUser.user_id, req.body.title, req.body.text);
                res.status(200).json({ message: "Message créé." });
            }
        } else {
            res.status(404).json({ message: "Utilisateur introuvable." });
        }
    } catch (err) {
        handleServerError(req, res, err);
    }
});

// Delete post
router.delete("/:id", auth, async (req, res, next) => {
    try {
        // Check if post exists
        const findPost = await getPostById(req.params.id, ["post_id", "post_user_id", "post_image_path"]);
        if (findPost) {
            // Check if user exists
            const decoded = decodeToken(req.accessToken);
            const findUser = await getUserById(decoded.id, ["user_id", "user_role"]);
            // Check if user is the author
            if (isPostOwner(req, res, findPost.post_user_id) || findUser.user_role === ROLE_ADMIN) {
                // Delete image file
                if (findPost.post_image_path) {
                    fs.unlink(`public/images/${findPost.post_image_path}`, (err) => {
                        if (err) console.error(err);
                    });
                }
                // Delete post
                await deletePost(findPost.post_id);
                res.status(200).json({ message: "Message supprimé" });
            } else {
                res.status(403).json({ message: "Action non autorisée." });
            }
        } else {
            res.status(404).json({ message: "Message introuvable." });
        }
    } catch (err) {
        handleServerError(req, res, err);
    }
});

export default router;
