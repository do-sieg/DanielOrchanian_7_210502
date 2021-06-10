import express from 'express';
import { createToken } from '../utils/token';
import { createUser, getUserByEmail } from '../database/users';
import { encryptPassword, verifyPassword } from '../utils/bcrypt';
import { handleServerError } from '../utils/errorHandler';
import { isValidPassword, validateBodyFields, VLD_IS_EMAIL, VLD_NOT_EMPTY_STRING, VLD_NO_SPECIAL_CHARS } from '../utils/validation';

// Create router
const router = express.Router();

// Signup
router.post("/signup",
    // Validate fields
    validateBodyFields({
        firstName: [VLD_NOT_EMPTY_STRING, VLD_NO_SPECIAL_CHARS],
        lastName: [VLD_NOT_EMPTY_STRING, VLD_NO_SPECIAL_CHARS],
        email: [VLD_NOT_EMPTY_STRING, VLD_IS_EMAIL],
        password: [VLD_NOT_EMPTY_STRING],
    }),
    (req, res, next) => {
        if (isValidPassword(req.body.password)) {
            next();
        } else {
            res.status(400).json({ message: "Mot de passe non valide (6 caractères minimum, une majuscule, une minuscule, un chiffre et un caractère spécial)." });
        }
    },
    async (req, res, next) => {
        try {
            // Check if a user with this email doesn't exist
            const findUser = await getUserByEmail(req.body.email);
            if (!findUser) {
                // Encrypt password
                const hash = await encryptPassword(req.body.password);
                // Create user
                const result = await createUser(req.body.firstName, req.body.lastName, req.body.email, hash, req.body.imagePath);
                res.status(200).json({ data: result, message: "Utilisateur enregistré." });
            } else {
                res.status(400).json({ data: null, message: "Utilisateur déjà existant." });
            }
        } catch (err) {
            handleServerError(req, res, err);
        }
    }
);

// Login
router.post("/login",
    // Validate fields
    validateBodyFields({
        email: [VLD_NOT_EMPTY_STRING, VLD_IS_EMAIL],
        password: [VLD_NOT_EMPTY_STRING],
    }),
    (req, res, next) => {
        if (isValidPassword(req.body.password)) {
            next();
        } else {
            res.status(400).json({ message: "Mot de passe non valide (6 caractères minimum, une majuscule, une minuscule, un chiffre et un caractère spécial)." });
        }
    },
    async (req, res, next) => {
        try {
            // Check if a user with this email exists
            const findUser = await getUserByEmail(req.body.email, [
                "user_id AS id",
                "user_password AS password",
                "user_role AS role",
            ]);
            if (findUser) {
                // Check password
                const match = await verifyPassword(req.body.password, findUser.password);
                if (match === true) {
                    // Create and send token
                    const token = await createToken({ id: findUser.id, role: findUser.role });
                    res.status(200).json({ data: token, message: "Utilisateur connecté." });
                } else {
                    res.status(400).json({ data: null, message: "Identifiants invalides." });
                }
            } else {
                res.status(400).json({ data: null, message: "Identifiants invalides." });
            }
        } catch (err) {
            handleServerError(req, res, err);
        }
    }
);

export default router;
