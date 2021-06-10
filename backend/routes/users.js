import express from 'express';
import { auth } from '../middlewares/auth';
import { handleServerError } from '../utils/errorHandler';
import { decodeToken } from '../utils/token';
import { deleteUser, getUserById, updateUser } from '../database/users';
import { validateBodyFields, VLD_NOT_EMPTY_STRING, VLD_NO_SPECIAL_CHARS } from '../utils/validation';

// Create router
const router = express.Router();

// Get profile information
router.get("/profile", auth, async (req, res, next) => {
    try {
        // Check if user exists
        const decoded = decodeToken(req.accessToken);
        const findUser = await getUserById(decoded.id, [
            "user_first_name AS firstName",
            "user_last_name AS lastName",
        ]);
        if (findUser) {
            // Send user information
            res.status(200).json({ data: findUser });
        } else {
            throw new Error("Utilisateur introuvable.");
        }
    } catch (err) {
        handleServerError(req, res, err);
    }
});

// Update profile information
router.put("/profile", auth,
    validateBodyFields({
        firstName: [VLD_NOT_EMPTY_STRING, VLD_NO_SPECIAL_CHARS],
        lastName: [VLD_NOT_EMPTY_STRING, VLD_NO_SPECIAL_CHARS],
    }),
    async (req, res, next) => {
        try {
            // Check if user exists
            const decoded = decodeToken(req.accessToken);
            const findUser = await getUserById(decoded.id, ["user_id"]);
            if (findUser) {
                // Update user information
                await updateUser(findUser.user_id, req.body.firstName, req.body.lastName);
                res.status(200).json({ message: "Profil mis à jour." });
            } else {
                res.status(404).json({ message: "Utilisateur introuvable." });
            }
        } catch (err) {
            handleServerError(req, res, err);
        }
    }
);

// Delete user account
router.delete("/profile", auth, async (req, res, next) => {
    try {
        // Check if user exists
        const decoded = decodeToken(req.accessToken);
        const findUser = await getUserById(decoded.id, ["user_id"]);
        if (findUser) {
            // Delete user account
            await deleteUser(findUser.user_id);
            res.status(200).json({ message: "Profil supprimé." });
        } else {
            res.status(404).json({ message: "Utilisateur introuvable." });
        }
    } catch (err) {
        handleServerError(req, res, err);
    }
});

export default router;
